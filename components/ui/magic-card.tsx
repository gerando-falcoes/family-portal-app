import React, { useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface MagicCardProps {
  children: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
}

export default function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#4F46E5",
  gradientOpacity = 0.15
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      cardRef.current.style.setProperty("--gradient-x", `${x}px`)
      cardRef.current.style.setProperty("--gradient-y", `${y}px`)
    },
    []
  )

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex size-full overflow-hidden rounded-xl border border-border/60 bg-card p-6 text-card-foreground shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        className
      )}
      style={
        {
          "--gradient-size": `${gradientSize}px`,
          "--gradient-x": "0px",
          "--gradient-y": "0px",
          "--gradient-color": gradientColor,
          "--gradient-opacity": gradientOpacity,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div 
          className="absolute inset-0 rounded-xl opacity-[var(--gradient-opacity)] transition-opacity duration-300"
          style={{
            background: `radial-gradient(var(--gradient-size)px circle at var(--gradient-x) var(--gradient-y), var(--gradient-color), transparent 70%)`
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-px rounded-[11px] bg-card transition-opacity duration-300 group-hover:opacity-90" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
