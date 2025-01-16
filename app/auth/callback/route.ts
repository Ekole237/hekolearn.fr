import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    try {
      // Échanger le code contre une session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;

      if (session?.user) {
        // Vérifier si l'utilisateur a un profil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = Not Found
          throw profileError;
        }

        // Si pas de profil, rediriger vers la page de complétion du profil
        if (!profile) {
          return NextResponse.redirect(new URL('/auth/complete-profile', requestUrl.origin));
        }

        // Rediriger selon le rôle
        const redirectPath = getRedirectPath(profile.role);
        return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
      // En cas d'erreur, rediriger vers la page de connexion avec un message d'erreur
      return NextResponse.redirect(
        new URL('/auth/login?error=Erreur lors de la connexion', requestUrl.origin)
      );
    }
  }

  // Si pas de code ou autre erreur, rediriger vers la page d'accueil
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}

function getRedirectPath(role?: string): string {
  switch (role) {
    case 'teacher':
      return '/teacher/dashboard';
    case 'student':
      return '/student/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}
