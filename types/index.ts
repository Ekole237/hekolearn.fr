// Types communs
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

// Types pour les cours
export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  subject: Subject;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  course: Course;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'reading';
  video_url?: string;
  estimated_duration: string;
  order_index: number;
  chapter: Chapter;
}

// Types pour les quiz
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  lesson: Lesson;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  answers: Record<string, number>;
  completed_at: string;
}

// Types pour la progression
export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  last_position?: number;
  updated_at: string;
}

export interface ChapterProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  completed_lessons: number;
  total_lessons: number;
  updated_at: string;
}
