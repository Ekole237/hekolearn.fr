"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignUpForm() {
  const router = useRouter()

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
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

      <div className="flex flex-col items-center gap-4">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push("/auth")}
        >
          Retour
        </Button>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>En vous inscrivant sur Hekolearn, vous acceptez nos</p>
          <p className="space-x-1">
            <Link href="/terms" className="underline hover:text-primary">
              conditions d&apos;utilisation
            </Link>
            <span>et notre</span>
            <Link href="/privacy" className="underline hover:text-primary">
              politique de confidentialité
            </Link>
          </p>
          <p className="pt-2">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/signin" className="underline hover:text-primary">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
