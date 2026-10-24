import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePointerFine } from '@/lib/usePointerFine'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type TiltCardProps = {
  children: ReactNode
  className?: string
  /** Peak rotation in degrees at the card's corners. */
  max?: number
  /** Lift towards the viewer on hover, in pixels. */
  lift?: number
}

/**
 * Card that leans towards the pointer in 3D. Pointer-driven only, so it is
 * completely inert on touch and under reduced motion — in both cases the card
 * renders as a plain, static surface.
 */
export function TiltCard({ children, className, max = 7, lift = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })
  const z = useSpring(useMotionValue(0), { stiffness: 220, damping: 24 })

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={
        enabled
          ? { rotateX, rotateY, z, transformPerspective: 1000, transformStyle: 'preserve-3d' }
          : undefined
      }
      onPointerMove={(event) => {
        const el = ref.current
        if (!enabled || !el || event.pointerType !== 'mouse') return

        const rect = el.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width - 0.5
        const py = (event.clientY - rect.top) / rect.height - 0.5
        rotateY.set(px * max * 2)
        rotateX.set(-py * max * 2)
      }}
      onPointerEnter={() => {
        if (enabled) z.set(lift)
      }}
      onPointerLeave={() => {
        rotateX.set(0)
        rotateY.set(0)
        z.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
