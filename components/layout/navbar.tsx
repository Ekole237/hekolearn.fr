'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { usePermissions } from '@/lib/auth/hooks';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/auth/user-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, GraduationCap, Layout } from 'lucide-react';

const routes = [
  {
    label: 'Accueil',
    href: '/',
    icon: Layout,
  },
  {
    label: 'Cours',
    href: '/courses',
    icon: BookOpen,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { can } = usePermissions();

  const isTeacher = can({ action: 'create', subject: 'courses' });

  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <div className="flex items-center gap-x-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium flex items-center hover:text-primary transition-colors
                ${pathname === route.href ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <route.icon className="h-4 w-4 mr-2" />
              {route.label}
            </Link>
          ))}

          {isTeacher && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Enseigner
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/teacher/courses">
                    Mes cours
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/teacher/courses/new">
                    Créer un cours
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-x-2">
          {!loading && (
            user ? (
              <UserButton />
            ) : (
              <Button size="sm" variant="ghost" asChild>
                <Link href="/auth/login">
                  Connexion
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
