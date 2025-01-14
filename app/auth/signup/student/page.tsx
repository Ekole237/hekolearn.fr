"use client"

import { StudentSignUpForm } from "@/components/auth/student-signup-form"
import { AuthLayoutSplit } from "@/components/auth/auth-layout-split"

export default function StudentSignupPage() {
  return (
    <AuthLayoutSplit description="Rejoignez Hekolearn en tant qu'étudiant et accédez à des cours personnalisés qui s'adaptent à votre rythme d'apprentissage.">
      <StudentSignUpForm />
    </AuthLayoutSplit>
  )
}
