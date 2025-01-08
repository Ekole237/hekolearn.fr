"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, PlayCircle, BookOpen } from "lucide-react"

interface Lesson {
  id: string
  title: string
  content: string
  type: "video" | "text"
  video_url?: string
}

export default function CourseViewer({ params }: { params: { courseId: string } }) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState(0)

  useEffect(() => {
    async function fetchLessons() {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", params.courseId)
        .order("order_index")

      if (error) {
        console.error("Error fetching lessons:", error)
        return
      }

      setLessons(data)
    }

    fetchLessons()
  }, [params.courseId])

  const lesson = lessons[currentLesson]

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {lesson?.type === "video" ? <PlayCircle className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
            {lesson?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lesson?.type === "video" ? (
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={lesson.video_url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson?.content || "" }} />
          )}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentLesson(prev => Math.max(0, prev - 1))}
              disabled={currentLesson === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={() => setCurrentLesson(prev => Math.min(lessons.length - 1, prev + 1))}
              disabled={currentLesson === lessons.length - 1}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}