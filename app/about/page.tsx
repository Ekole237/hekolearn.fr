import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { dataService } from '@/lib/services/data-service';

export const metadata: Metadata = {
  title: 'À propos | Hekolearn',
  description: 'Découvrez notre mission et notre vision pour l\'éducation.',
};

const stats = {
  students: "500+",
  experience: "10+",
  satisfaction: "95%",
  subjects: "6"
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const teachers = await dataService.getTeachers();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* En-tête */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Notre Mission</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Rendre l&apos;éducation accessible à tous en fournissant des ressources
          pédagogiques de qualité et un accompagnement personnalisé.
        </p>
      </section>

      {/* Vision Cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Accessibilité</CardTitle>
            <CardDescription>
              Des ressources pédagogiques gratuites et accessibles à tous les élèves.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Qualité</CardTitle>
            <CardDescription>
              Des contenus créés par des enseignants expérimentés et régulièrement mis à jour.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Innovation</CardTitle>
            <CardDescription>
              Des méthodes d&apos;apprentissage modernes et adaptées aux besoins actuels.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Teachers Section */}
      {teachers.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Notre Équipe Pédagogique</h2>
          <div className="grid gap-8">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 p-8">
                  <div className="flex flex-col items-center md:items-start">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage src={teacher.avatar_url || ''} alt={teacher.full_name} />
                      <AvatarFallback>{teacher.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {teacher.is_founder && (
                      <Badge className="bg-primary" variant="secondary">
                        Fondateur
                      </Badge>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{teacher.full_name}</h3>
                    </div>
                    <p className="text-muted-foreground mb-2">{teacher.role_title}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{teacher.bio}</p>
                    <p className="text-sm">{teacher.education}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Statistics */}
      <section className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-primary">
              {stats.students}
            </CardTitle>
            <CardDescription>Élèves accompagnés</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Depuis la création
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-primary">
              {stats.experience}
            </CardTitle>
            <CardDescription>Années d&apos;expérience</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            En enseignement
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-primary">
              {stats.satisfaction}
            </CardTitle>
            <CardDescription>Satisfaction</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Des élèves satisfaits
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-primary">
              {stats.subjects}
            </CardTitle>
            <CardDescription>Matières</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Principales couvertes
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
