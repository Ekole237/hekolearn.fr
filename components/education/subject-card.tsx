import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface SubjectCardProps {
  id: string;
  name: string;
  description: string;
  slug: string;
  iconUrl?: string;
  coursesCount: number;
  gradeLevels: string[];
}

export function SubjectCard({
  name,
  description,
  slug,
  iconUrl,
  coursesCount,
  gradeLevels,
}: SubjectCardProps) {
  return (
    <Link href={`/subjects/${slug}`}>
      <Card className="h-full transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            {iconUrl && (
              <div className="h-12 w-12">
                <img
                  src={iconUrl}
                  alt={name}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div>
              <CardTitle className="text-xl">{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {coursesCount} cours disponibles
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {gradeLevels.map((level) => (
                <Badge key={level} variant="secondary">
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
