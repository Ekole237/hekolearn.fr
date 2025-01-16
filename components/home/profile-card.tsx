'use client';

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { AnimatedSection } from "./animated-section";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  role: 'student' | 'teacher' | 'parent';
  delay?: number;
}

export function ProfileCard({ title, description, icon: Icon, role, delay = 0 }: ProfileCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Si c'est l'enseignant, bloquer car vous êtes le seul enseignant
    if (role === 'teacher') {
      return;
    }
    
    // Stocker le rôle sélectionné dans sessionStorage pour la page d'inscription
    sessionStorage.setItem('selectedRole', role);
    router.push('/auth/signup');
  };

  return (
    <AnimatedSection delay={delay}>
      <Card 
        className={`relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 ${
          role === 'teacher' ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="mb-3 flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-center mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground text-center">{description}</p>
          {role === 'teacher' && (
            <p className="text-xs text-muted-foreground text-center mt-2 italic">
              Inscription réservée
            </p>
          )}
        </div>
      </Card>
    </AnimatedSection>
  );
}
