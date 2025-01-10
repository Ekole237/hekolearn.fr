export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          requirement_type: string
          requirement_value: Json
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          slug: string
          order_index: number
          created_at: string
        }
      }
      chapters: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string
          order_index: number
          objectives: string[]
          created_at: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          content: string
          created_at: string
        }
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          progress: number
          created_at: string
          updated_at: string
        }
      }
      courses: {
        Row: {
          id: string
          category_id: string
          title: string
          description: string
          slug: string
          image_url: string
          duration: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          published: boolean
          author_id: string
          created_at: string
          updated_at: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          last_position?: number
          created_at: string
          updated_at: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          chapter_id: string
          title: string
          content: Json
          type: 'text' | 'video'
          video_url?: string
          estimated_duration: string
          order_index: number
          created_at: string
          updated_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          content: string
          read: boolean
          created_at: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          role: 'student' | 'teacher' | 'admin'
          grade_level?: number
          created_at: string
          updated_at: string
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          answers: Record<string, number>
          completed_at: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          question: string
          options: string[]
          correct_answer: number
          order_index: number
          created_at: string
        }
      }
      quizzes: {
        Row: {
          id: string
          lesson_id: string
          title: string
          description: string
          created_at: string
          updated_at: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
      }
    }
  }
}
