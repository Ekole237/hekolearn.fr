"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth/auth-service'
import { Icons } from '@/components/ui/icons'
import { AuthError } from '@/types/auth'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    birthDate: '',
    parentEmail: ''
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        if (step === 1) {
          if (!formData.email || !formData.password) {
            throw new Error("L'email et le mot de passe sont requis");
          }
          setStep(2);
          setLoading(false);
          return;
        }

        if (!formData.username) {
          throw new Error("Le nom d'utilisateur est requis");
        }
        if (!formData.birthDate) {
          throw new Error("La date de naissance est requise");
        }
        if (!formData.parentEmail) {
          throw new Error("L'email du parent est requis");
        }

        const response = await authService.signUp({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          role: 'student',
          birthDate: formData.birthDate,
          parentEmail: formData.parentEmail,
        });

        if (response.error) {
          throw response.error;
        }

        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });

        router.push('/auth/verify');
      } else {
        const response = await authService.signInWithEmail(formData.email, formData.password);

        if (response.error) {
          throw response.error;
        }

        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });

        if (!response.user?.profile?.is_verified) {
          router.push('/auth/verify');
          return;
        }

        const redirectPath = getRedirectPath(response.user.profile.role);
        router.push(redirectPath);
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Auth error:', authError);
      
      toast({
        title: "Erreur",
        description: authError.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const response = await authService.signInWithProvider('google');
      
      if (response.error) {
        throw response.error;
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erreur",
        description: getErrorMessage(authError),
        variant: "destructive",
      });
    }
  }

  const getErrorMessage = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Adresse email invalide';
      case 'auth/weak-password':
        return 'Le mot de passe doit contenir au moins 6 caractères';
      case 'auth/email-already-in-use':
        return 'Cette adresse email est déjà utilisée';
      default:
        return error.message;
    }
  }

  const getRedirectPath = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'teacher':
        return '/teacher';
      case 'parent':
        return '/parent';
      default:
        return '/dashboard';
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      setIsSignUp(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? "Inscription" : "Connexion"}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? "Créez votre compte pour accéder à la plateforme"
            : "Connectez-vous à votre compte"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp ? (
            step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Utilisez seulement des lettres et des chiffres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email du parent</Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
            {(isSignUp && step === 2) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={loading}
              >
                Précédent
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp 
                    ? (step === 1 ? "Suivant..." : "Inscription...") 
                    : "Connexion..."}
                </>
              ) : (
                isSignUp 
                  ? (step === 1 ? "Suivant" : "S'inscrire")
                  : "Se connecter"
              )}
            </Button>
          </div>
        </form>

        <Separator className="my-4" />

        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Continuer avec Google
        </Button>

        <div className="mt-4 text-center text-sm">
          {isSignUp ? (
            <>
              Déjà un compte ?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => {
                  setIsSignUp(false);
                  setStep(1);
                }}
              >
                Se connecter
              </Button>
            </>
          ) : (
            <>
              Pas encore de compte ?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => {
                  setIsSignUp(true);
                  setStep(1);
                }}
              >
                S'inscrire
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}