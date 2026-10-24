import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type PillProps = {
  children: ReactNode
  className?: string
  /** Adds a small pulsing indicator dot on the left. */
  pulse?: boolean
}

/** Small capsule label used for eyebrows, tags and status chips. */
export function Pill({ children, className, pulse = false }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5',
        't-mono text-mist backdrop-blur-sm',
        className,
      )}
    >
      {pulse ? (
        <span className="relative flex size-1.5" aria-hidden="true">
          <span className="anim-pulse-glow absolute inline-flex size-full rounded-full bg-ice" />
          <span className="relative inline-flex size-1.5 rounded-full bg-ice" />
        </span>
      ) : null}
      {children}
    </span>
  )
}
