'use client'

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
      <div className="relative hidden h-full flex-col bg-muted text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="/images/signup-all.jpg"
            fill
            className="object-cover opacity-80"
            alt="Authentication background"
          />
        </div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-center">
          <h1 className="text-7xl font-bold mb-6">
            Hekolearn
          </h1>
          <p className="text-lg max-w-[40ch]">
            {description || 
              "Une plateforme éducative innovante qui s'adapte à vos besoins, de la 6ème à la Terminale. Progressez à votre rythme avec des cours personnalisés et un suivi intelligent."}
          </p>
        </div>
      </div>
      <div className="lg:p-8 flex flex-col justify-center items-center w-full min-h-screen">
        <div className="mx-auto flex w-full flex-col justify-center items-center sm:w-[386px] px-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
