'use client';

import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/lib/auth/hooks";
import { PlusCircle, Settings, GraduationCap } from "lucide-react";
import { Icons } from "../ui/icons";

const navItems = [
  { href: "/courses", label: "Cours" },
  { href: "/resources", label: "Ressources" },
  { href: "/about", label: "À propos" },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const { isTeacher, isAdmin } = usePermissions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Logo - Left section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-none"
        >
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Hekolearn
            </span>
          </Link>
        </motion.div>

        {/* Navigation - Center section */}
        <div className="flex-1 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center space-x-6"
          >
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium transition-colors hover:text-primary group"
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Auth section - Right section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-4"
        >
          <ThemeToggle />
          
          {!user ? (
            <Button 
              asChild 
              variant="default"
              className="relative overflow-hidden group"
            >
              <Link href="/auth">
                <span className="relative z-10">Se connecter</span>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>
          ) : (
            <>
              {/* Actions menu for admin/teacher */}
              {(isAdmin() || isTeacher()) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {isAdmin() ? "Actions Admin" : "Actions Enseignant"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/teacher/courses/new')}>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Créer un cours
                    </DropdownMenuItem>
                    {isAdmin() && (
                      <DropdownMenuItem onClick={() => router.push('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Panneau admin
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} alt={user.email || ''} />
                      <AvatarFallback>{user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.email}
                    <div className="text-xs text-muted-foreground italic">
                      {isAdmin() ? 'Administrateur' : isTeacher() ? 'Enseignant' : 'Étudiant'}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <Icons.user className="mr-2 h-4 w-4" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <Icons.logOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
}
