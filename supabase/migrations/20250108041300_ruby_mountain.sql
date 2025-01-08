/*
  # Create progress tracking and achievements system

  1. New Tables
    - `course_enrollments`
      - Track student enrollment in courses
      - Store progress and completion status
    
    - `lesson_progress`
      - Track individual lesson completion
      - Store last position in video lessons
    
    - `achievements`
      - Define available achievements/badges
    
    - `user_achievements`
      - Track user earned achievements
  
  2. Security
    - Enable RLS
    - Add policies for progress tracking
*/

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  lesson_id UUID REFERENCES lessons(id),
  completed BOOLEAN DEFAULT false,
  video_position INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  badge_url TEXT,
  requirement_type TEXT CHECK (requirement_type IN ('courses_completed', 'lessons_completed', 'quiz_score', 'custom')),
  requirement_value JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for course_enrollments
CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own enrollments"
  ON course_enrollments FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for lesson_progress
CREATE POLICY "Users can view their own lesson progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own lesson progress"
  ON lesson_progress FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for achievements
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only teachers can manage achievements"
  ON achievements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Policies for user_achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- Create functions for progress tracking
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new progress percentage
  WITH course_lessons AS (
    SELECT l.id
    FROM lessons l
    WHERE l.course_id = (
      SELECT course_id 
      FROM lessons 
      WHERE id = NEW.lesson_id
    )
  ),
  completed_lessons AS (
    SELECT COUNT(*) as completed
    FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    WHERE lp.user_id = NEW.user_id
    AND l.course_id = (
      SELECT course_id 
      FROM lessons 
      WHERE id = NEW.lesson_id
    )
    AND lp.completed = true
  )
  UPDATE course_enrollments
  SET 
    progress = (
      (SELECT completed FROM completed_lessons)::float / 
      (SELECT COUNT(*)::float FROM course_lessons)
    ) * 100,
    updated_at = now()
  WHERE user_id = NEW.user_id
  AND course_id = (
    SELECT course_id 
    FROM lessons 
    WHERE id = NEW.lesson_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_progress_trigger
AFTER INSERT OR UPDATE ON lesson_progress
FOR EACH ROW
EXECUTE FUNCTION update_course_progress();
