import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { useSpotlight } from '@/lib/useSpotlight'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
}

/**
 * Card whose background brightens toward the pointer. Purely decorative —
 * the highlight is driven by CSS custom properties, so it costs no re-renders.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>()

  return (
    <div ref={ref} className={cn('spotlight', className)} onPointerMove={onPointerMove}>
      {children}
    </div>
  )
}
