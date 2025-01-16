"use client"

import { StudentSignUpForm } from "@/components/auth/student-signup-form"
import { AuthLayoutSplit } from "@/components/auth/auth-layout-split"

export default function StudentSignupPage() {
  return (
    <AuthLayoutSplit>
      <StudentSignUpForm />
    </AuthLayoutSplit>
  )
}
