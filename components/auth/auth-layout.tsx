'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Image de fond avec effet de flou */}
      <Image
        src="/images/light-dispersion-optical-effect-prism.jpg"
        alt="Background"
        fill
        className="object-cover opacity-90 scale-105"
        quality={100}
        priority
      />
      
      {/* Overlay avec effet de flou amélioré */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95",
          "backdrop-blur-md",
          "transition-all duration-1000 ease-out",
          mounted ? "opacity-100" : "opacity-0"
        )} 
      />

      {/* Card avec effet d'élévation amélioré */}
      <Card 
        className={cn(
          "relative z-10 p-8 md:p-10",
          "bg-background/60 dark:bg-background/40",
          "backdrop-blur-xl",
          "border-2 border-muted/30",
          "shadow-[0_0_15px_rgba(0,0,0,0.1),0_0_6px_rgba(0,0,0,0.05)]",
          "dark:shadow-[0_0_15px_rgba(0,0,0,0.5),0_0_6px_rgba(0,0,0,0.3)]",
          "rounded-xl",
          "transition-all duration-700 ease-out transform",
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <div className="relative z-10">
          {children}
        </div>

        {/* Effet de brillance sur la carte */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-xl" />
      </Card>
    </div>
  );
}
