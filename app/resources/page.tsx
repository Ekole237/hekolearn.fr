import { Metadata } from "next";
import { Suspense } from "react";
import { ResourceExplorer } from "@/components/resources/resource-explorer";
import { Skeleton } from "@/components/ui/skeleton";
import { dataService } from "@/lib/services/data-service";
import type { ResourceFilters } from "@/types/filters";

export const metadata: Metadata = {
  title: "Ressources | Hekolearn",
  description: "Découvrez nos ressources pédagogiques pour tous les niveaux.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: {
    q?: string;
    subject?: string;
    level?: string;
    type?: string;
    sort?: string;
  };
}

function ResourceExplorerSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[300px]">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  // Conversion des paramètres d'URL en filtres
  const filters: ResourceFilters = {
    search: searchParams.q || "",
    subject: searchParams.subject,
    level: searchParams.level,
    type: searchParams.type,
    sortBy: (searchParams.sort as ResourceFilters["sortBy"]) || "recent",
  };

  // Récupération des ressources filtrées
  const resources = await dataService.getResources(filters);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Ressources Pédagogiques</h1>
          <p className="text-muted-foreground">
            Explorez notre collection de ressources pédagogiques pour tous les niveaux.
          </p>
        </div>

        <Suspense fallback={<ResourceExplorerSkeleton />}>
          <ResourceExplorer initialResources={resources} />
        </Suspense>
      </div>
    </main>
  );
}
