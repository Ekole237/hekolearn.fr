import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useRequireAuth(requiredRole?: 'student' | 'teacher') {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          const currentPath = window.location.pathname;
          router.replace(`/auth/login?redirectTo=${encodeURIComponent(currentPath)}`);
          return;
        }

        if (requiredRole) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile?.role !== requiredRole) {
            router.replace('/unauthorized');
            return;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/auth/login');
      }
    };

    checkAuth();
  }, [router, supabase, requiredRole]);
}

export function useRedirectIfAuthenticated() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          const params = new URLSearchParams(window.location.search);
          const redirectTo = params.get('redirectTo') || '/';
          router.replace(redirectTo);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [router, supabase]);
}
