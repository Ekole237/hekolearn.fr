import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

const COURSE_IMAGES_BUCKET = 'course-images';

export async function uploadCourseImage(file: File, fileName: string) {
  const supabase = createClientComponentClient<Database>();

  // Vérifier si le bucket existe, sinon le créer
  const { data: buckets } = await supabase
    .storage
    .listBuckets();

  const bucketExists = buckets?.some(bucket => bucket.name === COURSE_IMAGES_BUCKET);

  if (!bucketExists) {
    const { error: createError } = await supabase
      .storage
      .createBucket(COURSE_IMAGES_BUCKET, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });

    if (createError) {
      throw new Error(`Error creating bucket: ${createError.message}`);
    }
  }

  // Upload de l'image
  const { data, error } = await supabase
    .storage
    .from(COURSE_IMAGES_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }

  // Récupérer l'URL publique
  const { data: { publicUrl } } = supabase
    .storage
    .from(COURSE_IMAGES_BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteCourseImage(fileName: string) {
  const supabase = createClientComponentClient<Database>();

  const { error } = await supabase
    .storage
    .from(COURSE_IMAGES_BUCKET)
    .remove([fileName]);

  if (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
}

export function getCourseImageUrl(fileName: string) {
  const supabase = createClientComponentClient<Database>();

  const { data: { publicUrl } } = supabase
    .storage
    .from(COURSE_IMAGES_BUCKET)
    .getPublicUrl(fileName);

  return publicUrl;
}

// Fonction utilitaire pour générer un nom de fichier unique
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}
