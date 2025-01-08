-- Disable triggers temporarily
-- ALTER TABLE categories DISABLE TRIGGER ALL;
-- ALTER TABLE courses DISABLE TRIGGER ALL;
-- ALTER TABLE chapters DISABLE TRIGGER ALL;
-- ALTER TABLE lessons DISABLE TRIGGER ALL;
-- ALTER TABLE quizzes DISABLE TRIGGER ALL;
-- ALTER TABLE quiz_questions DISABLE TRIGGER ALL;
-- ALTER TABLE course_enrollments DISABLE TRIGGER ALL;
-- ALTER TABLE lesson_progress DISABLE TRIGGER ALL;
-- ALTER TABLE achievements DISABLE TRIGGER ALL;
-- ALTER TABLE user_achievements DISABLE TRIGGER ALL;
-- ALTER TABLE comments DISABLE TRIGGER ALL;
-- ALTER TABLE notifications DISABLE TRIGGER ALL;

-- Clean all existing data (in correct order to avoid foreign key conflicts)
DELETE FROM notifications;
DELETE FROM comments;
DELETE FROM user_achievements;
DELETE FROM achievements;
DELETE FROM lesson_progress;
DELETE FROM course_enrollments;
DELETE FROM quiz_questions;
DELETE FROM quizzes;
DELETE FROM lessons;
DELETE FROM chapters;
DELETE FROM courses;
DELETE FROM categories;

-- Get and set the admin user
DO $$ 
DECLARE
    admin_id UUID;
    user_exists BOOLEAN;
    cat_math UUID := uuid_generate_v4();
    cat_fr UUID := uuid_generate_v4();
    cat_hist UUID := uuid_generate_v4();
    cat_eng UUID := uuid_generate_v4();
    cat_phys UUID := uuid_generate_v4();
    cat_svt UUID := uuid_generate_v4();
    
    course_math_1 UUID := uuid_generate_v4();
    course_math_2 UUID := uuid_generate_v4();
    course_fr_1 UUID := uuid_generate_v4();
    course_fr_2 UUID := uuid_generate_v4();
    course_hist UUID := uuid_generate_v4();
    course_phys UUID := uuid_generate_v4();
    
    chap_1 UUID := uuid_generate_v4();
    chap_2 UUID := uuid_generate_v4();
    chap_3 UUID := uuid_generate_v4();
    
    lesson_1 UUID := uuid_generate_v4();
    lesson_2 UUID := uuid_generate_v4();
    lesson_3 UUID := uuid_generate_v4();
    
    quiz_1 UUID := uuid_generate_v4();
    quiz_2 UUID := uuid_generate_v4();
