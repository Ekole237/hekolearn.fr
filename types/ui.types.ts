import { ButtonHTMLAttributes, HTMLAttributes } from "react"
import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"
import { badgeVariants } from "@/components/ui/badge"

// Button component types
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// Badge component types
export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Section header types
export interface SectionHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

// Card types
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

// Progress types
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  className?: string
}
