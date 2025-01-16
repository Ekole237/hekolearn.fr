'use client';

import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthForm } from '@/components/auth/auth-form';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';

export default function AuthPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </AuthLayout>
  );
}