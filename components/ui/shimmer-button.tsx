import React from "react"
import { cn } from "@/lib/utils"

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
}

export default function ShimmerButton({
  children,
  className = "",
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  borderRadius = "12px",
  shimmerDuration = "3s",
  background = "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 90%)",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={{
        background: background,
        borderRadius: borderRadius,
        "--shimmer-color": shimmerColor,
        "--shimmer-duration": shimmerDuration,
      } as React.CSSProperties}
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        "before:absolute before:inset-0 before:z-[-1] before:translate-x-[-150%] before:translate-y-[-150%] before:scale-[2.5] before:rounded-[100%] before:bg-[radial-gradient(circle,transparent_20%,var(--shimmer-color)_25%,var(--shimmer-color)_26%,transparent_27%,transparent_40%,var(--shimmer-color)_45%,var(--shimmer-color)_46%,transparent_47%,transparent)] before:opacity-0 before:transition-transform before:duration-700 before:ease-out",
        "hover:before:opacity-100 hover:before:translate-x-[0%] hover:before:translate-y-[0%] hover:shadow-button-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
