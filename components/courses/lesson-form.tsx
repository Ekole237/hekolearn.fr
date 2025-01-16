'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { MarkdownEditor } from '@/components/editor/markdown-editor'; 
import { toast } from '@/components/ui/use-toast';
import { createLesson } from '@/lib/courses/teacher-service';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  content: z.string().min(1, 'Le contenu est requis'),
  type: z.enum(['text', 'video', 'quiz'], {
    required_error: "Le type de leçon est requis",
  }),
  video_url: z.string().optional(),
});

interface LessonFormProps {
  courseId: string;
  chapterId: string;
}

export function LessonForm({ courseId, chapterId }: LessonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Charger les données sauvegardées au montage du composant
  const loadSavedData = () => {
    if (typeof window === 'undefined') return null;
    
    const savedData = localStorage.getItem(`lesson-form-${chapterId}`);
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
      content: '',
      type: 'text',
      video_url: '',
    },
  });

  // Sauvegarder les données du formulaire à chaque changement
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(`lesson-form-${chapterId}`, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, chapterId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const lesson = await createLesson({
        ...values,
        chapter_id: chapterId,
        position: 1, // La position sera gérée par le backend
      });

      // Nettoyer les données sauvegardées après une soumission réussie
      localStorage.removeItem(`lesson-form-${chapterId}`);

      toast({
        title: 'Leçon créée',
        description: 'La leçon a été créée avec succès.',
      });

      router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création de la leçon.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const lessonType = form.watch('type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la leçon</FormLabel>
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de leçon</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de leçon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choisissez le type de contenu pour cette leçon
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {lessonType === 'video' && (
          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la vidéo</FormLabel>
                <FormControl>
                  <Input 
                    disabled={isSubmitting} 
                    placeholder="https://..." 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Collez l'URL de votre vidéo (YouTube, Vimeo, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu</FormLabel>
              <FormControl>
                <MarkdownEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    lessonType === 'text' 
                      ? "Rédigez le contenu de votre leçon..."
                      : lessonType === 'video' 
                      ? "Ajoutez une description ou des notes pour accompagner la vidéo..."
                      : "Créez votre quiz au format JSON..."
                  }
                  className="min-h-[400px]"
                />
              </FormControl>
              <FormDescription>
                {lessonType === 'text' && "Utilisez le Markdown pour formater votre contenu. Vous pouvez inclure des équations mathématiques et du code."}
                {lessonType === 'video' && "Ajoutez une description ou des notes pour accompagner la vidéo"}
                {lessonType === 'quiz' && "Créez votre quiz au format JSON"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
            Créer la leçon
          </Button>
        </div>
      </form>
    </Form>
  );
}
