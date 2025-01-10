import { Database } from '@/types/database.types';

export type Course = Database['public']['Tables']['courses']['Row'];
export type Chapter = Database['public']['Tables']['chapters']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];

export type CourseWithChapters = Course & {
  chapters: (Chapter & {
    lessons: Lesson[];
  })[];
};

export type ChapterWithLessons = Chapter & {
  lessons: Lesson[];
};

export interface CreateCourseInput {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  image_url?: string;
}

export interface CreateChapterInput {
  title: string;
  description: string;
  course_id?: string;
  position: number;
}

export interface CreateLessonInput {
  title: string;
  content: string;
  chapter_id: string;
  position: number;
  type: 'video' | 'text' | 'quiz';
  video_url?: string;
}
