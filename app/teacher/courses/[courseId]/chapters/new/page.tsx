'use client';

import { CourseCreationLayout } from "@/components/courses/course-creation-layout";
import { ChapterForm } from "@/components/courses/chapter-form";

export default function NewChapterPage({
  params
}: {
  params: { courseId: string }
}) {
  return (
    <CourseCreationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter un chapitre</h1>
          <p className="text-muted-foreground mt-2">
            Structurez votre cours en chapitres pour une meilleure organisation du contenu.
          </p>
        </div>
        <ChapterForm courseId={params.courseId} />
      </div>
    </CourseCreationLayout>
  );
}
