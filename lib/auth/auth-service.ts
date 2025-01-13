import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Provider } from '@supabase/supabase-js';

const supabase = createClientComponentClient();

export type UserRole = 'student' | 'teacher' | 'parent';

interface StudentSignupData {
  email: string;
  password: string;
  username: string;
  birthDate: Date;
  parentEmail: string;
}

interface ParentSignupData {
  token?: string;
}

export const authService = {
  // Inscription d'un étudiant
  async signupStudent({ email, password, username, birthDate, parentEmail }: StudentSignupData) {
    try {
      // 1. Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role: 'student'
          }
        }
      });

      if (authError) throw authError;

      // 2. Créer le profil étudiant
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user?.id,
          email,
          full_name: username,
          role: 'student',
          auth_provider: 'email'
        });

      if (profileError) throw profileError;

      // 3. Créer le profil étudiant détaillé
      const { error: studentError } = await supabase
        .from('student_profiles')
        .insert({
          id: authData.user?.id,
          birth_date: birthDate,
          parent_email: parentEmail
        });

      if (studentError) throw studentError;

      // 4. Créer l'invitation pour le parent
      const { error: inviteError } = await supabase
        .rpc('create_parent_invitation', {
          student_id: authData.user?.id,
          parent_email: parentEmail
        });

      if (inviteError) throw inviteError;

      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Error during student signup:', error);
      return { success: false, error };
    }
  },

  // Inscription d'un parent (avec Google uniquement)
  async signupParent({ token }: ParentSignupData) {
    try {
      // 1. Connexion avec Google
      const { data: authData, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: token 
            ? `${window.location.origin}/auth/callback?token=${token}`
            : `${window.location.origin}/auth/callback`
        }
      });

      if (authError) throw authError;

      return { success: true };
    } catch (error) {
      console.error('Error during parent signup:', error);
      return { success: false, error };
    }
  },

  // Connexion avec email/mot de passe
  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error during email sign in:', error);
      return { success: false, error };
    }
  },

  // Connexion avec un provider (Google)
  async signInWithProvider(provider: Provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error during provider sign in:', error);
      return { success: false, error };
    }
  },

  // Déconnexion
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error during sign out:', error);
      return { success: false, error };
    }
  },

  // Validation d'une invitation parent
  async validateParentInvitation(token: string) {
    try {
      const { data, error } = await supabase
        .rpc('validate_parent_invitation', { token });

      if (error) throw error;

      return { success: true, validated: data };
    } catch (error) {
      console.error('Error validating parent invitation:', error);
      return { success: false, error };
    }
  }
};
