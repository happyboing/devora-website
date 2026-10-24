import { Fragment, type ElementType } from 'react'
import { motion, type Variants } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type KineticTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'

type KineticTextProps = {
  text: string
  as?: KineticTag
  className?: string
  /** `words` is calmer; `chars` gives an oversized display line real bite. */
  mode?: 'words' | 'chars'
  stagger?: number
  delay?: number
  once?: boolean
  amount?: number
  /** Play on mount instead of waiting for the element to scroll into view. */
  immediate?: boolean
  /** Hide from assistive tech — use when a parent already carries the label. */
  decorative?: boolean
  /** When false the tokens stay parked, so an outer gate can time the reveal. */
  active?: boolean
  /**
   * `true` (default) lifts each word from behind a clipping edge — the sharpest
   * look, but it puts the glyphs inside an overflow box, which blocks
   * `background-clip: text`. Set `false` for gradient headings: the reveal
   * becomes a soft blur-and-rise and the gradient paints one continuous sweep
   * across the whole line.
   */
  mask?: boolean
  variants?: Variants
}

const TAGS: Record<KineticTag, ElementType> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/** The token rises out from behind an overflow mask. */
const rise: Variants = {
  hidden: { y: '118%' },
  visible: { y: '0%', transition: { duration: 0.92, ease: [0.16, 1, 0.3, 1] } },
}

/** Mask-free reveal: resolves out of a blur, used where a gradient must span the line. */
const liftBlur: Variants = {
  hidden: { opacity: 0, y: '0.45em', filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
}

type Token = { key: string; glyph: string }

/**
 * Words are kept as groups so a word can never be split across lines: each
 * group is `white-space: nowrap`, and the (unanimated) space between groups is
 * a real text node, which is what gives the line its wrap opportunities.
 */
type Group = { key: string; space: boolean; tokens: Token[] }

function groupify(text: string, mode: 'words' | 'chars'): Group[] {
  const words = text.split(' ')

  return words.map((word, wordIndex) => ({
    key: `${wordIndex}`,
    space: wordIndex < words.length - 1,
    tokens:
      mode === 'chars'
        ? Array.from(word).map((glyph, charIndex) => ({ key: `${wordIndex}-${charIndex}`, glyph }))
        : [{ key: `${wordIndex}-0`, glyph: word }],
  }))
}

/**
 * Masked kinetic type. Each word (or character) rises from behind a clipping
 * edge on a staggered beat, so headings assemble rather than simply fade.
 *
 * The mask is a `pb / -mb` pair rather than an overflow box on the whole line,
 * which keeps descenders and tight display leading from ever being cut.
 */
export function KineticText({
  text,
  as: Tag = 'h2',
  className,
  mode = 'words',
  stagger,
  delay = 0,
  once = true,
  amount = 0.45,
  immediate = false,
  decorative = false,
  active = true,
  mask = true,
  variants,
}: KineticTextProps) {
  const reduced = usePrefersReducedMotion()
  const MotionTag = TAGS[Tag]

  if (reduced) {
    return (
      <Tag className={className} aria-hidden={decorative ? 'true' : undefined}>
        {text}
      </Tag>
    )
  }

  const step = stagger ?? (mode === 'chars' ? 0.028 : 0.06)
  const groups = groupify(text, mode)
  const tokenVariants = variants ?? (mask ? rise : liftBlur)

  // Headings can carry an `aria-label`, so the tokens are hidden and the whole
  // line is announced as one name. A generic <span>/<p> may not use `aria-label`
  // (prohibited ARIA), so its real text stays exposed and reads naturally.
  const isHeading = Tag === 'h1' || Tag === 'h2' || Tag === 'h3' || Tag === 'h4'
  const hideTokens = decorative || isHeading

  const play = immediate
    ? { animate: active ? ('visible' as const) : ('hidden' as const) }
    : active
      ? { whileInView: 'visible' as const, viewport: { once, amount } }
      : { animate: 'hidden' as const }

  const maskClass = 'inline-block overflow-hidden pb-[0.14em] align-bottom [margin-bottom:-0.14em]'

  return (
    <MotionTag
      className={cn(className)}
      aria-label={!decorative && isHeading ? text : undefined}
      aria-hidden={decorative ? 'true' : undefined}
      variants={container(step, delay)}
      initial="hidden"
      {...play}
    >
      {groups.map((group) => (
        <Fragment key={group.key}>
          <span className="inline-block whitespace-nowrap">
            {group.tokens.map((token) =>
              mask ? (
                <span key={token.key} aria-hidden={hideTokens ? 'true' : undefined} className={maskClass}>
                  <motion.span variants={tokenVariants} className="inline-block whitespace-pre">
                    {token.glyph}
                  </motion.span>
                </span>
              ) : (
                <motion.span
                  key={token.key}
                  aria-hidden={hideTokens ? 'true' : undefined}
                  variants={tokenVariants}
                  className="inline-block whitespace-pre"
                >
                  {token.glyph}
                </motion.span>
              ),
            )}
          </span>
          {group.space ? ' ' : null}
        </Fragment>
      ))}
    </MotionTag>
  )
}
