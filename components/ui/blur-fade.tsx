import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface BlurFadeProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  inView?: boolean
  className?: string
  yOffset?: number
  blur?: string
}

export default function BlurFade({
  children,
  delay = 0,
  duration = 0.6,
  inView = false,
  className,
  yOffset = 20,
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const shouldAnimate = inView ? isInView : true

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: yOffset,
        filter: `blur(${blur})`,
      }}
      animate={
        shouldAnimate
          ? {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
