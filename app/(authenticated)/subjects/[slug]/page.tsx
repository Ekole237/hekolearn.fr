import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { CourseCard } from "@/components/ui/course-card";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface SubjectPageProps {
  params: {
    slug: string;
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const supabase = createServerClient();

  // Récupérer la matière
  const { data: subject } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!subject) {
    notFound();
  }

  // Récupérer les cours de la matière
  const { data: courses } = await supabase
    .from("courses")
    .select(`
      *,
      author:profiles(full_name, avatar_url),
      enrollments:course_enrollments(progress)
    `)
    .eq("subject_id", subject.id)
    .eq("published", true);

  // Récupérer les inscriptions de l'utilisateur
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select("course_id, progress")
    .eq("user_id", userId);

  const enrollmentMap = new Map(
    enrollments?.map((e) => [e.course_id, e.progress]) ?? []
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title={subject.name}
        description={subject.description}
      >
        <div className="flex gap-2">
          <Badge variant="outline">
            {courses?.length ?? 0} cours disponibles
          </Badge>
        </div>
      </SectionHeader>

      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              progress={enrollmentMap.get(course.id) ?? 0}
              image={course.image_url}
              author={course.author.full_name}
              duration={course.estimated_duration}
              onContinue={() => {}} // À implémenter
            />
          ))}
        </div>
      </div>
    </div>
  );
}
