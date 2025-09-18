import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

interface NumberTickerProps {
  value: number
  direction?: "up" | "down"
  delay?: number
  className?: string
  format?: "number" | "currency" | "percentage"
  decimalPlaces?: number
}

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  format = "number",
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value)
      }, delay * 1000)
  }, [motionValue, isInView, delay, value, direction])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          const num = Number(latest.toFixed(decimalPlaces))
          
          let formattedValue: string
          
          switch (format) {
            case "currency":
              formattedValue = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              }).format(num)
              break
            case "percentage":
              formattedValue = new Intl.NumberFormat("pt-BR", {
                style: "percent",
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              }).format(num / 100)
              break
            default:
              formattedValue = new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
              }).format(num)
          }
          
          ref.current.textContent = formattedValue
        }
      }),
    [springValue, format, decimalPlaces]
  )

  return <span className={className} ref={ref} />
}
