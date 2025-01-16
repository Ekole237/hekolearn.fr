"use client"

import { TeacherSignUpForm } from "@/components/auth/teacher-signup-form"
import { AuthLayoutSplit } from "@/components/auth/auth-layout-split"

export default function TeacherSignupPage() {
  return (
    <AuthLayoutSplit>
      <TeacherSignUpForm />
    </AuthLayoutSplit>
  )
}
