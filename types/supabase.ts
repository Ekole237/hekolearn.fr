import { Database } from './database.types'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never

export type Category = Tables<'categories'>
export type Course = Tables<'courses'>
export type Chapter = Tables<'chapters'>
export type Lesson = Tables<'lessons'>
export type Quiz = Tables<'quizzes'>
export type QuizQuestion = Tables<'quiz_questions'>
export type QuizAttempt = Tables<'quiz_attempts'>
export type Profile = Tables<'profiles'>
export type LessonProgress = Tables<'lesson_progress'>
export type CourseEnrollment = Tables<'course_enrollments'>
export type Achievement = Tables<'achievements'>
export type UserAchievement = Tables<'user_achievements'>
export type Comment = Tables<'comments'>
export type Notification = Tables<'notifications'>

interface LessonCount {
  count: number;
}

// Types avec relations
export interface CourseWithRelations extends Course {
  category: Category
  author: Profile
  chapters?: ChapterWithRelations[]
}

export interface ChapterWithRelations extends Chapter {
  course: {
    title: string;
    description: string;
    subject: {
      name: string;
    };
  }
  lessons: LessonCount[]
  lesson_progress?: LessonProgress[]
}

export interface LessonWithRelations extends Lesson {
  chapter: ChapterWithRelations
  quiz?: QuizWithRelations[]
  progress?: LessonProgress[]
}

export interface QuizWithRelations extends Quiz {
  lesson: {
    title: string
    chapter: {
      title: string
      course: {
        title: string
        subject: {
          name: string
        }
      }
    }
  }
  questions: QuizQuestion[]
}
