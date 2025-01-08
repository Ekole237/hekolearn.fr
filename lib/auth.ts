import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const currentPath = window.location.pathname;
        router.replace(`/auth/login?redirectTo=${encodeURIComponent(currentPath)}`);
      }
    };

    checkAuth();
  }, [router, supabase]);
}

export function useRedirectIfAuthenticated() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirectTo') || '/';
        router.replace(redirectTo);
      }
    };

    checkAuth();
  }, [router, supabase]);
}
