'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Intermédiaire' | 'Avancé';
  estimatedTime: string;
}

interface RecommendedCoursesProps {
  courses: RecommendedCourse[];
}

export function RecommendedCourses({ courses }: RecommendedCoursesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommandés pour vous</CardTitle>
        <CardDescription>
          Basé sur votre niveau et vos centres d&apos;intérêt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">
                  {course.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{course.difficulty}</span>
                  <span>•</span>
                  <span>{course.estimatedTime}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/courses/${course.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
