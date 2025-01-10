'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { createChapter } from '@/lib/courses/teacher-service';

const formSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
});

interface ChapterFormProps {
  courseId?: string;
  onSuccess?: (chapterId: string) => void;
  position?: number;
}

export function ChapterForm({ courseId, onSuccess, position = 1 }: ChapterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const chapter = await createChapter({
        ...values,
        course_id: courseId,
        position,
      });

      toast({
        title: 'Chapitre créé',
        description: 'Le chapitre a été créé avec succès.',
      });

      if (onSuccess) {
        onSuccess(chapter.id);
      } else if (courseId) {
        router.push(`/teacher/courses/${courseId}/chapters/${chapter.id}`);
      }
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
                  placeholder="Dans ce chapitre, nous allons..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-x-2">
          <Button
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Création...' : 'Créer le chapitre'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
