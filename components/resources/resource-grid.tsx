"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Video, BookOpen, Calculator } from "lucide-react";
import type { Resource } from "@/types/resources";

interface ResourceGridProps {
  resources: Resource[];
}

const icons = {
  document: FileText,
  video: Video,
  exercise: BookOpen,
  tool: Calculator
} as const;

function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = icons[resource.type as keyof typeof icons];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-primary" />
          <Badge variant="secondary">{resource.type}</Badge>
          {resource.level && <Badge>{resource.level}</Badge>}
          {resource.is_premium && (
            <Badge variant="default" className="bg-yellow-500">
              Premium
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl">{resource.title}</CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          Matière: {resource.subject}
        </p>
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {resource.tags.map(({ tag }) => (
              <Badge
                key={tag.id}
                variant="outline"
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
          <Button className="w-full" variant="default">
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function ResourceGrid({ resources }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune ressource trouvée.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
