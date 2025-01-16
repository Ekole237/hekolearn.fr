'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePermissions } from '@/lib/auth/hooks';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Settings } from 'lucide-react';

interface TeacherActionsProps {
  courseId?: string;
}

export function TeacherActions({ courseId }: TeacherActionsProps) {
  const { can } = usePermissions();

  // Si l'utilisateur n'a pas les permissions nécessaires, ne rien afficher
  if (!can({ action: 'create', subject: 'courses' })) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {courseId ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/teacher/courses/${courseId}/edit`}>
                Modifier le cours
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/teacher/courses/${courseId}/chapters`}>
                Gérer les chapitres
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild>
          <Link href="/teacher/courses/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Créer un cours
          </Link>
        </Button>
      )}
    </div>
  );
}
