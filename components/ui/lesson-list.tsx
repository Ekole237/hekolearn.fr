import { Check, Lock, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
  onClick?: () => void
}

interface LessonListProps {
  lessons: Lesson[]
  currentLessonId?: string
}

export function LessonList({ lessons, currentLessonId }: LessonListProps) {
  return (
    <div className="space-y-1">
      {lessons.map((lesson) => (
        <button
          key={lesson.id}
          onClick={lesson.isLocked ? undefined : lesson.onClick}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-lg text-sm",
            "transition-colors duration-200",
            lesson.isLocked
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-accent",
            currentLessonId === lesson.id && "bg-accent",
            "disabled:opacity-50"
          )}
          disabled={lesson.isLocked}
        >
          <div className="flex items-center gap-3">
            {lesson.isCompleted ? (
              <Check className="h-5 w-5 text-primary" />
            ) : lesson.isLocked ? (
              <Lock className="h-5 w-5" />
            ) : (
              <PlayCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{lesson.title}</span>
          </div>
          <span className="text-muted-foreground">{lesson.duration}</span>
        </button>
      ))}
    </div>
  )
}
