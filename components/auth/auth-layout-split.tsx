"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface AuthLayoutSplitProps {
  children: React.ReactNode
  description?: string
}

export function AuthLayoutSplit({ children, description }: AuthLayoutSplitProps) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="/images/auth-bg.jpg"
            fill
            className="object-cover opacity-30"
            alt="Authentication background"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Hekolearn"
              width={150}
              height={50}
              className="dark:invert"
            />
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {description || 
                "Une plateforme éducative innovante qui s'adapte à vos besoins, de la 6ème à la Terminale. Progressez à votre rythme avec des cours personnalisés et un suivi intelligent."}
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  )
}
