'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
        className="object-cover opacity-90 scale-105 light:opacity-50 light:scale-100"
        quality={75}
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDAR0XFx0aHR4dHR4mIiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJib/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      
      {/* Overlay avec effet de flou amélioré */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95",
          "backdrop-blur-md",
          "transition-all duration-300 ease-out",
          mounted ? "opacity-100" : "opacity-0"
        )} 
      />

      {/* Container du contenu avec effet de flou */}
      <div 
        className={cn(
          "relative z-10 w-full max-w-md mx-auto",
          "bg-background/60 dark:bg-background/40",
          "backdrop-blur-xl rounded-lg",
          "transition-all duration-300",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        {children}
      </div>
    </div>
  );
}
