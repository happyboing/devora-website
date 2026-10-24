import type { ElementType } from 'react'
import { motion, type Variants } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type TextRevealTag = 'h1' | 'h2' | 'h3' | 'p' | 'span'

type TextRevealProps = {
  text: string
  className?: string
  as?: TextRevealTag
  delay?: number
  stagger?: number
}

/** Motion components are resolved through a record to keep the JSX call site simple. */
const TAGS: Record<TextRevealTag, ElementType> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/**
 * Words rise and resolve out of a blur. Deliberately avoids an overflow mask so
 * descenders and tight line-heights can never clip, and the whole heading stays
 * on one accessible label instead of being read out fragment by fragment.
 */
const word: Variants = {
  hidden: { opacity: 0, y: '0.45em', filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
}

export function TextReveal({
  text,
  className,
  as: Tag = 'h2',
  delay = 0,
  stagger = 0.05,
}: TextRevealProps) {
  const reduced = usePrefersReducedMotion()
  const MotionTag = TAGS[Tag]
  const words = text.split(' ')

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <MotionTag
      className={cn('inline-block', className)}
      aria-label={text}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {words.map((current, index) => (
        <motion.span key={`${current}-${index}`} variants={word} className="inline-block whitespace-pre">
          {index < words.length - 1 ? `${current} ` : current}
        </motion.span>
      ))}
    </MotionTag>
  )
}
