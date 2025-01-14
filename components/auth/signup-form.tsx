"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignUpForm() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Inscrivez-vous
        </h1>
        <p className="text-muted-foreground">
          Soutenez l&apos;apprentissage de votre enfant à travers Hekolearn
        </p>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start space-x-4 h-auto py-4"
          onClick={() => router.push("/auth/signup/student")}
        >
          <Icons.user className="h-5 w-5 shrink-0" />
          <div className="text-left">
            <div className="font-semibold">Étudiant</div>
            <div className="text-sm text-muted-foreground">
              Accédez aux cours et suivez votre progression
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start space-x-4 h-auto py-4"
          onClick={() => router.push("/auth/signup/teacher")}
        >
          <Icons.teacher className="h-5 w-5 shrink-0" />
          <div className="text-left">
            <div className="font-semibold">Enseignant</div>
            <div className="text-sm text-muted-foreground">
              Créez des cours et suivez vos élèves
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start space-x-4 h-auto py-4"
          onClick={() => router.push("/auth/signup/parent")}
        >
          <Icons.parent className="h-5 w-5 shrink-0" />
          <div className="text-left">
            <div className="font-semibold">Parent</div>
            <div className="text-sm text-muted-foreground">
              Suivez les progrès de vos enfants
            </div>
          </div>
        </Button>
      </div>

      <div className="text-center text-sm">
        Vous avez déjà un compte ?{" "}
        <Link href="/auth" className="font-medium text-primary hover:underline">
          Connectez-vous
        </Link>
      </div>
    </div>
  )
}
