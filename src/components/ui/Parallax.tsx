import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type ParallaxProps = {
  children: ReactNode
  className?: string
  /**
   * Positive values drift the element *against* the scroll (it rises as the
   * page moves down); negative values let it lag behind. Roughly the peak
   * travel in pixels at either end of the element's pass through the viewport.
   */
  distance?: number
  axis?: 'x' | 'y'
  /** Adds a light spring so the motion trails the scrollwheel smoothly. */
  smooth?: boolean
}

/**
 * Scroll-linked parallax. The offset is derived from the element's own progress
 * through the viewport, so it is frame-accurate and needs no scroll listener of
 * its own. Inert under reduced motion (the child simply renders in place).
 */
export function Parallax({
  children,
  className,
  distance = 60,
  axis = 'y',
  smooth = true,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  const eased = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 })
  const value = smooth ? eased : raw

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={reduced ? undefined : axis === 'x' ? { x: value } : { y: value }}
    >
      {children}
    </motion.div>
  )
}
