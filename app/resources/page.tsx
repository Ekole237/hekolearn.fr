import { Metadata } from "next";
import { ResourceExplorer } from "@/components/resources/resource-explorer";
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Ressources Pédagogiques</h1>
        <p className="text-muted-foreground">
          Explorez notre collection de ressources pédagogiques pour tous les niveaux.
        </p>
      </div>

      <ResourceExplorer initialResources={resources} />
    </div>
  );
}
