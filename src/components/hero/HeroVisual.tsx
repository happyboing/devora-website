import { motion, useScroll, useTransform } from 'motion/react'

import { usePointerOffset } from '@/lib/usePointerOffset'

/**
 * Decorative frame for the hero.
 *
 * The copy sits in a single centred column, and this layer arranges the orbital
 * guides and capability labels around it. Everything is centred on the copy, so
 * the hero reads as one composition rather than a text column with an unrelated
 * graphic beside it.
 *
 * Moving the pointer drags the guides one way and the labels the other, which
 * gives the frame depth without touching the planet behind it. Purely
 * decorative, so the whole layer is hidden from assistive technology and never
 * intercepts a click.
 */
export function HeroVisual() {
  // Window-tracked: the layer itself is `pointer-events-none`.
  const { ref, x, y } = usePointerOffset<HTMLDivElement>({ global: true })

  // The frame belongs to the hero, so it lets go as the copy scrolls away
  // instead of hovering over the next section.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fadeOut = useTransform(scrollYProgress, [0.15, 0.9], [1, 0], { clamp: true })

  const guideX = useTransform(x, [-1, 1], [18, -18])
  const guideY = useTransform(y, [-1, 1], [14, -14])
  const labelX = useTransform(x, [-1, 1], [-26, 26])
  const labelY = useTransform(y, [-1, 1], [-16, 16])
  const guideTilt = useTransform(x, [-1, 1], [-2.5, 2.5])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ opacity: fadeOut }}
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {/* Orbit guides, centred on the copy. */}
      <motion.div
        style={{ x: guideX, y: guideY, rotate: guideTilt }}
        className="absolute left-1/2 top-1/2 aspect-square w-[min(90vw,64rem)] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
        <div className="anim-spin-slower absolute inset-0 rounded-full border border-dashed border-white/[0.06]" />
        <div
          className="absolute inset-[11%] rounded-full opacity-50"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(224,66,124,0.45) 80deg, transparent 170deg, rgba(94,214,255,0.4) 280deg, transparent 360deg)',
            mask: 'radial-gradient(circle, transparent 94%, #000 96%)',
            WebkitMask: 'radial-gradient(circle, transparent 94%, #000 96%)',
          }}
        />
      </motion.div>

      {/* Capability labels sit in the page margins so they never cross the copy. */}
      <motion.div style={{ x: labelX, y: labelY }} className="absolute inset-0">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <span className="anim-float glass inline-block rounded-full px-3.5 py-2 text-xs text-mist shadow-lg">
            Design
          </span>
        </span>

        <span className="absolute right-[1.5%] top-[30%] hidden xl:block">
          <span
            className="anim-float glass inline-block rounded-full px-3.5 py-2 text-xs text-mist shadow-lg"
            style={{ animationDelay: '-4.4s' }}
          >
            Human-Computer Interaction
          </span>
        </span>

        <span className="absolute right-[3%] top-[62%] hidden xl:block">
          <span
            className="anim-float glass inline-block rounded-full px-3.5 py-2 text-xs text-mist shadow-lg"
            style={{ animationDelay: '-2.6s' }}
          >
            Engineering
          </span>
        </span>

        <span className="absolute left-[3%] top-[34%] hidden xl:block">
          <span
            className="anim-float glass inline-block rounded-full px-3.5 py-2 text-xs text-mist shadow-lg"
            style={{ animationDelay: '-1.2s' }}
          >
            Interaction
          </span>
        </span>

        <span className="absolute left-[8%] top-[76%] hidden xl:block">
          <span
            className="anim-float glass inline-block rounded-full px-3.5 py-2 text-xs text-mist shadow-lg"
            style={{ animationDelay: '-3.6s' }}
          >
            UI / UX
          </span>
        </span>
      </motion.div>
    </motion.div>
  )
}
