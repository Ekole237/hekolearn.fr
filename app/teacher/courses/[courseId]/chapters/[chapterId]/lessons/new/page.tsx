'use client';

import { CourseCreationLayout } from "@/components/courses/course-creation-layout";
import { LessonForm } from "@/components/courses/lesson-form";

interface NewLessonPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default function NewLessonPage({ params }: NewLessonPageProps) {
  return (
    <CourseCreationLayout
      courseId={params.courseId}
      chapterId={params.chapterId}
      currentStep="lessons"
    >
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Créer une nouvelle leçon</h1>
          <p className="text-slate-600">
            Ajoutez du contenu à votre chapitre avec une nouvelle leçon.
          </p>
        </div>
        <LessonForm 
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
      </div>
    </CourseCreationLayout>
  );
}
