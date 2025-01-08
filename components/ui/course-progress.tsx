import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface CourseProgressProps {
  totalLessons: number
  completedLessons: number
  className?: string
  showText?: boolean
  size?: "sm" | "default"
}

export function CourseProgress({
  totalLessons,
  completedLessons,
  className,
  showText = true,
  size = "default"
}: CourseProgressProps) {
  const progress = (completedLessons / totalLessons) * 100

  return (
    <div className={cn("space-y-2", className)}>
      {showText && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {completedLessons} sur {totalLessons} leçons complétées
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
      )}
      <Progress
        value={progress}
        className={cn(
          size === "sm" ? "h-1.5" : "h-2",
        )}
      />
    </div>
  )
}
