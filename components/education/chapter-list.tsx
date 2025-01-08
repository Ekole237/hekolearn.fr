import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle, Circle } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  description: string;
  progress: number;
  isLocked: boolean;
  isCompleted: boolean;
  lessonsCount: number;
  completedLessons: number;
}

interface ChapterListProps {
  chapters: Chapter[];
  onChapterSelect: (chapterId: string) => void;
  currentChapterId?: string;
}

export function ChapterList({
  chapters,
  onChapterSelect,
  currentChapterId,
}: ChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className={`rounded-lg border bg-card p-4 transition-all ${
            currentChapterId === chapter.id
              ? "ring-2 ring-primary"
              : "hover:border-primary/50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {chapter.isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : chapter.isLocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <h3 className="font-semibold">{chapter.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {chapter.description}
              </p>
            </div>
            <Button
              variant={chapter.isLocked ? "outline" : "default"}
              size="sm"
              disabled={chapter.isLocked}
              onClick={() => onChapterSelect(chapter.id)}
            >
              {chapter.isCompleted ? "Réviser" : "Continuer"}
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {chapter.completedLessons} sur {chapter.lessonsCount} leçons
                complétées
              </span>
              <span className="font-medium">{Math.round(chapter.progress)}%</span>
            </div>
            <Progress value={chapter.progress} className="h-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
