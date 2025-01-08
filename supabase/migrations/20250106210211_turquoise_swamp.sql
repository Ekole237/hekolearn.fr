/*
  # Create lessons table

  1. New Tables
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `type` (text: 'video' or 'text')
      - `video_url` (text, optional)
      - `order_index` (integer)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `lessons` table
    - Add policy for authenticated users to read lessons
*/

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT CHECK (type IN ('video', 'text')) NOT NULL,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);