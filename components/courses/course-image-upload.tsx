'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { uploadCourseImage, generateUniqueFileName } from '@/lib/storage/service';
import { toast } from '@/components/ui/use-toast';

interface CourseImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
}

export function CourseImageUpload({ currentImageUrl, onImageUploaded }: CourseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image (JPG, PNG ou WebP).",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille de l'image ne doit pas dépasser 2MB.",
        variant: "destructive"
      });
      return;
    }

    // Créer une URL de prévisualisation
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload l'image
    setIsUploading(true);
    try {
      const fileName = generateUniqueFileName(file.name);
      const publicUrl = await uploadCourseImage(file, fileName);
      onImageUploaded(publicUrl);
      toast({
        title: "Image téléchargée",
        description: "L'image du cours a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement de l'image.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video relative rounded-lg overflow-hidden border">
        {(previewUrl || currentImageUrl) && (
          <Image
            src={previewUrl || currentImageUrl || ''}
            alt="Image du cours"
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('courseImage')?.click()}
        >
          {isUploading ? 'Téléchargement...' : 'Choisir une image'}
        </Button>
        <input
          type="file"
          id="courseImage"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
        />
        <p className="text-sm text-muted-foreground">
          JPG, PNG ou WebP. Max 2MB.
        </p>
      </div>
    </div>
  );
}
