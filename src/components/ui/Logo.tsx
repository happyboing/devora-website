import logoDark from '@assets/devoralogo2.png'
import logoLight from '@assets/devoralogo1.png'

import { cn } from '@/lib/cn'

type LogoProps = {
  /** `light` = silver wordmark for dark surfaces, `dark` = black wordmark for light surfaces. */
  variant?: 'light' | 'dark'
  className?: string
  /** Set when the logo sits inside a link that already carries the accessible name. */
  decorative?: boolean
  label?: string
}

/**
 * Renders the supplied Devora logo at its true aspect ratio.
 *
 * The source files are square 3000x3000 canvases with the wordmark occupying a
 * 2883x702 band, so `.brand-mark` crops that transparent padding optically.
 * The original artwork is never redrawn, recoloured or stretched — only the
 * empty margin around it is trimmed by CSS.
 */
export function Logo({ variant = 'light', className, decorative = false, label = 'Devora' }: LogoProps) {
  return (
    <span className={cn('brand-mark', className)}>
      <img
        src={variant === 'light' ? logoLight : logoDark}
        alt={decorative ? '' : label}
        width={3000}
        height={3000}
        decoding="async"
        draggable={false}
      />
    </span>
  )
}

/** Logo lockup paired with the studio descriptor, used in the footer. */
export function LogoLockup({ variant = 'light', className }: { variant?: 'light' | 'dark'; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Logo variant={variant} className="w-[128px] sm:w-[142px]" />
      <span aria-hidden="true" className="rule-v h-6" />
      <span className="t-mono hidden text-ash sm:inline">Modernization &amp; Redesign</span>
    </div>
  )
}
