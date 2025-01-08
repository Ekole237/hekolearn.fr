import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";

interface QuizPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const supabase = createServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Récupérer le quiz et ses questions
  const { data: quiz } = await supabase
    .from("quizzes")
    .select(`
      *,
      lesson:lessons(
        title,
        chapter:chapters(
          title,
          course:courses(
            title,
            subject:subjects(name)
          )
        )
      ),
      questions:quiz_questions(
        *
      )
    `)
    .eq("lesson_id", params.lessonId)
    .single();

  if (!quiz) {
    notFound();
  }

  // Récupérer les tentatives précédentes
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", quiz.id)
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  const lastAttempt = attempts?.[0];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{quiz.lesson.chapter.course.subject.name}</span>
          <span>•</span>
          <span>{quiz.lesson.chapter.course.title}</span>
          <span>•</span>
          <span>{quiz.lesson.chapter.title}</span>
          <span>•</span>
          <span>{quiz.lesson.title}</span>
        </div>

        <SectionHeader
          title={quiz.title}
          description={quiz.description}
        >
          {lastAttempt && (
            <Badge variant={lastAttempt.score >= 80 ? "success" : "warning"}>
              Dernier score: {lastAttempt.score}%
            </Badge>
          )}
        </SectionHeader>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const userAnswer = lastAttempt?.answers?.[question.id];
          const isCorrect = userAnswer === question.correct_answer;

          return (
            <Card key={question.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Question {index + 1}
                  </h3>
                  {userAnswer !== undefined && (
                    <Badge
                      variant={isCorrect ? "success" : "destructive"}
                      className="h-6"
                    >
                      {isCorrect ? (
                        <CheckCircle className="mr-1 h-4 w-4" />
                      ) : (
                        <XCircle className="mr-1 h-4 w-4" />
                      )}
                      {isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  )}
                </div>

                <p>{question.question}</p>

                <div className="grid gap-2">
                  {question.options.map((option: string, optionIndex: number) => (
                    <Button
                      key={optionIndex}
                      variant={
                        userAnswer === undefined
                          ? "outline"
                          : userAnswer === optionIndex
                          ? isCorrect
                            ? "success"
                            : "destructive"
                          : question.correct_answer === optionIndex && userAnswer !== undefined
                          ? "success"
                          : "outline"
                      }
                      className="justify-start h-auto py-4 px-4"
                      disabled={userAnswer !== undefined}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full border flex items-center justify-center">
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                {userAnswer !== undefined && !isCorrect && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <span>
                        La bonne réponse était l'option{" "}
                        {String.fromCharCode(65 + question.correct_answer)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        {lastAttempt ? (
          <Button>
            Réessayer
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button>
            Soumettre
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
