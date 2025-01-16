import { useState } from 'react';
import { authService, type UserRole } from './auth-service';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStudentSignup = async ({
    email,
    password,
    username,
    birthDate,
    parentEmail
  }: {
    email: string;
    password: string;
    username: string;
    birthDate: Date;
    parentEmail: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signupStudent({
        email,
        password,
        username,
        birthDate,
        parentEmail
      });

      if (!result.success) {
        throw new Error('Échec de l\'inscription');
      }

      // Rediriger vers la page de confirmation
      router.push('/auth/verify-email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleParentSignup = async (token?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signupParent({ token });

      if (!result.success) {
        throw new Error('Échec de l\'inscription');
      }

      // La redirection sera gérée par Supabase OAuth
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithEmail(email, password);

      if (!result.success) {
        throw new Error('Échec de la connexion');
      }

      // Rediriger vers le dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithProvider('google');

      if (!result.success) {
        throw new Error('Échec de la connexion');
      }

      // La redirection sera gérée par Supabase OAuth
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signOut();

      if (!result.success) {
        throw new Error('Échec de la déconnexion');
      }

      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleStudentSignup,
    handleParentSignup,
    handleEmailSignIn,
    handleGoogleSignIn,
    handleSignOut
  };
}
