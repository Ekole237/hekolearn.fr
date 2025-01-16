'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { createChapter } from '@/lib/courses/teacher-service';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  objectives: z.array(
    z.object({
      value: z.string().min(1, 'L\'objectif ne peut pas être vide')
    })
  ),
  prerequisites: z.array(
    z.object({
      value: z.string().min(1, 'Le prérequis ne peut pas être vide')
    })
  ),
});

interface ChapterFormProps {
  courseId: string;
}

export function ChapterForm({ courseId }: ChapterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Charger les données sauvegardées au montage du composant
  const loadSavedData = () => {
    if (typeof window === 'undefined') return null;
    
    const savedData = localStorage.getItem(`chapter-form-${courseId}`);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    return null;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: loadSavedData() || {
      title: '',
      description: '',
      objectives: [{ value: '' }],
      prerequisites: [{ value: '' }],
    },
  });

  // Sauvegarder les données du formulaire à chaque changement
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(`chapter-form-${courseId}`, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, courseId]);

  const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = useFieldArray({
    control: form.control,
    name: "objectives"
  });

  const { fields: prerequisiteFields, append: appendPrerequisite, remove: removePrerequisite } = useFieldArray({
    control: form.control,
    name: "prerequisites"
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const chapter = await createChapter({
        ...values,
        course_id: courseId,
        objectives: values.objectives.map(obj => obj.value),
        prerequisites: values.prerequisites.map(pre => pre.value),
      });

      // Nettoyer les données sauvegardées après une soumission réussie
      localStorage.removeItem(`chapter-form-${courseId}`);

      toast({
        title: 'Chapitre créé',
        description: 'Le chapitre a été créé avec succès.',
      });

      router.push(`/teacher/courses/${courseId}/chapters/${chapter.id}/lessons/new`);
    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création du chapitre.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du chapitre</FormLabel>
              <FormControl>
                <Input 
                  disabled={isSubmitting} 
                  placeholder="Introduction à..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  disabled={isSubmitting} 
                  placeholder="Ce chapitre couvre..." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Une brève description du contenu de ce chapitre
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Objectifs d'apprentissage</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendObjective({ value: '' })}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un objectif
              </Button>
            </div>
            
            <div className="space-y-4">
              {objectiveFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`objectives.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="À la fin de ce chapitre, vous serez capable de..."
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeObjective(index)}
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormDescription>
              Listez les compétences que les apprenants acquerront dans ce chapitre
            </FormDescription>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Prérequis</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendPrerequisite({ value: '' })}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un prérequis
              </Button>
            </div>
            
            <div className="space-y-4">
              {prerequisiteFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`prerequisites.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Connaissance de base en..."
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePrerequisite(index)}
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormDescription>
              Listez les connaissances nécessaires pour suivre ce chapitre
            </FormDescription>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            Retour
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Continuer
          </Button>
        </div>
      </form>
    </Form>
  );
}
