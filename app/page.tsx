import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, GraduationCap, BarChart } from "lucide-react";

const subjects = [
  { name: 'Mathématiques', icon: BarChart },
  { name: 'Français', icon: BookOpen },
  { name: 'Sciences', icon: Brain },
  { name: 'Histoire-Géo', icon: GraduationCap },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Apprenez à votre rythme
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Une plateforme éducative innovante qui s'adapte à vos besoins, de la 6ème à la Terminale.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth">
              <Button size="lg">
                Commencer maintenant
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Matières</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => {
              const Icon = subject.icon;
              return (
                <Card key={subject.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-6 w-6" />
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Découvrez nos cours et exercices en {subject.name.toLowerCase()}.
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Cours Interactifs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Des cours en format texte et vidéo, conçus pour maximiser votre apprentissage.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quiz Adaptatifs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Évaluez votre compréhension avec des quiz personnalisés après chaque leçon.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>IA Personnalisée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Une intelligence artificielle qui analyse vos progrès et adapte votre parcours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}