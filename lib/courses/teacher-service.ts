import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";
import {
  CreateChapterInput,
  CreateCourseInput,
  CreateLessonInput,
} from "./types";
import { generateSlug } from "@/lib/utils";

const supabase = createClientComponentClient<Database>();
// Fonction pour créer un chapitre
export async function createChapter(input: CreateChapterInput) {
  // Récupérer la position la plus élevée des chapitres existants pour ce cours
  const { data: existingChapters } = await supabase
    .from("chapters")
    .select("position")
    .eq("course_id", input.course_id)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existingChapters?.[0]?.position 
    ? existingChapters[0].position + 1 
    : 1;

  const { data, error } = await supabase
    .from("chapters")
    .insert([
      {
        title: input.title,
        description: input.description,
        course_id: input.course_id,
        position: nextPosition,
        order_index: nextPosition,
        objectives: input.objectives || [], // Utiliser les objectifs de l'input
        prerequisites: input.prerequisites || [], // Utiliser les prérequis de l'input
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }

  return data;
}

// Fonction pour créer un cours
export async function createCourse(input: CreateCourseInput, authorId: string) {
  const slug = generateSlug(input.title);

  const { data, error } = await supabase
    .from("courses")
    .insert([
      {
        title: input.title,
        description: input.description,
        category_id: input.category_id,
        image_url: input.image_url,
        author_id: authorId,
        slug,
        published: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error);
    throw error;
  }

  return data;
}

// Fonction pour créer une leçon
export async function createLesson(input: CreateLessonInput) {
  const { data, error } = await supabase
    .from("lessons")
    .insert([
      {
        title: input.title,
        content: input.content,
        chapter_id: input.chapter_id,
        position: input.position,
        type: input.type,
        video_url: input.video_url,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }

  return data;
}

// Fonction pour récupérer un cours avec ses chapitres et leçons
export async function getTeacherCourse(courseId: string) {
  const supabase = createClientComponentClient<Database>();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      `
      *,
      chapters (
        *,
        lessons (*)
      )
    `,
    )
    .eq("id", courseId)
    .single();

  if (courseError) {
    console.error("Error fetching course:", courseError);
    throw courseError;
  }

  return course;
}

// Fonction pour publier un cours
export async function publishCourse(courseId: string) {
  // Vérifier si le cours a au moins un chapitre avec des leçons
  const { data: course } = await getTeacherCourse(courseId);

  if (!course.chapters || course.chapters.length === 0) {
    throw new Error(
      "Le cours doit avoir au moins un chapitre avant d'être publié",
    );
  }

  const hasLessons = course.chapters.some(
    (chapter) => chapter.lessons && chapter.lessons.length > 0,
  );

  if (!hasLessons) {
    throw new Error(
      "Le cours doit avoir au moins une leçon avant d'être publié",
    );
  }

  const { error } = await supabase
    .from("courses")
    .update({ published: true })
    .eq("id", courseId);

  if (error) {
    console.error("Error publishing course:", error);
    throw error;
  }
}

// Fonction pour mettre à jour l'ordre des chapitres
export async function updateChaptersOrder(
  chapters: { id: string; position: number }[],
) {

  const updates = chapters.map(({ id, position }) =>
    supabase.from("chapters").update({ position }).eq("id", id),
  );

  await Promise.all(updates);
}

// Fonction pour mettre à jour l'ordre des leçons
export async function updateLessonsOrder(
  lessons: { id: string; position: number }[],
) {
  const supabase = createClientComponentClient<Database>();

  const updates = lessons.map(({ id, position }) =>
    supabase.from("lessons").update({ position }).eq("id", id),
  );

  await Promise.all(updates);
}

// Fonction pour récupérer les cours d'un enseignant
export async function getTeacherCourses(teacherId: string) {
  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      chapters (
        count
      )
    `,
    )
    .eq("author_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching teacher courses:", error);
    throw error;
  }

  return courses.map((course) => ({
    ...course,
    chaptersCount: course.chapters?.[0]?.count ?? 0,
  }));
}
