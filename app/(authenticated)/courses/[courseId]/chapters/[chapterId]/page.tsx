import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { CheckCircle, PlayCircle, BookOpen, LockIcon } from "lucide-react";

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const supabase = createServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Récupérer le chapitre et ses leçons
  const { data: chapter } = await supabase
    .from("chapters")
    .select(`
      *,
      course:courses(
        title,
        subject:subjects(name)
      ),
      lessons(
        id,
        title,
        type,
        estimated_duration,
        order_index
      )
    `)
    .eq("id", params.chapterId)
    .single();

  if (!chapter) {
    notFound();
  }

  // Récupérer la progression des leçons
  const { data: lessonProgress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .in(
      "lesson_id",
      chapter.lessons.map((l) => l.id)
    );

  // Calculer la progression globale du chapitre
  const totalLessons = chapter.lessons.length;
  const completedLessons = lessonProgress?.filter((p) => p.completed).length ?? 0;
  const chapterProgress = (completedLessons / totalLessons) * 100;

  // Trier les leçons par ordre
  const sortedLessons = [...chapter.lessons].sort(
    (a, b) => a.order_index - b.order_index
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{chapter.course.subject.name}</span>
          <span>•</span>
          <span>{chapter.course.title}</span>
        </div>

        <SectionHeader
          title={chapter.title}
          description={chapter.description}
        >
          <div className="flex items-center gap-4">
            <Progress value={chapterProgress} className="w-40 h-2" />
            <span className="text-sm text-muted-foreground">
              {completedLessons}/{totalLessons} leçons terminées
            </span>
          </div>
        </SectionHeader>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Objectifs du chapitre</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {chapter.objectives?.map((objective: string, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <p>{objective}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Leçons du chapitre</h2>
        <div className="space-y-4">
          {sortedLessons.map((lesson, index) => {
            const progress = lessonProgress?.find(
              (p) => p.lesson_id === lesson.id
            );
            const isLocked = index > 0 && !lessonProgress?.find(
              (p) => p.lesson_id === sortedLessons[index - 1].id
            )?.completed;

            return (
              <Card key={lesson.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full ${
                        progress?.completed
                          ? "bg-primary"
                          : "bg-primary/10"
                      } flex items-center justify-center`}
                    >
                      {lesson.type === "video" ? (
                        <PlayCircle className={`h-5 w-5 ${
                          progress?.completed ? "text-primary-foreground" : "text-primary"
                        }`} />
                      ) : (
                        <BookOpen className={`h-5 w-5 ${
                          progress?.completed ? "text-primary-foreground" : "text-primary"
                        }`} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lesson.estimated_duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {progress?.completed && (
                      <Badge variant="success">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Terminé
                      </Badge>
                    )}
                    {isLocked ? (
                      <Button variant="outline" disabled>
                        <LockIcon className="mr-1 h-4 w-4" />
                        Verrouillé
                      </Button>
                    ) : (
                      <Button
                        variant={progress?.completed ? "outline" : "default"}
                      >
                        {progress?.completed ? "Revoir" : "Commencer"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
