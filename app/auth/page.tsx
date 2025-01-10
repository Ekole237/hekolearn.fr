'use client';

import { AuthForm } from "@/components/auth/auth-form"
import { useRedirectIfAuthenticated } from '@/lib/auth';

export default function AuthPage() {
  useRedirectIfAuthenticated();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthForm />
    </div>
  )
}