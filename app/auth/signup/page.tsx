'use client';

import { SignUpForm } from "@/components/auth/signup-form";
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <SignUpForm />
    </div>
  )
}
