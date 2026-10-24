import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'

import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type KineticBandProps = {
  items: readonly string[]
  className?: string
  /** Peak sideways travel, in pixels, as the band crosses the viewport. */
  travel?: number
}

/**
 * Oversized capability ticker.
 *
 * Two rows crawl in opposite directions on their own clock, so the band is
 * never completely still. On top of that the whole strip is pulled sideways in
 * step with the page scroll and skews with the scroll *velocity* — flick the
 * page and it leans, settle and it squares back up. Hovering holds both rows
 * still so a keyword can actually be read.
 *
 * Under reduced motion it collapses to one static, readable line.
 */
export function KineticBand({ items, className, travel = 90 }: KineticBandProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)

  const x = useTransform(scrollYProgress, [0, 1], [travel, -travel])
  const skewRaw = useTransform(velocity, [-2400, 0, 2400], [-7, 0, 7], { clamp: true })
  const skewX = useSpring(skewRaw, { stiffness: 220, damping: 34, mass: 0.4 })

  if (reduced) {
    return (
      <div className={cn('overflow-hidden', className)}>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 py-6">
          {items.map((item) => (
            <span key={item} className="font-display text-[clamp(1.4rem,3.4vw,2.6rem)] tracking-tight text-mist/40">
              {item}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // `.marquee` loops on a -50% translate, so each row is exactly two copies of
  // the same unit — one unit being long enough to overhang the viewport.
  const unit = [...items, ...items]
  const track = [...unit, ...unit]

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('marquee-pause overflow-hidden py-6', className)}
    >
      <motion.div style={{ x, skewX }} className="w-max will-change-transform">
        <div className="marquee marquee-slow">
          {track.map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center">
              <span className="font-display text-[clamp(1.5rem,3.9vw,2.9rem)] leading-none tracking-tight text-frost/85">
                {item}
              </span>
              <span className="mx-6 inline-block size-2.5 rotate-45 bg-linear-to-br from-aura to-ice sm:mx-10" />
            </span>
          ))}
        </div>

        <div className="marquee marquee-slow marquee-reverse mt-4">
          {track.map((item, index) => (
            <span key={`${item}-outline-${index}`} className="flex items-center">
              <span className="font-display text-[clamp(0.72rem,1.2vw,0.95rem)] uppercase tracking-[0.22em] text-mist/25">
                {item}
              </span>
              <span className="mx-5 inline-block size-1 rounded-full bg-white/20 sm:mx-8" />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
