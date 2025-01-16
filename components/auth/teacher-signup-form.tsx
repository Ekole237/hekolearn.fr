"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"

export function TeacherSignUpForm() {
  const router = useRouter()

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Inscription Enseignant
        </h1>
        <p className="text-muted-foreground">
          Pour créer un compte enseignant, veuillez contacter notre bureau administratif
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-muted-foreground/20 p-6 text-center">
          <Icons.teacher className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h2 className="mt-4 font-semibold">Processus de vérification</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pour garantir la qualité de notre plateforme, nous vérifions manuellement 
            chaque demande d&apos;inscription d&apos;enseignant.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-semibold">Comment procéder :</p>
          <ol className="mt-2 list-decimal pl-4 space-y-1">
            <li>Contactez-nous par email à contact@hekolearn.fr</li>
            <li>Fournissez vos informations professionnelles</li>
            <li>Nous vous recontacterons sous 24-48h</li>
          </ol>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => router.push("/auth/signup")}
      >
        Retour
      </Button>
    </div>
  )
}
