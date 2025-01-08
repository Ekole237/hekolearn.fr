"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface QuizStats {
  quiz_id: string
  quiz_title: string
  average_score: number
  total_attempts: number
}

export default function Analytics() {
  const [quizStats, setQuizStats] = useState<QuizStats[]>([])

  useEffect(() => {
    async function fetchQuizStats() {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          quiz_id,
          quizzes (
            title
          ),
          score
        `)

      if (!error && data) {
        const stats = data.reduce((acc: Record<string, any>, curr) => {
          if (!acc[curr.quiz_id]) {
            acc[curr.quiz_id] = {
              quiz_id: curr.quiz_id,
              quiz_title: curr.quizzes.title,
              scores: [],
              total_attempts: 0
            }
          }
          acc[curr.quiz_id].scores.push(curr.score)
          acc[curr.quiz_id].total_attempts++
          return acc
        }, {})

        const formattedStats = Object.values(stats).map((stat: any) => ({
          quiz_id: stat.quiz_id,
          quiz_title: stat.quiz_title,
          average_score: Math.round(stat.scores.reduce((a: number, b: number) => a + b, 0) / stat.scores.length),
          total_attempts: stat.total_attempts
        }))

        setQuizStats(formattedStats)
      }
    }

    fetchQuizStats()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz_title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average_score" fill="hsl(var(--primary))" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizStats.map(stat => (
          <Card key={stat.quiz_id}>
            <CardHeader>
              <CardTitle className="text-lg">{stat.quiz_title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{stat.average_score}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                  <p className="text-2xl font-bold">{stat.total_attempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}