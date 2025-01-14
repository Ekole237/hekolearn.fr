'use client';

import { useState, useEffect } from 'react';
import { SignUpForm } from "@/components/auth/signup-form";
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <SignUpForm />
    </div>
  )
}
