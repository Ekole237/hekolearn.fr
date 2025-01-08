/*
  # Create comments and notifications system

  1. New Tables
    - `comments`
      - Allow discussions on lessons
      - Support threaded replies
    
    - `notifications`
      - System notifications
      - Course updates
      - Achievement notifications
  
  2. Security
    - Enable RLS
    - Add policies for comments and notifications
*/

CREATE TYPE notification_type AS ENUM (
  'course_update',
  'achievement_earned',
  'comment_reply',
  'quiz_graded',
  'system'
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  lesson_id UUID REFERENCES lessons(id),
  parent_id UUID REFERENCES comments(id),
  content TEXT NOT NULL,
  edited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Comments are viewable by enrolled users"
  ON comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN lessons l ON l.course_id = ce.course_id
      WHERE l.id = comments.lesson_id
      AND ce.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Users can create comments on enrolled courses"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN lessons l ON l.course_id = ce.course_id
      WHERE l.id = lesson_id
      AND ce.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_comments_lesson ON comments(lesson_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Create function to notify on comment replies
CREATE OR REPLACE FUNCTION notify_comment_reply()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      content,
      data
    )
    SELECT 
      c.user_id,
      'comment_reply'::notification_type,
      'Nouvelle réponse à votre commentaire',
      substring(NEW.content from 1 for 100),
      jsonb_build_object(
        'comment_id', NEW.id,
        'lesson_id', NEW.lesson_id,
        'reply_author', (
          SELECT jsonb_build_object(
            'id', p.id,
            'full_name', p.full_name,
            'avatar_url', p.avatar_url
          )
          FROM profiles p
          WHERE p.id = NEW.user_id
        )
      )
    FROM comments c
    WHERE c.id = NEW.parent_id
    AND c.user_id != NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_comment_reply_trigger
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION notify_comment_reply();

-- Create function to notify course updates
CREATE OR REPLACE FUNCTION notify_course_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.title != NEW.title 
  OR OLD.description != NEW.description 
  OR OLD.published != NEW.published THEN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      content,
      data
    )
    SELECT 
      ce.user_id,
      'course_update'::notification_type,
      'Mise à jour du cours',
      'Le cours "' || NEW.title || '" a été mis à jour.',
      jsonb_build_object(
        'course_id', NEW.id,
        'course_title', NEW.title,
        'changes', jsonb_build_object(
          'title_changed', OLD.title != NEW.title,
          'description_changed', OLD.description != NEW.description,
          'published_changed', OLD.published != NEW.published
        )
      )
    FROM course_enrollments ce
    WHERE ce.course_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_course_update_trigger
AFTER UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION notify_course_update();
