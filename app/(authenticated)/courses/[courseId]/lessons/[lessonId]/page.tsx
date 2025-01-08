import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, PlayCircle, BookOpen } from "lucide-react";

interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = createServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Récupérer la leçon
  const { data: lesson } = await supabase
    .from("lessons")
    .select(`
      *,
      chapter:chapters(
        title,
        course:courses(
          title,
          subject:subjects(name)
        )
      )
    `)
    .eq("id", params.lessonId)
    .single();

  if (!lesson) {
    notFound();
  }

  // Récupérer la progression
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("lesson_id", params.lessonId)
    .eq("user_id", userId)
    .single();

  // Récupérer le quiz associé
  const { data: quiz } = await supabase
    .from("quizzes")
    .select(`
      *,
      questions:quiz_questions(
        id,
        question,
        options
      )
    `)
    .eq("lesson_id", params.lessonId)
    .single();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{lesson.chapter.course.subject.name}</span>
            <span>•</span>
            <span>{lesson.chapter.course.title}</span>
            <span>•</span>
            <span>{lesson.chapter.title}</span>
          </div>
          <SectionHeader
            title={lesson.title}
            description={`Durée estimée: ${lesson.estimated_duration}`}
          >
            <Badge variant={lesson.type === "video" ? "default" : "secondary"}>
              {lesson.type === "video" ? (
                <PlayCircle className="mr-1 h-3 w-3" />
              ) : (
                <BookOpen className="mr-1 h-3 w-3" />
              )}
              {lesson.type === "video" ? "Vidéo" : "Lecture"}
            </Badge>
          </SectionHeader>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Précédent
          </Button>
          <Button>
            Suivant
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {lesson.type === "video" ? (
            <div className="aspect-video rounded-lg bg-black">
              <video
                src={lesson.video_url}
                controls
                className="h-full w-full"
                poster="/video-placeholder.jpg"
              />
            </div>
          ) : (
            <Card className="prose prose-slate dark:prose-invert max-w-none p-6">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </Card>
          )}

          {quiz && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quiz de validation</h2>
              <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                  <div key={question.id} className="space-y-4">
                    <h3 className="font-medium">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="grid gap-2">
                      {question.options.map((option: string, optIndex: number) => (
                        <Button
                          key={optIndex}
                          variant="outline"
                          className="justify-start"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Votre progression</h3>
            <Progress
              value={progress?.video_position ?? 0}
              className="h-2 mb-2"
            />
            <p className="text-sm text-muted-foreground">
              {progress?.completed
                ? "Leçon complétée"
                : "Continuez votre apprentissage"}
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Objectifs de la leçon</h3>
            <ul className="space-y-2 text-sm">
              {lesson.objectives?.map((objective: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full border flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
