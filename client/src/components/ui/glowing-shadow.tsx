"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import "./glowing-shadow.css"

interface GlowingShadowProps {
  children: ReactNode
  className?: string
}

export function GlowingShadow({ children, className }: GlowingShadowProps) {
  return (
    <div className={cn("glow-container", className)}>
      <span className="glow"></span>
      <div className="glow-content w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
