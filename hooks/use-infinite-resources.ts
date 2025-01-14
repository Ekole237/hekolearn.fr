import useSWRInfinite from "swr/infinite";
import type { ResourceFilters } from "@/types/filters";
import type { Resource } from "@/types/resources";
import { clientService } from "@/lib/services/client-service";
import { offlineStorage } from "@/lib/offline-storage";

const PAGE_SIZE = 12;

// Fonction pour générer une clé de cache stable
const getResourceKey = (filters: ResourceFilters, pageIndex: number) => {
  const { search, subject, level, type, sortBy, tags } = filters;
  const key = {
    search: search || "",
    subject: subject || "",
    level: level || "",
    type: type || "",
    sortBy: sortBy || "recent",
    tags: tags || [],
    page: pageIndex + 1,
    pageSize: PAGE_SIZE
  };
  return JSON.stringify(key);
};

export function useInfiniteResources(filters: ResourceFilters) {
  // Fonction pour charger les données avec retry et cache
  const fetcher = async (key: string) => {
    const maxRetries = 3;
    let lastError: Error | null = null;

    // Vérifier d'abord le cache
    const cachedData = offlineStorage.getData(key);
    if (cachedData) {
      return cachedData;
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const params = JSON.parse(key);
        const data = await clientService.getResources(params);
        
        // Valider et transformer les données
        if (Array.isArray(data)) {
          const validatedData = data.filter(item => 
            item && typeof item === 'object' && 'id' in item
          );
          
          // Sauvegarder dans le cache
          offlineStorage.saveData(key, validatedData);
          return validatedData;
        }
        
        throw new Error("Invalid data format received");
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt + 1} failed:`, error);
        
        // Attendre avant de réessayer
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      }
    }

    // Si toutes les tentatives échouent, utiliser le cache s'il existe
    if (cachedData) {
      console.warn("Using cached data after all fetch attempts failed");
      return cachedData;
    }

    throw lastError || new Error("Failed to fetch resources");
  };

  const {
    data: pages = [],
    error,
    size,
    setSize,
    isLoading,
    isValidating: isRefreshing,
    mutate
  } = useSWRInfinite(
    (pageIndex) => getResourceKey(filters, pageIndex),
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      focusThrottleInterval: 5000,
      loadingTimeout: 5000,
      onError: (error) => {
        console.error("SWR Error:", error);
      }
    }
  );

  // Aplatir les pages en une seule liste
  const resources = pages.flat();

  // Vérifier s'il y a plus de pages
  const hasMore = pages[pages.length - 1]?.length === PAGE_SIZE;

  // Fonction pour charger plus de ressources
  const loadMore = () => {
    if (!isLoading && !isRefreshing && hasMore) {
      setSize(size + 1);
    }
  };

  return {
    resources,
    error,
    isLoading,
    isRefreshing,
    hasMore,
    loadMore,
    mutate
  };
}
