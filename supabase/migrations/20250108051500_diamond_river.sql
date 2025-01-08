/*
  # Mise à jour de la structure pour le système éducatif
  
  1. Nouvelles Tables
    - `subjects` : Matières scolaires
    - `chapters` : Chapitres des cours
    - `ai_recommendations` : Recommandations IA
    - `student_analytics` : Analyses détaillées des performances
  
  2. Modifications
    - Ajout de champs pour le niveau scolaire
    - Support des types de contenus spécifiques
*/

-- Création de la table des matières
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ajout des matières principales
INSERT INTO subjects (name, slug, description, order_index) VALUES
  ('Mathématiques', 'mathematiques', 'Cours de mathématiques du collège au lycée', 1),
  ('Français', 'francais', 'Langue et littérature française', 2),
  ('Histoire', 'histoire', 'Histoire de France et du monde', 3),
  ('Géographie', 'geographie', 'Géographie et études territoriales', 4),
  ('Anglais', 'anglais', 'Langue anglaise et culture anglo-saxonne', 5),
  ('Physique', 'physique', 'Sciences physiques', 6),
  ('Chimie', 'chimie', 'Chimie générale et organique', 7),
  ('Sciences Humaines', 'sciences-humaines', 'Sciences sociales et humaines', 8);

-- Création de la table des chapitres
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  objectives JSONB, -- Objectifs d'apprentissage
  prerequisites JSONB, -- Prérequis nécessaires
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ajout du niveau scolaire aux cours
ALTER TABLE courses ADD COLUMN grade_level TEXT[] CHECK (
  grade_level <@ ARRAY['6eme', '5eme', '4eme', '3eme', '2nde', '1ere', 'terminale']
);
ALTER TABLE courses ADD COLUMN subject_id UUID REFERENCES subjects(id);
ALTER TABLE courses ADD COLUMN estimated_duration INTERVAL;
ALTER TABLE courses ADD COLUMN learning_objectives JSONB;

-- Table pour les recommandations IA
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  lesson_id UUID REFERENCES lessons(id),
  recommendation_type TEXT CHECK (
    recommendation_type IN ('exercise', 'revision', 'next_topic', 'reinforcement')
  ),
  content JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'completed', 'rejected')
  ),
  created_at TIMESTAMPTZ DEFAULT now(),
  applied_at TIMESTAMPTZ
);

-- Table pour les analyses détaillées
CREATE TABLE student_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  chapter_id UUID REFERENCES chapters(id),
  lesson_id UUID REFERENCES lessons(id),
  quiz_id UUID REFERENCES quizzes(id),
  metric_type TEXT CHECK (
    metric_type IN (
      'time_spent',
      'completion_rate',
      'quiz_score',
      'engagement_level',
      'difficulty_rating'
    )
  ),
  metric_value JSONB NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Mise à jour de la table des leçons
ALTER TABLE lessons ADD COLUMN chapter_id UUID REFERENCES chapters(id);
ALTER TABLE lessons ADD COLUMN objectives JSONB;
ALTER TABLE lessons ADD COLUMN difficulty_level TEXT CHECK (
  difficulty_level IN ('easy', 'medium', 'hard')
);
ALTER TABLE lessons ADD COLUMN estimated_duration INTERVAL;

-- Indexes pour les performances
CREATE INDEX idx_courses_subject ON courses(subject_id);
CREATE INDEX idx_courses_grade ON courses USING GIN(grade_level);
CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_analytics_user_course ON student_analytics(user_id, course_id);
CREATE INDEX idx_recommendations_user ON ai_recommendations(user_id);

-- Politiques de sécurité
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_analytics ENABLE ROW LEVEL SECURITY;

-- Politiques pour les matières
CREATE POLICY "Subjects are viewable by everyone"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- Politiques pour les chapitres
CREATE POLICY "Chapters are viewable by enrolled users"
  ON chapters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      WHERE ce.course_id = chapters.course_id
      AND ce.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

-- Politiques pour les recommandations IA
CREATE POLICY "Users can view their own recommendations"
  ON ai_recommendations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Politiques pour les analyses
CREATE POLICY "Users can view their own analytics"
  ON student_analytics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can view all analytics"
  ON student_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );
