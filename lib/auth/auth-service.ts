import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Provider } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { AuthError, AuthResponse, SignUpData, UserWithProfile } from '@/types/auth';
import { performanceMonitor } from '@/lib/performance-metrics';
import { SessionManager } from './session';

class AuthService {
  private supabase = createClientComponentClient<Database>();
  private sessionManager = SessionManager.getInstance();

  // Connexion avec email/mot de passe
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    const start = performance.now();
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw this.handleAuthError(error);
      }

      if (!data.user || !data.session) {
        throw new Error('No user or session data returned');
      }

      const profile = await this.getProfile(data.user.id);
      if (!profile) {
        throw new Error('User profile not found');
      }

      const duration = performance.now() - start;
      performanceMonitor.record('auth-signin', duration, true);

      return {
        user: { ...data.user, profile },
        error: null,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      };
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.record('auth-signin', duration, false);
      return { 
        user: null, 
        error: this.handleAuthError(error),
        session: null
      };
    }
  }

  // Connexion avec un provider (Google)
  async signInWithProvider(provider: Provider): Promise<AuthResponse> {
    const start = performance.now();
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw this.handleAuthError(error);

      const duration = performance.now() - start;
      performanceMonitor.record('auth-oauth', duration, !error);

      return {
        user: null, // L'utilisateur sera récupéré après la redirection
        error: null,
        session: data.session ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        } : undefined,
      };
    } catch (error) {
      return { user: null, error: this.handleAuthError(error) };
    }
  }

  // Inscription d'un utilisateur
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const start = performance.now();
    try {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: signUpError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            role: data.role,
            birth_date: data.birthDate,
            parent_email: data.parentEmail,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw this.handleAuthError(signUpError);
      if (!authData.user) throw new Error('No user data returned');

      // 2. Créer le profil dans public.profiles
      const { error: profileError } = await this.supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: data.email,
          username: data.username,
          role: data.role,
          is_verified: false,
          auth_provider: 'email',
          preferences: {
            theme: 'system',
            notifications: {
              email: true,
              push: true,
              desktop: true,
            },
            accessibility: {
              reduceMotion: false,
              highContrast: false,
              fontSize: 'medium',
            },
            language: 'fr',
          },
        }]);

      if (profileError) throw profileError;

      // 3. Si c'est un étudiant, créer le profil étudiant
      if (data.role === 'student') {
        const { error: studentError } = await this.supabase
          .from('student_profiles')
          .insert([{
            id: authData.user.id,
            birth_date: data.birthDate,
            parent_email: data.parentEmail,
          }]);

        if (studentError) throw studentError;
      }

      const duration = performance.now() - start;
      performanceMonitor.record('auth-signup', duration, true);

      // 4. Retourner la réponse
      const profile = await this.getProfile(authData.user.id);
      return {
        user: profile ? { ...authData.user, profile } : null,
        error: null,
        session: authData.session ? {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
        } : undefined,
      };
    } catch (error) {
      const duration = performance.now() - start;
      performanceMonitor.record('auth-signup', duration, false);
      console.error('Signup error:', error);
      return { 
        user: null, 
        error: this.handleAuthError(error),
        session: null
      };
    }
  }

  // Déconnexion
  async signOut(): Promise<void> {
    const start = performance.now();
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      
      await this.sessionManager.signOut();
      const duration = performance.now() - start;
      performanceMonitor.record('auth-signout', duration, !error);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Récupérer la session actuelle
  async getSession() {
    const start = performance.now();
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) throw error;

      const duration = performance.now() - start;
      performanceMonitor.record('auth-session', duration, !!session);

      if (session?.user) {
        const profile = await this.getProfile(session.user.id);
        return {
          user: profile ? { ...session.user, profile } : null,
          session: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
          },
        };
      }

      return { user: null, session: null };
    } catch (error) {
      console.error('Error getting session:', error);
      return { user: null, session: null };
    }
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const start = performance.now();
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      const duration = performance.now() - start;
      performanceMonitor.record('profile-update', duration, !error);

      return this.getProfile(userId);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  private async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*, student_profiles(*)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  private handleAuthError(error: any): AuthError {
    console.error('Auth error:', error);
    
    if (error.code) {
      return {
        code: error.code,
        message: this.getErrorMessage(error.code),
        status: error.status
      };
    }

    return {
      code: 'unknown_error',
      message: error.message || 'Une erreur est survenue',
      status: 500
    };
  }

  private getErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Adresse email invalide',
      'auth/user-not-found': 'Aucun compte trouvé avec cette adresse email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/invalid-credentials': 'Email ou mot de passe incorrect',
      'auth/network-request-failed': 'Erreur de connexion au serveur',
      'auth/too-many-requests': 'Trop de tentatives de connexion, veuillez réessayer plus tard',
      'auth/internal-error': 'Erreur interne du serveur',
    };

    return errorMessages[code] || 'Une erreur est survenue';
  }
}

export const authService = new AuthService();
