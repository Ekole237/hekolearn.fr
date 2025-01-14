"use client"

import { TeacherSignUpForm } from "@/components/auth/teacher-signup-form"
import { AuthLayoutSplit } from "@/components/auth/auth-layout-split"

export default function TeacherSignupPage() {
  return (
    <AuthLayoutSplit description="Rejoignez notre communauté d'enseignants et partagez votre expertise avec nos étudiants. Ensemble, créons un environnement d'apprentissage stimulant.">
      <TeacherSignUpForm />
    </AuthLayoutSplit>
  )
}
