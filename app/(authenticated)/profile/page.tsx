import { createServerClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Book, Clock, Star } from "lucide-react";

export default async function ProfilePage() {
  const supabase = createServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Récupérer le profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  // Récupérer les achievements
  const { data: achievements } = await supabase
    .from("user_achievements")
    .select(`
      *,
      achievement:achievements(
        name,
        description,
        badge_url
      )
    `)
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  // Récupérer les statistiques d'apprentissage
  const { data: analytics } = await supabase
    .from("student_analytics")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(10);

  // Récupérer les cours en cours
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select(`
      *,
      course:courses(
        title,
        subject:subjects(name)
      )
    `)
    .eq("user_id", userId)
    .order("last_accessed_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <img
          src={profile?.avatar_url}
          alt={profile?.full_name}
          className="h-24 w-24 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
          <p className="text-muted-foreground">
            {profile?.role === "student" ? "Élève" : "Enseignant"}
            {profile?.grade_level && ` • ${profile.grade_level}`}
          </p>
        </div>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="progress">Progression</TabsTrigger>
          <TabsTrigger value="achievements">Récompenses</TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <div className="grid gap-6 md:grid-cols-2">
            {enrollments?.map((enrollment) => (
              <Card key={enrollment.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge>{enrollment.course.subject.name}</Badge>
                    <h3 className="text-lg font-semibold mt-2">
                      {enrollment.course.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">
                      {enrollment.progress}%
                    </span>
                  </div>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements?.map((achievement) => (
              <Card key={achievement.id} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{achievement.achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.achievement.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temps total</p>
                  <p className="text-2xl font-bold">24h</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leçons terminées</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score moyen</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
