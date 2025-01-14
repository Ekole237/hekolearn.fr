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
  let teachers = [];
  try {
    teachers = await dataService.getTeachers();
  } catch (error) {
    console.error('Erreur lors du chargement des enseignants:', error);
  }

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
              Une approche moderne de l&apos;apprentissage adaptée aux besoins actuels.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Statistiques */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">{value}</CardTitle>
              <CardDescription className="text-center capitalize">
                {key === "experience" ? "années d'expérience" :
                 key === "satisfaction" ? "satisfaction" :
                 key === "students" ? "élèves" : "matières"}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* Équipe */}
      {teachers.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Notre Équipe</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {teachers.map((teacher) => (
              <Card key={teacher.id}>
                <CardContent className="flex items-start space-x-4 pt-6">
                  <Avatar className="h-16 w-16">
                    {teacher.avatar_url ? (
                      <AvatarImage src={teacher.avatar_url} alt={teacher.full_name} />
                    ) : (
                      <AvatarFallback>{teacher.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{teacher.full_name}</h3>
                    {teacher.title && (
                      <Badge variant="secondary" className="mb-2">
                        {teacher.title}
                      </Badge>
                    )}
                    {teacher.bio && (
                      <p className="text-muted-foreground text-sm">
                        {teacher.bio}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
