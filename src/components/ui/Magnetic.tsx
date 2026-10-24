import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type MagneticProps = {
  children: ReactNode
  /** How far the element drifts toward the pointer, as a fraction of the offset. */
  strength?: number
  className?: string
}

/**
 * Subtle magnetic pull toward the pointer for primary calls to action.
 * Mouse-only, and completely inert when reduced motion is requested.
 */
export function Magnetic({ children, strength = 0.25, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 240, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 240, damping: 20, mass: 0.4 })

  if (reduced) {
    return <span className={cn('inline-block', className)}>{children}</span>
  }

  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        const el = ref.current
        if (!el || event.pointerType !== 'mouse') return

        const rect = el.getBoundingClientRect()
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}
