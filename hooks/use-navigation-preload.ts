"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePrefetch } from "./use-prefetch";
import { imageOptimizer } from "@/lib/image-optimizer";
import type { Resource } from "@/types/resources";

const PRELOAD_DISTANCE = 100; // pixels

interface PreloadOptions {
  resources: Resource[];
  imageOptions?: {
    maxWidth?: number;
    quality?: number;
    format?: "webp" | "jpeg";
  };
}

export function useNavigationPreload({ resources, imageOptions }: PreloadOptions) {
  const pathname = usePathname();
  const { prefetchResources } = usePrefetch();
  const observer = useRef<IntersectionObserver | null>(null);
  const preloadedImages = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Réinitialiser le suivi des images préchargées lors du changement de page
    preloadedImages.current.clear();
  }, [pathname]);

  useEffect(() => {
    const preloadResource = async (resource: Resource) => {
      // Précharger l'image si elle existe et n'a pas déjà été préchargée
      if (resource.thumbnail && !preloadedImages.current.has(resource.thumbnail)) {
        preloadedImages.current.add(resource.thumbnail);
        await imageOptimizer.preloadAndOptimize(resource.thumbnail, imageOptions);
      }

      // Précharger les données associées
      if (resource.file_url) {
        prefetchResources({ id: resource.id });
      }
    };

    // Configuration de l'observer pour le préchargement
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const resourceId = entry.target.getAttribute("data-resource-id");
            if (resourceId) {
              const resource = resources.find(r => r.id === resourceId);
              if (resource) {
                preloadResource(resource);
              }
            }
          }
        });
      },
      {
        rootMargin: `${PRELOAD_DISTANCE}px`,
      }
    );

    // Observer les éléments de ressource
    const elements = document.querySelectorAll("[data-resource-id]");
    elements.forEach((element) => {
      if (observer.current) {
        observer.current.observe(element);
      }
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [resources, pathname, prefetchResources, imageOptions]);

  // Précharger les ressources visibles immédiatement
  useEffect(() => {
    const preloadVisibleResources = () => {
      resources.slice(0, 6).forEach(resource => {
        if (resource.thumbnail && !preloadedImages.current.has(resource.thumbnail)) {
          preloadedImages.current.add(resource.thumbnail);
          imageOptimizer.preloadAndOptimize(resource.thumbnail, imageOptions);
        }
      });
    };

    preloadVisibleResources();
  }, [resources, imageOptions]);
}
