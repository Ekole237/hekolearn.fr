"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"

export function ParentSignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const signInWithGoogle = async () => {
    setIsLoading(true)
    // TODO: Implémenter la connexion Google
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 3000)
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Inscription Parent
        </h1>
        <p className="text-muted-foreground">
          Connectez-vous avec Google pour suivre les progrès de vos enfants
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          type="button" 
          className="w-full"
          disabled={isLoading}
          onClick={signInWithGoogle}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Se connecter avec Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Pourquoi Google ?
            </span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>La connexion avec Google permet de :</p>
          <ul className="mt-2 space-y-1">
            <li>Sécuriser votre compte</li>
            <li>Simplifier la connexion</li>
            <li>Accéder rapidement au suivi</li>
          </ul>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => router.push("/auth/signup")}
        disabled={isLoading}
      >
        Retour
      </Button>
    </div>
  )
}
