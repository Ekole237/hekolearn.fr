import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { ChapterList } from "@/components/education/chapter-list";
import { CourseProgress } from "@/components/ui/course-progress";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AIRecommendationCard } from "@/components/education/ai-recommendation-card";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = createServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Récupérer le cours
  const { data: course } = await supabase
    .from("courses")
    .select(`
      *,
      subject:subjects(name),
      author:profiles(full_name, avatar_url)
    `)
    .eq("id", params.courseId)
    .single();

  if (!course) {
    notFound();
  }

  // Récupérer les chapitres et leur progression
  const { data: chapters } = await supabase
    .from("chapters")
    .select(`
      *,
      lessons(count),
      lesson_progress:lesson_progress!inner(
        completed,
        lesson_id
      )
    `)
    .eq("course_id", params.courseId)
    .order("order_index");

  // Récupérer les recommandations IA pour ce cours
  const { data: recommendations } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .limit(2);

  // Calculer la progression pour chaque chapitre
  const processedChapters = chapters?.map((chapter) => {
    const totalLessons = chapter.lessons?.[0]?.count ?? 0;
    const completedLessons = chapter.lesson_progress?.filter(
      (p) => p.completed
    ).length ?? 0;
    
    return {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      progress: (completedLessons / totalLessons) * 100,
      isLocked: false, // À implémenter la logique de verrouillage
      isCompleted: completedLessons === totalLessons,
      lessonsCount: totalLessons,
      completedLessons,
    };
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionHeader
          title={course.title}
          description={course.description}
        >
          <div className="flex gap-2">
            <Badge>{course.subject.name}</Badge>
            <Badge variant="outline">
              {course.estimated_duration} estimées
            </Badge>
          </div>
        </SectionHeader>

        <div className="flex items-center gap-4">
          <img
            src={course.author.avatar_url}
            alt={course.author.full_name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{course.author.full_name}</p>
            <p className="text-sm text-muted-foreground">Enseignant</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <ChapterList
            chapters={processedChapters ?? []}
            onChapterSelect={() => {}} // À implémenter
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-4">Progression globale</h3>
            <CourseProgress
              totalLessons={processedChapters?.reduce(
                (acc, chapter) => acc + chapter.lessonsCount,
                0
              ) ?? 0}
              completedLessons={processedChapters?.reduce(
                (acc, chapter) => acc + chapter.completedLessons,
                0
              ) ?? 0}
            />
          </div>

          {recommendations?.map((rec) => (
            <AIRecommendationCard
              key={rec.id}
              title={rec.content.title}
              description={rec.content.description}
              type={rec.recommendation_type}
              status={rec.status}
              onAccept={() => {}} // À implémenter
              onReject={() => {}} // À implémenter
              onStart={() => {}} // À implémenter
            />
          ))}
        </div>
      </div>
    </div>
  );
}
