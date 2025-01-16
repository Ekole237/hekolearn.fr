'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useRequireTeacher } from '@/lib/auth/hooks';
import { Button } from '@/components/ui/button';
import { Course } from '@/lib/courses/types';
import { getTeacherCourses } from '@/lib/courses/teacher-service';
import { PlusCircle, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeacherCoursesPage() {
  const { user } = useAuth();
  const { requireTeacher } = useRequireTeacher();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const userData = await requireTeacher();
        if (!userData) return;

        const teacherCourses = await getTeacherCourses(userData.id);
        setCourses(teacherCourses);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [requireTeacher]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes cours</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos cours et leur contenu
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/courses/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Créer un cours
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore créé de cours.
          </p>
          <Button asChild>
            <Link href="/teacher/courses/new">
              Créer mon premier cours
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <Badge variant={course.published ? "default" : "secondary"}>
                    {course.published ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div>📚 {course.level}</div>
                  <div>📝 {course.chaptersCount} chapitres</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href={`/teacher/courses/${course.id}`}>
                    Gérer le cours
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
