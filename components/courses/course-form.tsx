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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { createCourse } from '@/lib/courses/teacher-service';
import { CourseImageUpload } from './course-image-upload';
import { authService } from '@/lib/auth/auth-service';
import { getCategories } from '@/lib/courses/categories-service';

const formSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  category_id: z.string().min(1, 'La catégorie est requise'),
  image_url: z.string().optional(),
});

export function CourseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les catégories.',
          variant: 'destructive',
        });
      }
    };
    
    loadCategories();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      image_url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => { 
    try {
      setIsSubmitting(true);
      const userId = await authService.getAuthenticatedUserId();

      if (!userId) {
        toast({
          title: 'Erreur',
          description: 'Veuillez vous connecter pour créer un cours.',
          variant: 'destructive',
        });
        return;
      }
      
      const course = await createCourse(values, userId);

      toast({
        title: 'Cours créé',
        description: 'Le cours a été créé avec succès.',
      });

      router.push(`/teacher/courses/${course.id}/chapters/new`);
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création du cours.',
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
              <FormLabel>Titre du cours</FormLabel>
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
                  placeholder="Ce cours couvre..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select 
                disabled={isSubmitting} 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image du cours</FormLabel>
              <FormControl>
                <CourseImageUpload 
                  disabled={isSubmitting}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            Continuer
          </Button>
        </div>
      </form>
    </Form>
  );
}
