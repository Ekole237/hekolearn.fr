"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { SearchBar } from "./filters/search-bar";
import { FilterBar } from "./filters/filter-bar";
import { ResourceGrid } from "./resource-grid";
import type { Resource } from "@/types/resources";
import type { ResourceFilters } from "@/types/filters";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ResourceExplorerProps {
  initialResources: Resource[];
}

export function ResourceExplorer({ initialResources }: ResourceExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // État initial des filtres basé sur les paramètres d'URL
  const [filters, setFilters] = useState<ResourceFilters>(() => ({
    search: searchParams.get("q") || "",
    subject: searchParams.get("subject") || undefined,
    level: searchParams.get("level") || undefined,
    type: searchParams.get("type") || undefined,
    sortBy: (searchParams.get("sort") as ResourceFilters["sortBy"]) || "recent",
  }));

  // Mise à jour des filtres et de l'URL
  const updateFilters = useCallback((key: keyof ResourceFilters, value: any) => {
    startTransition(() => {
      setFilters(prev => {
        const newFilters = { ...prev, [key]: value };
        const params = new URLSearchParams(searchParams);
        
        // Mise à jour des paramètres d'URL
        if (value) {
          params.set(key === "sortBy" ? "sort" : key, value);
        } else {
          params.delete(key === "sortBy" ? "sort" : key);
        }

        // Mise à jour de l'URL
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.push(newUrl, { scroll: false });

        return newFilters;
      });
    });
  }, [pathname, router, searchParams]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchBar
          initialValue={filters.search}
          onSearch={(value) => updateFilters("search", value)}
          placeholder="Rechercher une ressource..."
        />
        <FilterBar filters={filters} onFilterChange={updateFilters} />
      </div>

      {isPending ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Mise à jour des résultats...</p>
        </div>
      ) : (
        <ResourceGrid resources={initialResources} />
      )}
    </div>
  );
}
