"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Analytics {
  totalStudents: number
  activeStudents: number
  averageScore: number
  completionRate: number
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalStudents: 0,
    activeStudents: 0,
    averageScore: 0,
    completionRate: 0,
  })
  const [timeframe, setTimeframe] = useState("week")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  async function fetchAnalytics() {
    try {
      // Calculer la date de début en fonction de la période sélectionnée
      const now = new Date()
      let startDate = new Date()
      switch (timeframe) {
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Récupérer les statistiques des étudiants
      const { count: totalStudents } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student")

      // Récupérer les étudiants actifs (qui ont fait au moins une activité dans la période)
      const { count: activeStudents } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student")
        .gt("last_activity", startDate.toISOString())

      // Récupérer la moyenne des scores des quiz
      const { data: quizAttempts } = await supabase
        .from("quiz_attempts")
        .select("score")
        .gt("created_at", startDate.toISOString())

      const averageScore =
        quizAttempts?.length > 0
          ? quizAttempts.reduce((acc, curr) => acc + curr.score, 0) /
            quizAttempts.length
          : 0

      // Calculer le taux de complétion des cours
      const { data: courseEnrollments } = await supabase
        .from("course_enrollments")
        .select("progress")
        .gt("updated_at", startDate.toISOString())

      const completionRate =
        courseEnrollments?.length > 0
          ? (courseEnrollments.filter((e) => e.progress === 100).length /
              courseEnrollments.length) *
            100
          : 0

      setAnalytics({
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        averageScore,
        completionRate,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytiques</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">30 derniers jours</SelectItem>
            <SelectItem value="year">12 derniers mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des élèves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élèves actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeStudents}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.activeStudents / analytics.totalStudents) * 100).toFixed(
                1
              )}
              % du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score moyen des quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de complétion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.completionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
