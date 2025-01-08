export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'teacher';
  grade_level: string | null;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  content: string | null;
  type: 'video' | 'text';
  video_url: string | null;
  order_index: number;
  created_at: string;
};

export type CourseEnrollment = {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  completed_at: string | null;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  video_position: number;
  last_accessed_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};
