import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { CheckCircle, PlayCircle, BookOpen } from "lucide-react";

interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_option: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'reading';
  video_url?: string;
  estimated_duration: string;
  chapter: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
      subject: {
        name: string;
      };
    };
  };
  quiz?: Quiz;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = createServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Récupérer la leçon et ses détails
  const { data: lesson } = await supabase
    .from("lessons")
    .select(`
      *,
      chapter:chapters(
        id,
        title,
        course:courses(
          id,
          title,
          subject:subjects(name)
        )
      ),
      quiz:quizzes(
        id,
        title,
        description,
        questions:quiz_questions(
          id,
          question,
          options,
          correct_option
        )
      )
    `)
    .eq("id", params.lessonId)
    .single();

  if (!lesson) {
    notFound();
  }

  // Récupérer la progression de la leçon
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", params.lessonId)
    .single();

  const quiz = lesson.quiz?.[0];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{lesson.chapter.course.subject.name}</span>
          <span>•</span>
          <span>{lesson.chapter.course.title}</span>
          <span>•</span>
          <span>{lesson.chapter.title}</span>
        </div>

        <SectionHeader
          title={lesson.title}
          description={`Durée estimée : ${lesson.estimated_duration}`}
        >
          <div className="flex items-center gap-2">
            {progress?.completed && (
              <Badge variant="success">
                <CheckCircle className="mr-1 h-3 w-3" />
                Terminé
              </Badge>
            )}
            <Button variant={progress?.completed ? "outline" : "default"}>
              {progress?.completed ? "Revoir" : "Commencer"}
            </Button>
          </div>
        </SectionHeader>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          {lesson.type === "video" ? (
            <div className="aspect-video bg-muted rounded-lg">
              {/* Intégration de la vidéo ici */}
              <div className="w-full h-full flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          )}

          {quiz && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quiz de validation</h2>
              <div className="space-y-6">
                {quiz.questions.map((question: Question, index: number) => (
                  <div key={question.id} className="space-y-4">
                    <h3 className="font-medium">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option: string, optionIndex: number) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                        >
                          <div className="h-4 w-4 rounded-full border" />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button className="w-full">Valider mes réponses</Button>
              </div>
            </Card>
          )}
        </div>

        <Card className="p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">À propos de cette leçon</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
              <p className="flex items-center gap-2 mt-1">
                {lesson.type === "video" ? (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    <span>Vidéo</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    <span>Lecture</span>
                  </>
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Durée estimée
              </h3>
              <p className="mt-1">{lesson.estimated_duration}</p>
            </div>
            {quiz && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Quiz</h3>
                <p className="mt-1">
                  {quiz.questions.length} question{quiz.questions.length > 1 && "s"}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
