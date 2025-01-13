'use client';

import { useState, useEffect } from 'react';
import { SignupForm } from '@/components/auth/signup-form';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const router = useRouter();

  useEffect(() => {
    // Récupérer le rôle depuis sessionStorage
    const role = sessionStorage.getItem('selectedRole') as 'student' | 'teacher' | 'parent';
    if (role) {
      setSelectedRole(role);
      // Nettoyer le sessionStorage
      sessionStorage.removeItem('selectedRole');
    }

    // Si c'est le rôle enseignant, rediriger vers la page d'accueil
    if (role === 'teacher') {
      router.push('/');
    }
  }, [router]);

  return (
    <AuthLayout>
      <SignupForm 
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />
    </AuthLayout>
  );
}
