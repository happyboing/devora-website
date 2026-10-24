import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type WordProps = {
  progress: MotionValue<number>
  range: [number, number]
  children: ReactNode
  className?: string
}

/** A single word that warms from muted to bright as the page scrolls past. */
function Word({ progress, range, children, className }: WordProps) {
  // Colour (rather than opacity) keeps every resting word above the WCAG AA
  // contrast floor while still reading as a paced reveal.
  const color = useTransform(progress, range, ['#7c8098', '#f4f5fa'])

  return (
    <motion.span style={{ color }} className={cn('inline-block whitespace-pre', className)}>
      {children}
    </motion.span>
  )
}

type ScrollStatementProps = {
  text: string
  className?: string
  wordClassName?: string
}

/**
 * Reading-paced reveal: the passage brightens word by word in step with the
 * scroll, so a long paragraph is *scrolled through* rather than dumped on the
 * visitor. Falls back to plain, fully legible text under reduced motion.
 */
export function ScrollStatement({ text, className, wordClassName }: ScrollStatementProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.5'] })
  const words = text.split(' ')
  const total = words.length

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    )
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => {
        const start = index / total
        const end = Math.min(1, start + 1.6 / total)

        return (
          <Word
            key={`${word}-${index}`}
            progress={scrollYProgress}
            range={[start, end]}
            className={wordClassName}
          >
            {index < total - 1 ? `${word} ` : word}
          </Word>
        )
      })}
    </p>
  )
}
