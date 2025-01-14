"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StudentSignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [birthDate, setBirthDate] = useState({
    month: "",
    day: "",
    year: "",
  })

  const [formData, setFormData] = useState({
    parentEmail: "",
    username: "",
    password: "",
  })

  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ]

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())

  const handleNextStep = () => {
    if (birthDate.month && birthDate.day && birthDate.year) {
      setStep(2)
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    // TODO: Ajouter la logique d'inscription
    setTimeout(() => {
      setIsLoading(false)
      router.push("/auth/signin")
    }, 3000)
  }

  if (step === 1) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Quelle est votre date de naissance ?
          </h1>
          <p className="text-muted-foreground">
            Cette information nous permet de personnaliser votre expérience d&apos;apprentissage
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-2 w-full max-w-[400px]">
            <Select
              value={birthDate.month}
              onValueChange={(value) => setBirthDate({ ...birthDate, month: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Mois" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={birthDate.day}
              onValueChange={(value) => setBirthDate({ ...birthDate, day: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Jour" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={birthDate.year}
              onValueChange={(value) => setBirthDate({ ...birthDate, year: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleNextStep}
            className="w-full max-w-[400px]"
            disabled={!birthDate.month || !birthDate.day || !birthDate.year}
          >
            Inscrivez-vous en choisissant un nom d&apos;utilisateur
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-primary"
              onClick={() => router.push("/auth/signin")}
            >
              Vous avez déjà un compte ?
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full max-w-[400px]"
            onClick={() => router.push("/auth/signup")}
          >
            Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Inscription Étudiant
        </h1>
        <p className="text-muted-foreground">
          Complétez votre inscription
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="parentEmail">Email du parent</Label>
          <Input
            id="parentEmail"
            placeholder="parent@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            required
            value={formData.parentEmail}
            onChange={(e) =>
              setFormData({ ...formData, parentEmail: e.target.value })
            }
          />
          <p className="text-sm text-muted-foreground">
            L&apos;adresse email doit être valide et sera utilisée pour informer le parent de l&apos;activité de l&apos;étudiant
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Nom d&apos;utilisateur</Label>
          <Input
            id="username"
            placeholder="johndoe"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <p className="text-sm text-muted-foreground">
            Le nom d&apos;utilisateur doit contenir uniquement des lettres et des chiffres, sans espaces ni caractères spéciaux
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            placeholder="********"
            type="password"
            autoCapitalize="none"
            autoComplete="new-password"
            autoCorrect="off"
            disabled={isLoading}
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <p className="text-sm text-muted-foreground">
            Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial
          </p>
        </div>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          S&apos;inscrire
        </Button>
      </form>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => setStep(1)}
        disabled={isLoading}
      >
        Retour
      </Button>
    </div>
  )
}
