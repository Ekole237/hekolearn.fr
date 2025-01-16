'use client';

import Link from "next/link";
import Image from "next/image";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, GraduationCap, BarChart, CheckCircle, ArrowRight, User, Users, School } from "lucide-react";
import { AnimatedSection, AnimatedHeroContent, AnimatedHeroImage } from "@/components/home/animated-section";
import { ProfileCard } from "@/components/home/profile-card";
import 'react-lazy-load-image-component/src/effects/blur.css';// If you need to, you can tweak the effect transition using the wrapper style.

const subjects = [
  { 
    name: 'Mathématiques', 
    icon: BarChart,
    description: 'Algèbre, géométrie, probabilités et statistiques',
    color: 'bg-blue-500/10 text-blue-600'
  },
  { 
    name: 'Français', 
    icon: BookOpen,
    description: 'Grammaire, conjugaison, littérature et expression écrite',
    color: 'bg-green-500/10 text-green-600'
  },
  { 
    name: 'Sciences', 
    icon: Brain,
    description: 'Physique-chimie, SVT et technologie',
    color: 'bg-purple-500/10 text-purple-600'
  },
  { 
    name: 'Histoire-Géo', 
    icon: GraduationCap,
    description: 'Histoire, géographie et éducation civique',
    color: 'bg-orange-500/10 text-orange-600'
  },
];

const features = [
  {
    title: "Apprentissage personnalisé",
    description: "Notre IA s'adapte à votre rythme et à votre niveau pour un apprentissage optimal",
    icon: Brain,
  },
  {
    title: "Cours interactifs",
    description: "Des vidéos, des exercices et des quiz pour apprendre de manière interactive",
    icon: BookOpen,
  },
  {
    title: "Suivi des progrès",
    description: "Visualisez vos progrès et identifiez vos points forts et vos axes d'amélioration",
    icon: BarChart,
  }
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Élève de 3ème",
    content: "Grâce à Hekolearn, j'ai progressé en mathématiques et gagné en confiance !",
    avatar: "/avatars/student-1.jpg"
  },
  {
    name: "Thomas L.",
    role: "Parent d'élève",
    content: "Une plateforme complète qui aide vraiment mon fils dans sa scolarité.",
    avatar: "/avatars/parent-1.jpg"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <AnimatedHeroContent>
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              Apprenez à votre rythme avec Hekolearn
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Une plateforme éducative innovante qui s'adapte à vos besoins, de la 6ème à la Terminale.
              Progressez à votre rythme avec des cours personnalisés et un suivi intelligent.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                100% gratuit
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Certifié Education Nationale
              </div>
            </div>

            {/* Profile Selection */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Pour chaque élève, chaque classe</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Nous sommes une organisation à but non lucratif ayant pour mission de fournir un enseignement gratuit et de qualité, pour tout le monde, partout.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ProfileCard
                  title="Élèves"
                  description="Accédez à des milliers de cours"
                  icon={User}
                  role="student"
                  delay={0}
                />
                <ProfileCard
                  title="Enseignants"
                  description="Créez et partagez du contenu"
                  icon={School}
                  role="teacher"
                  delay={0.1}
                />
                <ProfileCard
                  title="Parents"
                  description="Suivez les progrès de vos enfants"
                  icon={Users}
                  role="parent"
                  delay={0.2}
                />
              </div>
            </div>
          </AnimatedHeroContent>
          <AnimatedHeroImage className="relative hidden lg:block">
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
              <LazyLoadImage
                src="/images/illustration-apprentissage.jpg"
                alt="Illustration apprentissage"
                width={620}
                height={620}
                effect="blur"
                wrapperProps={{
                  style: { transitionDelay: "1s" }
                }}
                className="object-cover object-center w-full h-full rounded-2xl"
              />
            </div>
          </AnimatedHeroImage>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1M+", label: "Élèves" },
              { number: "10K+", label: "Cours" },
              { number: "50K+", label: "Exercices" },
              { number: "95%", label: "Satisfaction" },
            ].map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Explorez nos matières</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des cours complets et structurés pour chaque niveau, du collège au lycée
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <AnimatedSection key={subject.name} delay={index * 0.1}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{subject.name}</CardTitle>
                      <CardDescription>{subject.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                        Découvrir <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Hekolearn ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une approche moderne de l'apprentissage, adaptée aux besoins de chaque élève
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection key={feature.title} delay={index * 0.1}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Ce qu'en pensent nos utilisateurs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez les témoignages de nos élèves et parents satisfaits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 0.1}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre voyage éducatif ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Rejoignez notre communauté d'apprenants et découvrez une nouvelle façon d'apprendre
            </p>
            <Button size="lg" className="min-w-[200px]">
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}