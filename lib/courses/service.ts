import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { getCourseImageUrl as getStorageImageUrl } from '@/lib/storage/service';

export type Course = Database['public']['Tables']['courses']['Row'];
export type CourseEnrollment = Database['public']['Tables']['course_enrollments']['Row'];

const DEFAULT_COURSE_IMAGE = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80';

// Fonction utilitaire pour vérifier si une URL est valide
function isValidImageUrl(url: string): boolean {
  // Si l'URL commence par http:// ou https://, on considère que c'est une URL externe valide
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }
  // Sinon, c'est probablement une URL relative ou invalide
  return false;
}

// Fonction pour obtenir l'URL de l'image d'un cours
export function getCourseImageUrl(course: Course): string {
  if (!course.image_url) {
    return DEFAULT_COURSE_IMAGE;
  }

  // Si l'URL est déjà valide (commence par http:// ou https://), on la retourne telle quelle
  if (isValidImageUrl(course.image_url)) {
    return course.image_url;
  }

  // Sinon, on essaie de récupérer l'URL depuis le stockage Supabase
  try {
    return getStorageImageUrl(course.image_url);
  } catch {
    return DEFAULT_COURSE_IMAGE;
  }
}

export async function updateCourseImage(courseId: string, imageUrl: string) {
  const supabase = createClientComponentClient<Database>();

  const { error } = await supabase
    .from('courses')
    .update({ image_url: imageUrl })
    .eq('id', courseId);

  if (error) {
    console.error('Error updating course image:', error);
    throw error;
  }
}

export async function getCourses() {
  const supabase = createClientComponentClient<Database>();
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }

  // Transformer les résultats pour gérer les URLs des images
  return courses.map(course => ({
    ...course,
    image_url: getCourseImageUrl(course)
  }));
}

export async function getCourseBySlug(slug: string) {
  const supabase = createClientComponentClient<Database>();
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching course:', error);
    throw error;
  }

  // Transformer le résultat pour gérer l'URL de l'image
  return course ? {
    ...course,
    image_url: getCourseImageUrl(course)
  } : null;
}

export async function getRecentCourses(userId: string) {
  const supabase = createClientComponentClient<Database>();
  const { data: enrollments, error } = await supabase
    .from('course_enrollments')
    .select(`
      *,
      courses (*)
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching recent courses:', error);
    throw error;
  }

  // Transformer les résultats pour gérer les URLs des images
  return enrollments.map(enrollment => ({
    ...enrollment,
    courses: enrollment.courses ? {
      ...enrollment.courses,
      image_url: getCourseImageUrl(enrollment.courses)
    } : null
  }));
}

export async function getRecommendedCourses(userId: string) {
  const supabase = createClientComponentClient<Database>();
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .limit(3);

  if (error) {
    console.error('Error fetching recommended courses:', error);
    throw error;
  }

  // Transformer les résultats pour gérer les URLs des images
  return courses.map(course => ({
    ...course,
    image_url: getCourseImageUrl(course)
  }));
}

export async function enrollInCourse(userId: string, courseId: string) {
  const supabase = createClientComponentClient<Database>();
  
  // Vérifier si l'utilisateur est déjà inscrit
  const { data: existingEnrollment } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (existingEnrollment) {
    return existingEnrollment;
  }

  // Créer une nouvelle inscription
  const { data: enrollment, error } = await supabase
    .from('course_enrollments')
    .insert([
      {
        user_id: userId,
        course_id: courseId,
        progress: 0
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }

  return enrollment;
}
