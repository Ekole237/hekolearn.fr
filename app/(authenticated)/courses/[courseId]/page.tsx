import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { PlayCircle, BookOpen } from "lucide-react";
import type { ChapterWithRelations, LessonProgress } from "@/types/supabase";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

interface ChapterProgressInfo {
  totalLessons: number;
  completedLessons: number;
  progress: number;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = createServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    notFound();
  }

  // Récupérer le cours et ses chapitres
  const { data: chapters } = await supabase
    .from("chapters")
    .select(`
      *,
      course:courses(
        title,
        description,
        subject:categories(name)
      ),
      lessons(count),
      lesson_progress(*)
    `)
    .eq("course_id", params.courseId)
    .order("order_index");

  if (!chapters || chapters.length === 0) {
    notFound();
  }

  // Calculer la progression pour chaque chapitre
  const chaptersWithProgress = chapters.map((chapter: ChapterWithRelations): ChapterProgressInfo => {
    const totalLessons = chapter.lessons[0]?.count ?? 0;
    const completedLessons = chapter.lesson_progress?.filter(
      (p: LessonProgress) => p.completed
    ).length ?? 0;
    
    return {
      totalLessons,
      completedLessons,
      progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
    };
  });

  const course = chapters[0].course;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{course.subject.name}</span>
        </div>
        <SectionHeader title={course.title} description={course.description} />
      </div>

      <div className="grid gap-6">
        {chapters.map((chapter: ChapterWithRelations, index: number) => {
          const progress = chaptersWithProgress[index];
          
          return (
            <Card key={chapter.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{chapter.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {chapter.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {progress.completedLessons}/{progress.totalLessons} leçons
                      terminées
                    </div>
                    <Progress value={progress.progress} className="w-40" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Objectifs du chapitre</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {chapter.objectives?.map((objective: string, i: number) => (
                      <li key={i}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button>
                    {progress.completedLessons > 0
                      ? "Continuer"
                      : "Commencer"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
