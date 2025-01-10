'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseEnrollment } from '@/lib/courses/service';

interface RecentCoursesProps {
  courses: (CourseEnrollment & {
    courses: {
      title: string;
      description: string;
      slug: string;
    }
  })[];
}

// Fonction utilitaire pour formater la date relative
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  } else if (diffInHours > 0) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInMinutes > 0) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  } else {
    return 'à l\'instant';
  }
}

export function RecentCourses({ courses }: RecentCoursesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Derniers cours consultés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {courses.map((enrollment) => (
            <div key={enrollment.id} className="flex items-center">
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  {enrollment.courses.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {enrollment.courses.description}
                </p>
              </div>
              <div className="ml-auto text-right space-y-1">
                <p className="text-sm font-medium leading-none">
                  {enrollment.progress}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatRelativeTime(new Date(enrollment.updated_at))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
