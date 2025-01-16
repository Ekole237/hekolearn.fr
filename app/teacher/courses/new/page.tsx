'use client';

import { CourseForm } from "@/components/courses/course-form";
import { CourseCreationLayout } from "@/components/courses/course-creation-layout";

export default function NewCoursePage() {
  return (
    <CourseCreationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Créer un nouveau cours</h1>
          <p className="text-muted-foreground mt-2">
            Commencez par remplir les informations de base de votre cours. Vous pourrez ajouter des chapitres et des leçons par la suite.
          </p>
        </div>
        <CourseForm />
      </div>
    </CourseCreationLayout>
  );
}
