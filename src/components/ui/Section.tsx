import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
  /** id of the heading that names this region. */
  labelledBy?: string
  /** Draws a soft gradient hairline along the top edge. */
  divider?: boolean
}

export function Section({ id, children, className, labelledBy, divider = false }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative py-20 sm:py-24 lg:py-32', divider && 'edge-top', className)}
    >
      {children}
    </section>
  )
}

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  id?: string
  className?: string
  titleClassName?: string
  leadClassName?: string
  /** Heading level. Pages that use this as their page title pass "h1". */
  as?: 'h1' | 'h2'
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  id,
  className,
  titleClassName,
  leadClassName,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <div className={cn('flex flex-col', centered ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow ? (
        <Reveal y={12} duration={0.6}>
          <span className="mb-5 inline-flex items-center gap-3">
            <span
              aria-hidden="true"
              className="anim-pulse-glow size-1.5 rounded-full bg-linear-to-r from-aura to-ice"
            />
            <span className="t-eyebrow">{eyebrow}</span>
          </span>
        </Reveal>
      ) : null}

      <Reveal y={22} className={cn(centered && 'flex justify-center')} amount={0.25}>
        <Heading id={id} className={cn('t-section', centered && 'max-w-4xl', titleClassName)}>
          {title}
        </Heading>
      </Reveal>

      {lead ? (
        <Reveal y={18} delay={0.08} className={cn('mt-6', centered && 'flex justify-center')}>
          <p className={cn('t-lead', centered ? 'max-w-2xl' : 'max-w-xl', leadClassName)}>{lead}</p>
        </Reveal>
      ) : null}
    </div>
  )
}
