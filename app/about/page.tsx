import { Metadata } from 'next';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: 'À propos | Hekolearn',
  description: 'Découvrez notre mission et notre approche pédagogique innovante.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Notre Mission</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Hekolearn est une plateforme éducative innovante conçue pour rendre l&apos;apprentissage 
          plus engageant et personnalisé pour chaque élève.
        </p>
      </section>

      {/* Vision Cards */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Apprentissage Personnalisé</CardTitle>
            <CardDescription>
              Adapté au rythme de chaque élève
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Notre approche pédagogique s&apos;adapte aux besoins individuels, 
              permettant à chaque élève de progresser à son propre rythme.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suivi Parental</CardTitle>
            <CardDescription>
              Impliquez-vous dans le parcours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Les parents peuvent suivre les progrès de leurs enfants et 
              rester impliqués dans leur parcours d&apos;apprentissage.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contenu de Qualité</CardTitle>
            <CardDescription>
              Ressources pédagogiques expertes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Des contenus créés par des enseignants expérimentés, 
              alignés sur le programme scolaire officiel.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Teacher Section */}
      <section className="bg-muted rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 mb-16">
        <div className="md:w-1/3">
          <Image
            src="/images/teacher-profile.jpg"
            alt="Professeur"
            width={300}
            height={300}
            className="rounded-full"
          />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold mb-4">Votre Enseignant</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Avec plus de 10 ans d&apos;expérience dans l&apos;enseignement, 
            je m&apos;engage à fournir une éducation de qualité et personnalisée 
            à chaque élève. Ma passion est de voir mes élèves réussir et 
            s&apos;épanouir dans leurs études.
          </p>
          <Button>
            En savoir plus
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-4 gap-8 text-center">
        <div className="p-6 bg-primary/5 rounded-lg">
          <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
          <p className="text-muted-foreground">Élèves Accompagnés</p>
        </div>
        <div className="p-6 bg-primary/5 rounded-lg">
          <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
          <p className="text-muted-foreground">Leçons Disponibles</p>
        </div>
        <div className="p-6 bg-primary/5 rounded-lg">
          <h3 className="text-4xl font-bold text-primary mb-2">95%</h3>
          <p className="text-muted-foreground">Taux de Satisfaction</p>
        </div>
        <div className="p-6 bg-primary/5 rounded-lg">
          <h3 className="text-4xl font-bold text-primary mb-2">6</h3>
          <p className="text-muted-foreground">Matières Couvertes</p>
        </div>
      </section>
    </div>
  );
}
