'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, BookOpen, Library, Video } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface CourseCreationLayoutProps {
  children: React.ReactNode;
  courseId: string;
  currentStep?: 'info' | 'chapters' | 'lessons';
}

const steps = [
  {
    label: 'Informations du cours',
    href: '/teacher/courses/new',
    icon: BookOpen,
    description: 'Définissez le titre, la description et la catégorie du cours',
    id: 'info'
  },
  {
    label: 'Chapitres',
    href: '/teacher/courses/[courseId]/chapters/new',
    icon: Library,
    description: 'Organisez votre cours en chapitres',
    id: 'chapters'
  },
  {
    label: 'Leçons',
    href: '/teacher/courses/[courseId]/chapters/[chapterId]/lessons/new',
    icon: Video,
    description: 'Ajoutez du contenu à vos chapitres',
    id: 'lessons'
  }
];

export function CourseCreationLayout({ 
  children, 
  courseId,
  currentStep = 'info' 
}: CourseCreationLayoutProps) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const supabase = createClientComponentClient();
  
  // Utiliser currentStep au lieu de pathname pour déterminer l'étape active
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  useEffect(() => {
    const calculateProgress = async () => {
      if (currentStep === 'info') {
        // Pour l'étape info, vérifier si le cours existe et a les champs requis
        const { data: course } = await supabase
          .from('courses')
          .select('title, description, category_id')
          .eq('id', courseId)
          .single();

        if (course) {
          const hasTitle = Boolean(course.title);
          const hasDescription = Boolean(course.description);
          const hasCategory = Boolean(course.category_id);
          const fieldsCount = [hasTitle, hasDescription, hasCategory].filter(Boolean).length;
          setProgress((fieldsCount / 3) * 100);
        }
      } 
      else if (currentStep === 'chapters') {
        // Pour l'étape chapters, compter le nombre de chapitres
        const { count } = await supabase
          .from('chapters')
          .select('*', { count: 'exact' })
          .eq('course_id', courseId);

        setProgress(count ? Math.min((count / 1) * 100, 100) : 0);
      }
      else if (currentStep === 'lessons') {
        // Pour l'étape lessons, compter le nombre de leçons dans le chapitre actuel
        const chapterId = pathname.split('/chapters/')[1]?.split('/')[0];
        if (chapterId) {
          const { count } = await supabase
            .from('lessons')
            .select('*', { count: 'exact' })
            .eq('chapter_id', chapterId);

          setProgress(count ? Math.min((count / 1) * 100, 100) : 0);
        }
      }
    };

    calculateProgress();
  }, [currentStep, courseId, pathname, supabase]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="hidden md:flex w-80 flex-col bg-slate-50 border-r px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Créer un cours</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Suivez ces étapes pour créer votre cours
          </p>
        </div>
        <nav className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div
                key={step.label}
                className={cn(
                  "relative",
                  // Ne pas ajouter le trait vertical pour la dernière étape
                  index !== steps.length - 1 && [
                    "pb-8",
                    "before:absolute",
                    "before:left-5",
                    "before:top-12",
                    "before:h-[calc(100%-2rem)]", // Ajuster la hauteur pour éviter le débordement
                    "before:w-[2px]",
                    isCompleted ? "before:bg-emerald-500" : "before:bg-slate-200"
                  ]
                )}
              >
                <div className="relative flex items-start group">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "bg-emerald-500 text-white",
                      !isActive && !isCompleted && "bg-slate-100"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-4 min-w-0">
                    <div className={cn(
                      "text-sm font-medium",
                      isCompleted && "text-emerald-600"
                    )}>
                      {step.label}
                    </div>
                    <p className={cn(
                      "mt-1 text-sm",
                      isCompleted ? "text-emerald-600/80" : "text-muted-foreground"
                    )}>
                      {step.description}
                    </p>
                    {isActive && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 px-4 py-8 md:px-8">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
