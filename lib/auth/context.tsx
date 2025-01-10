'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/database.types';

type UserWithRole = User & {
  role?: 'student' | 'teacher' | 'admin';
};

interface AuthState {
  user: UserWithRole | null;
  loading: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        // Récupérer le profil de l'utilisateur avec son rôle
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setState(prev => ({
          ...prev,
          user: {
            ...session.user,
            role: profile?.role
          },
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setState(prev => ({
        ...prev,
        error: error as Error,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    refreshSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Récupérer le profil de l'utilisateur avec son rôle
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          setState(prev => ({
            ...prev,
            user: {
              ...session.user,
              role: profile?.role
            },
            loading: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            loading: false,
          }));
        }

        if (event === 'SIGNED_OUT') {
          router.push('/auth/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}
