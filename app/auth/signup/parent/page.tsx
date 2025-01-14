"use client"

import { ParentSignUpForm } from "@/components/auth/parent-signup-form"
import { AuthLayoutSplit } from "@/components/auth/auth-layout-split"

export default function ParentSignupPage() {
  return (
    <AuthLayoutSplit description="Suivez les progrès de vos enfants et accompagnez-les dans leur réussite scolaire avec Hekolearn.">
      <ParentSignUpForm />
    </AuthLayoutSplit>
  )
}
