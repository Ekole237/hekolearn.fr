import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { clientService } from "@/lib/services/client-service";
import { ResourceFilters } from "@/types/filters";
import { preload } from "swr";

// Clé de cache pour les ressources
const getResourceKey = (filters: ResourceFilters) => {
  return JSON.stringify({ ...filters, page: 1, pageSize: 12 });
};

export function usePrefetch() {
  const router = useRouter();

  const prefetchResources = useCallback(async (filters: ResourceFilters) => {
    const key = getResourceKey(filters);
    // Préchargement des données
    preload(key, () => clientService.getResources({ ...filters, page: 1, pageSize: 12 }));
  }, []);

  const prefetchPage = useCallback((href: string) => {
    router.prefetch(href);
  }, [router]);

  return {
    prefetchResources,
    prefetchPage,
  };
}