BEGIN
    -- Check if user exists
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'ekoledev@gmail.com'
    ) INTO user_exists;

    IF NOT user_exists THEN
        RAISE EXCEPTION 'User ekoledev@gmail.com does not exist. Please create the user first.';
    END IF;

    -- Get the user ID
    SELECT id INTO admin_id FROM auth.users WHERE email = 'ekoledev@gmail.com';
    
    -- Create or update profile with correct structure
    INSERT INTO profiles (
        id,
        email,
        full_name,
        avatar_url,
        role,
        grade_level,
        created_at,
        updated_at
    )
    VALUES (
        admin_id,
        'ekoledev@gmail.com',
        'Admin Teacher',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=ekoledev',
        'teacher',
        NULL,  -- teachers don't have grade level
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        role = 'teacher',
        updated_at = NOW();

    -- Insert categories (matières)
    INSERT INTO categories (id, name, description, slug, order_index) VALUES
    (cat_math, 'Mathématiques', 'De la 6ème à la Terminale - Algèbre, Géométrie, Analyse', 'mathematiques', 1),
    (cat_fr, 'Français', 'Grammaire, Conjugaison, Littérature', 'francais', 2),
    (cat_hist, 'Histoire-Géographie', 'Histoire de France et du monde, Géographie', 'histoire-geographie', 3),
    (cat_eng, 'Anglais', 'Apprentissage de l''anglais tous niveaux', 'anglais', 4),
    (cat_phys, 'Physique-Chimie', 'Sciences physiques et chimiques', 'physique-chimie', 5),
    (cat_svt, 'SVT', 'Sciences de la Vie et de la Terre', 'svt', 6);

    -- Insert courses
    INSERT INTO courses (id, category_id, title, description, slug, image_url, duration, difficulty, published, author_id) VALUES
    -- Mathématiques 6ème
    (course_math_1, cat_math, 'Mathématiques 6ème - Nombres et Calculs', 'Maîtrisez les opérations sur les nombres entiers et décimaux', 'maths-6e-nombres', '/images/courses/maths-6.png', interval '10 hours', 'beginner', true, admin_id),
    (course_math_2, cat_math, 'Mathématiques 6ème - Géométrie', 'Découverte des figures géométriques', 'maths-6e-geometrie', '/images/courses/geometry-6.png', interval '8 hours', 'beginner', true, admin_id),
    
    -- Français 6ème
    (course_fr_1, cat_fr, 'Français 6ème - Grammaire', 'Les bases de la grammaire française', 'francais-6e-grammaire', '/images/courses/francais-6.png', interval '12 hours', 'beginner', true, admin_id),
    (course_fr_2, cat_fr, 'Français 6ème - Conjugaison', 'Les temps de l''indicatif', 'francais-6e-conjugaison', '/images/courses/conjugaison-6.png', interval '10 hours', 'beginner', true, admin_id),
    
    -- Histoire-Géo 6ème
    (course_hist, cat_hist, 'Histoire 6ème - L''Antiquité', 'Découverte des premières civilisations', 'histoire-6e-antiquite', '/images/courses/histoire-6.png', interval '15 hours', 'beginner', true, admin_id),
    
    -- Physique-Chimie 3ème
    (course_phys, cat_phys, 'Physique-Chimie 3ème - La matière', 'États de la matière et transformations', 'physique-3e-matiere', '/images/courses/physique-3.png', interval '20 hours', 'intermediate', true, admin_id);

    -- Insert chapters pour le cours de Maths 6ème
    INSERT INTO chapters (id, course_id, title, description, order_index, objectives) VALUES
    (chap_1, course_math_1, 'Les nombres entiers', 'Comprendre et manipuler les nombres entiers', 1, 
    '["Comprendre la notion de nombre entier", "Maîtriser les opérations de base", "Résoudre des problèmes simples"]'::jsonb),
    (chap_2, course_math_1, 'Les nombres décimaux', 'Découverte et manipulation des nombres décimaux', 2,
    '["Comprendre la notion de nombre décimal", "Placer des nombres sur une droite graduée", "Comparer des nombres décimaux"]'::jsonb),
    (chap_3, course_math_1, 'Les fractions', 'Introduction aux fractions', 3,
    '["Comprendre ce qu''est une fraction", "Comparer des fractions simples", "Additionner des fractions de même dénominateur"]'::jsonb);

    -- Insert lessons
    INSERT INTO lessons (id, course_id, title, content, type, order_index) VALUES
    (lesson_1, course_math_1, 'Qu''est-ce qu''un nombre entier ?', 
    '{"content": "Un nombre entier est un nombre qui peut être écrit sans virgule...", "examples": ["1", "42", "-5"], "exercises": ["Classez ces nombres par ordre croissant"]}', 
    'text', 1),
    (lesson_2, course_math_1, 'Addition et soustraction', 
    '{"content": "L''addition permet d''ajouter deux nombres...", "video_url": "/videos/maths/addition.mp4", "duration": "8:30"}',
    'video', 2),
    (lesson_3, course_math_1, 'Multiplication', 
    '{"content": "La multiplication est une addition répétée...", "tables": ["Table de 2", "Table de 3", "Table de 4"]}',
    'text', 3);

    -- Insert quizzes
    INSERT INTO quizzes (id, lesson_id, title, description) VALUES
    (quiz_1, lesson_1, 'Quiz - Les nombres entiers', 'Vérifions votre compréhension des nombres entiers'),
    (quiz_2, lesson_2, 'Quiz - Additions et soustractions', 'Testez vos connaissances sur les opérations de base');

    -- Insert quiz questions
    INSERT INTO quiz_questions (id, quiz_id, question, options, correct_answer, order_index) VALUES
    (uuid_generate_v4(), quiz_1, 'Quel est le plus petit nombre entier positif ?', '["0", "1", "-1", "10"]'::jsonb, 1, 1),
    (uuid_generate_v4(), quiz_1, 'Parmi ces nombres, lequel n''est PAS un nombre entier ?', '["5", "0", "3.5", "-2"]'::jsonb, 2, 2),
    (uuid_generate_v4(), quiz_2, 'Combien font 15 + 7 ?', '["21", "22", "23", "24"]'::jsonb, 1, 1);

    -- Insert achievements
    INSERT INTO achievements (id, name, description, requirement_type, requirement_value) VALUES
    (uuid_generate_v4(), 'Mathématicien en herbe', 'Terminez votre premier cours de mathématiques', 'courses_completed', '{"category": "mathematiques", "count": 1}'::jsonb),
    (uuid_generate_v4(), 'Expert en nombres', 'Obtenez 100% à tous les quiz du chapitre sur les nombres', 'quiz_score', '{"course": "maths-6e-nombres", "score": 100}'::jsonb),
    (uuid_generate_v4(), 'Géomètre débutant', 'Complétez le cours de géométrie 6ème', 'courses_completed', '{"course": "maths-6e-geometrie", "count": 1}'::jsonb);

    -- Insert some course enrollments
    INSERT INTO course_enrollments (user_id, course_id, progress) VALUES
    (admin_id, course_math_1, 30),
    (admin_id, course_math_2, 0);

    -- Insert some lesson progress
    INSERT INTO lesson_progress (user_id, lesson_id, completed) VALUES
    (admin_id, lesson_1, true),
    (admin_id, lesson_2, false);

    -- Insert some comments
    INSERT INTO comments (user_id, lesson_id, content) VALUES
    (admin_id, lesson_1, 'L''explication des nombres entiers est très claire !'),
    (admin_id, lesson_2, 'La vidéo sur l''addition aide beaucoup à comprendre');

    -- Insert notifications
    INSERT INTO notifications (user_id, type, title, content) VALUES
    (admin_id, 'course_update', 'Nouveau chapitre disponible', 'Le chapitre sur les fractions vient d''être publié'),
    (admin_id, 'achievement_earned', 'Bravo !', 'Vous avez obtenu le badge Mathématicien en herbe');
END $$;

-- Re-enable triggers
-- ALTER TABLE categories ENABLE TRIGGER ALL;
-- ALTER TABLE courses ENABLE TRIGGER ALL;
-- ALTER TABLE chapters ENABLE TRIGGER ALL;
-- ALTER TABLE lessons ENABLE TRIGGER ALL;
-- ALTER TABLE quizzes ENABLE TRIGGER ALL;
-- ALTER TABLE quiz_questions ENABLE TRIGGER ALL;
-- ALTER TABLE course_enrollments ENABLE TRIGGER ALL;
-- ALTER TABLE lesson_progress ENABLE TRIGGER ALL;
-- ALTER TABLE achievements ENABLE TRIGGER ALL;
-- ALTER TABLE user_achievements ENABLE TRIGGER ALL;
-- ALTER TABLE comments ENABLE TRIGGER ALL;
-- ALTER TABLE notifications ENABLE TRIGGER ALL;
