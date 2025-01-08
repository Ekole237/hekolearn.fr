import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { SubjectCard } from "@/components/education/subject-card";
import { CourseCard } from "@/components/ui/course-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function HomePage() {
  const supabase = createServerClient();

  // Récupérer les matières
  const { data: subjects } = await supabase
    .from("subjects")
    .select("*, courses(count)");

  // Récupérer les cours en cours
  const { data: inProgressCourses } = await supabase
    .from("course_enrollments")
    .select(`
      *,
      course:courses(
        *,
        subject:subjects(name),
        author:profiles(full_name, avatar_url)
      )
    `)
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .order("last_accessed_at", { ascending: false })
    .limit(4);

  // Récupérer les recommandations IA
  const { data: recommendations } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .eq("status", "pending")
    .limit(3);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-32 h-32">
          <img
            src="/images/logo.svg"
            alt="Logo EduPlatform"
            className="w-full h-full animate-pulse-slow"
          />
        </div>
      </div>

      <SectionHeader
        title="Tableau de bord"
        description="Bienvenue sur votre espace d'apprentissage personnalisé"
      />

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subjects">Matières</TabsTrigger>
          <TabsTrigger value="progress">En cours</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects?.map((subject) => (
              <SubjectCard
                key={subject.id}
                id={subject.id}
                name={subject.name}
                description={subject.description}
                slug={subject.slug}
                iconUrl={subject.icon_url}
                coursesCount={subject.courses?.[0]?.count ?? 0}
                gradeLevels={["6ème", "5ème", "4ème"]} // À adapter selon les cours disponibles
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {inProgressCourses?.map((enrollment) => (
              <CourseCard
                key={enrollment.course.id}
                title={enrollment.course.title}
                description={enrollment.course.description}
                progress={enrollment.progress}
                image={enrollment.course.image_url}
                author={enrollment.course.author.full_name}
                duration={enrollment.course.duration}
                onContinue={() => {}} // À implémenter
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {recommendations && recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recommandations personnalisées</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="rounded-lg border bg-card p-4">
                <h3 className="font-medium">{rec.content.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {rec.content.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
