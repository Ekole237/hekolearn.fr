'use client';

import { useRequireTeacher } from '@/lib/auth/hooks';
import { ChapterForm } from '@/components/courses/chapter-form';

export default function NewCoursePage() {
  const { requireTeacher } = useRequireTeacher();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Créer un nouveau cours</h1>
        <p className="text-muted-foreground mt-2">
          Commençons par créer le premier chapitre de votre cours.
          Vous pourrez ensuite ajouter les détails du cours et les leçons.
        </p>
      </div>

      <ChapterForm />
    </div>
  );
}
