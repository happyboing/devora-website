import { motion, useScroll, useSpring } from 'motion/react'

import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

/** Thin reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 })

  if (reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[65] h-px origin-left bg-linear-to-r from-aura via-aura-soft to-ice"
    />
  )
}
