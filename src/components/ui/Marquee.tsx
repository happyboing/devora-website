import { cn } from '@/lib/cn'

type MarqueeProps = {
  items: readonly string[]
  className?: string
  reverse?: boolean
  slow?: boolean
  /** Hint that the strip is decorative and can be hidden from assistive tech. */
  decorative?: boolean
}

/**
 * Seamless capability strip. Two identical copies of the list are laid out
 * side by side and the track is translated by exactly -50%, so the loop has no
 * visible seam. Duplicated content is hidden from assistive technology.
 */
export function Marquee({ items, className, reverse = false, slow = false, decorative = true }: MarqueeProps) {
  return (
    <div className={cn('marquee-pause relative flex overflow-hidden', className)}>
      <div
        className={cn('marquee', reverse && 'marquee-reverse', slow && 'marquee-slow')}
        aria-hidden={decorative ? 'true' : undefined}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? 'true' : undefined}>
            {items.map((item) => (
              <li
                key={`${copy}-${item}`}
                className="flex shrink-0 items-center gap-6 pr-6 sm:gap-9 sm:pr-9"
              >
                <span className="t-mono whitespace-nowrap text-ash transition-colors duration-300 hover:text-frost">
                  {item}
                </span>
                <span aria-hidden="true" className="size-1 rounded-full bg-aura/60" />
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Soft edge fades so the strip dissolves instead of hard-cutting. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-void to-transparent sm:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-void to-transparent sm:w-28"
      />
    </div>
  )
}
