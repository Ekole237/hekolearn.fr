'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from '@/lib/auth/hooks';
import { enrollInCourse } from '@/lib/courses/service';
import { toast } from '@/components/ui/use-toast';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolled?: boolean;
  href: string;
}

const levelLabels = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé'
};

export function CourseCard({ 
  id,
  title, 
  description, 
  imageUrl, 
  duration, 
  level,
  enrolled = false,
  href 
}: CourseCardProps) {
  const { user } = useUser();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(enrolled);

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour vous inscrire à ce cours.",
        variant: "destructive"
      });
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollInCourse(user.id, id);
      setIsEnrolled(true);
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à ce cours.",
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <Image 
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div>⏱️ {duration}</div>
          <div>📚 {levelLabels[level]}</div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isEnrolled ? (
          <Button asChild className="w-full">
            <Link href={href}>
              Continuer le cours
            </Link>
          </Button>
        ) : (
          <Button 
            onClick={handleEnroll} 
            disabled={isEnrolling}
            className="w-full"
          >
            {isEnrolling ? "Inscription..." : "S'inscrire"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
