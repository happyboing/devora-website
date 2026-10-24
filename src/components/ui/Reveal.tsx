import type { ReactNode } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Seconds of delay — use to stagger siblings. */
  delay?: number
  /** Starting vertical offset in pixels. */
  y?: number
  duration?: number
  once?: boolean
  amount?: number
  blur?: boolean
}

/**
 * Scroll-triggered entrance. Content is always present in the DOM and settles
 * into its final state, so the page reads correctly without motion too.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  duration = 0.72,
  once = true,
  amount = 0.2,
  blur = true,
}: RevealProps) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
