"use client"

import { ParentSignUpForm } from "@/components/auth/parent-signup-form"
import { AuthLayoutSplit } from "@/components/auth/auth-layout-split"

export default function ParentSignupPage() {
  return (
    <AuthLayoutSplit>
      <ParentSignUpForm />
    </AuthLayoutSplit>
  )
}
