"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
}

export default function QuizPage({ params }: { params: { lessonId: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchQuiz() {
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("lesson_id", params.lessonId)
        .single()

      if (quizError) {
        console.error("Error fetching quiz:", quizError)
        return
      }

      const { data: questionsData, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizData.id)
        .order("order_index")

      if (questionsError) {
        console.error("Error fetching questions:", questionsError)
        return
      }

      setQuiz({
        ...quizData,
        questions: questionsData
      })
    }

    fetchQuiz()
  }, [params.lessonId])

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleSubmit = async () => {
    if (!quiz) return

    const score = quiz.questions.reduce((acc, question) => {
      return acc + (answers[question.id] === question.correct_answer ? 1 : 0)
    }, 0)

    const { error } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id: quiz.id,
        score,
        answers
      })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Quiz completed!",
      description: `You scored ${score} out of ${quiz.questions.length}`
    })

    router.push(`/courses/${params.courseId}`)
  }

  if (!quiz) return <div>Loading...</div>

  const question = quiz.questions[currentQuestion]

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </h3>
            <p className="text-lg">{question.question}</p>
            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmit}>Submit Quiz</Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}