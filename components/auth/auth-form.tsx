'use client'

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
import Link from 'next/link'

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      if (!formData.email || !formData.password) {
        throw new Error("L'email et le mot de passe sont requis");
      }

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
    } catch (error) {
      const authError = error as AuthError;
      console.error('Auth error:', authError);
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: authError.message || "Une erreur est survenue lors de la connexion.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const response = await authService.signInWithGoogle();
      
      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      const redirectPath = getRedirectPath(response.user.profile.role);
      router.push(redirectPath);
    } catch (error) {
      const authError = error as AuthError;
      console.error('Google auth error:', authError);
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: authError.message || "Une erreur est survenue lors de la connexion avec Google.",
      });
    } finally {
      setLoading(false);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte HekoLearn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
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
              disabled={loading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>
        </form>

        <Separator className="my-4" />

        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Continuer avec Google
        </Button>

        <div className="mt-4 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            S'inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}