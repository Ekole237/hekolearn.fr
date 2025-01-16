"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Video, BookOpen, Calculator } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import type { Resource } from "@/types/resources";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefetch } from "@/hooks/use-prefetch";
import { motion, AnimatePresence } from "framer-motion";
import { ResourceTransition } from "@/components/transitions/resource-transitions";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { cacheManager } from "@/lib/cache-manager";
import { useNavigationPreload } from "@/hooks/use-navigation-preload";
import { imageOptimizer } from "@/lib/image-optimizer";
import { performanceMonitor } from "@/lib/performance-metrics";

interface ResourceGridProps {
  resources: Resource[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const icons = {
  document: FileText,
  video: Video,
  exercise: BookOpen,
  tool: Calculator
} as const;

function ResourceCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="flex-grow">
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = icons[resource.type as keyof typeof icons];
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isLowBandwidth } = useNetworkStatus();
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);

  useEffect(() => {
    const optimizeImage = async () => {
      if (resource.thumbnail) {
        const start = performance.now();
        try {
          const optimized = await imageOptimizer.optimize(
            resource.thumbnail,
            {
              maxWidth: isMobile ? 600 : 800,
              quality: isLowBandwidth ? 0.6 : 0.8,
              format: "webp",
            }
          );
          
          const duration = performance.now() - start;
          performanceMonitor.record("image-optimization", duration, !!optimized);

          if (optimized) {
            setOptimizedImage(optimized.dataUrl);
          }
        } catch (error) {
          console.error("Erreur lors de l'optimisation de l'image:", error);
        }
      }
    };

    optimizeImage();
  }, [resource.thumbnail, isMobile, isLowBandwidth]);

  return (
    <ResourceTransition resource={resource}>
      <div 
        data-resource-id={resource.id}
        className="h-full"
      >
        <Card className="h-full flex flex-col group">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              <Badge variant="secondary">{resource.type}</Badge>
              {resource.level && <Badge>{resource.level}</Badge>}
              {resource.is_premium && (
                <Badge variant="default" className="bg-yellow-500">
                  Premium
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {resource.title}
            </CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground mb-4">
              Matière: {resource.subject}
            </p>
            {(optimizedImage || resource.thumbnail) && (
              <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden group-hover:shadow-lg transition-shadow">
                <motion.div
                  initial={false}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <Image
                    src={optimizedImage || resource.thumbnail}
                    alt={resource.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes={isMobile ? "100vw" : "(max-width: 1200px) 50vw, 33vw"}
                    priority={false}
                    onLoad={() => {
                      setImageLoaded(true);
                      performanceMonitor.record("image-load", performance.now(), true);
                    }}
                    onError={() => {
                      performanceMonitor.record("image-load", performance.now(), false);
                    }}
                  />
                </motion.div>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
              </div>
            )}
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resource.tags.map(({ tag }) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      borderColor: tag.color,
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {resource.file_url && (
              <Button className="w-full group" variant="default">
                <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Télécharger
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </ResourceTransition>
  );
}

export function ResourceGrid({ resources, isLoading, hasMore, onLoadMore }: ResourceGridProps) {
  // 1. Tous les hooks au début
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });
  const { isOnline } = useNetworkStatus();

  // Navigation preload hook
  useNavigationPreload({
    resources,
    imageOptions: {
      maxWidth: 800,
      quality: 0.8,
      format: "webp",
    },
  });

  // Effect pour le chargement infini
  useEffect(() => {
    if (inView && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  // 2. Rendu avec condition
  const isEmpty = !isLoading && resources.length === 0;

  return (
    <div className="space-y-8">
      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">Aucune ressource trouvée.</p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
              {isLoading && (
                <>
                  <ResourceCardSkeleton />
                  <ResourceCardSkeleton />
                  <ResourceCardSkeleton />
                </>
              )}
            </AnimatePresence>
          </div>
          {hasMore && isOnline && (
            <motion.div
              ref={ref}
              className="flex justify-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Skeleton className="h-10 w-32" />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
