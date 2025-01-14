"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ResourceGrid } from "./resource-grid";
import { FilterBar } from "./filters/filter-bar";
import { SearchBar } from "./filters/search-bar";
import { useInfiniteResources } from "@/hooks/use-infinite-resources";
import type { ResourceFilters } from "@/types/filters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

interface ResourceExplorerProps {
  initialResources?: any[];
}

export function ResourceExplorer({ initialResources }: ResourceExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Construction mémorisée des filtres
  const filters = useMemo<ResourceFilters>(() => ({
    search: searchParams.get("q") || "",
    subject: searchParams.get("subject") || null,
    level: searchParams.get("level") || null,
    type: searchParams.get("type") || null,
    sortBy: (searchParams.get("sort") as ResourceFilters["sortBy"]) || "recent",
    tags: searchParams.getAll("tags"),
  }), [searchParams]);

  // Hook personnalisé pour les ressources avec mémoisation des paramètres
  const {
    resources = initialResources || [],
    error,
    isLoading,
    isRefreshing,
    hasMore,
    loadMore,
    mutate
  } = useInfiniteResources(filters);

  // Fonction mémorisée pour la mise à jour de l'URL
  const updateUrl = useCallback((newFilters: ResourceFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    // Ne mettre à jour que les paramètres qui ont changé
    if (newFilters.search !== filters.search) {
      if (newFilters.search) params.set("q", newFilters.search);
      else params.delete("q");
    }

    if (newFilters.subject !== filters.subject) {
      if (newFilters.subject) params.set("subject", newFilters.subject);
      else params.delete("subject");
    }

    if (newFilters.level !== filters.level) {
      if (newFilters.level) params.set("level", newFilters.level);
      else params.delete("level");
    }

    if (newFilters.type !== filters.type) {
      if (newFilters.type) params.set("type", newFilters.type);
      else params.delete("type");
    }

    if (newFilters.sortBy !== filters.sortBy) {
      params.set("sort", newFilters.sortBy);
    }

    // Gestion spéciale des tags pour éviter les doublons
    params.delete("tags");
    if (newFilters.tags?.length) {
      newFilters.tags.forEach(tag => params.append("tags", tag));
    }

    const newUrl = `${pathname}?${params.toString()}`;
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  }, [pathname, router, searchParams, filters]);

  // Fonction mémorisée pour le changement de filtres
  const handleFilterChange = useCallback((key: keyof ResourceFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    updateUrl(newFilters);
  }, [filters, updateUrl]);

  // Fonction mémorisée pour le chargement de plus de ressources
  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isRefreshing && hasMore) {
      loadMore();
    }
  }, [isLoading, isRefreshing, hasMore, loadMore]);

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex items-center gap-2">
            Une erreur est survenue lors du chargement des ressources.
            <button 
              onClick={() => mutate()} 
              className="flex items-center gap-1 underline"
              disabled={isLoading || isRefreshing}
            >
              <ReloadIcon className="h-4 w-4" /> Réessayer
            </button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <SearchBar
          value={filters.search}
          onChange={(value) => handleFilterChange("search", value)}
          isLoading={isPending || isRefreshing}
        />
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          disabled={isLoading || isRefreshing}
        />
      </div>

      <ResourceGrid
        resources={resources}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
