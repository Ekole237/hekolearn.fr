import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Video, BookOpen, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: 'Ressources | Hekolearn',
  description: 'Accédez à nos ressources pédagogiques gratuites pour améliorer votre apprentissage.',
};

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'exercise' | 'tool';
  subject: string;
  level: string;
  downloadUrl?: string;
  linkUrl?: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Cours complet de Mathématiques - Fonctions',
    description: 'Un cours détaillé sur les fonctions avec exercices corrigés',
    type: 'document',
    subject: 'Mathématiques',
    level: '2nde',
    downloadUrl: '#'
  },
  {
    id: '2',
    title: 'Méthodologie - Dissertation Français',
    description: 'Guide pratique pour réussir sa dissertation',
    type: 'document',
    subject: 'Français',
    level: '1ère',
    downloadUrl: '#'
  },
  {
    id: '3',
    title: 'Vidéo - Les équations du second degré',
    description: 'Explication détaillée avec exemples',
    type: 'video',
    subject: 'Mathématiques',
    level: '2nde',
    linkUrl: '#'
  },
  {
    id: '4',
    title: 'Exercices - Géométrie dans l\'espace',
    description: 'Série d\'exercices progressifs avec corrections',
    type: 'exercise',
    subject: 'Mathématiques',
    level: '1ère',
    downloadUrl: '#'
  },
  {
    id: '5',
    title: 'Calculatrice scientifique en ligne',
    description: 'Outil pour les calculs complexes',
    type: 'tool',
    subject: 'Mathématiques',
    level: 'Tous niveaux',
    linkUrl: '#'
  }
];

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const icons = {
    document: FileText,
    video: Video,
    exercise: BookOpen,
    tool: Calculator
  };

  const Icon = icons[resource.type];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-5 w-5 text-primary" />
          <Badge variant="secondary">{resource.type}</Badge>
          <Badge>{resource.level}</Badge>
        </div>
        <CardTitle className="text-xl">{resource.title}</CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          Matière: {resource.subject}
        </p>
      </CardContent>
      <CardFooter>
        {resource.downloadUrl && (
          <Button className="w-full" variant="default">
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        )}
        {resource.linkUrl && (
          <Button className="w-full" variant="default">
            Accéder
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default function ResourcesPage() {
  const subjects = Array.from(new Set(resources.map(r => r.subject)));
  const types = Array.from(new Set(resources.map(r => r.type)));

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Ressources Pédagogiques</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez notre collection de ressources gratuites pour améliorer 
          votre apprentissage et approfondir vos connaissances.
        </p>
      </section>

      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="all">Tout</TabsTrigger>
          {types.map(type => (
            <TabsTrigger key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        {types.map(type => (
          <TabsContent key={type} value={type}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources
                .filter(resource => resource.type === type)
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <section className="bg-muted rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
        <p className="text-muted-foreground mb-6">
          N&apos;hésitez pas à nous contacter pour demander des ressources spécifiques 
          ou suggérer de nouveaux contenus.
        </p>
        <Button variant="default" size="lg">
          Contactez-nous
        </Button>
      </section>
    </div>
  );
}
