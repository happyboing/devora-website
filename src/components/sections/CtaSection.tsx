import { motion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

import { identity } from '@/data/company'
import { usePointerOffset } from '@/lib/usePointerOffset'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { ButtonRoute } from '@/components/ui/Button'
import { KineticText } from '@/components/ui/KineticText'
import { Magnetic } from '@/components/ui/Magnetic'

export function CtaSection() {
  const reduced = usePrefersReducedMotion()
  const { ref, x, y, handlers } = usePointerOffset<HTMLElement>()

  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const skewRaw = useTransform(velocity, [-2200, 0, 2200], [-5, 0, 5], { clamp: true })
  const skewX = useSpring(skewRaw, { stiffness: 220, damping: 34, mass: 0.4 })

  const ringX = useTransform(x, [-1, 1], [-26, 26])
  const ringY = useTransform(y, [-1, 1], [-18, 18])
  const ringTilt = useTransform(x, [-1, 1], [-3, 3])

  return (
    <section
      ref={ref}
      {...handlers}
      className="relative mt-6 overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(120% 60% at 50% 50%, rgba(224,66,124,0.24), transparent 72%)',
        }}
      />

      {/* Orbital rings that lean with the pointer and turn on their own. */}
      <motion.div
        aria-hidden="true"
        style={{ x: ringX, y: ringY, rotate: ringTilt }}
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(110vw,62rem)] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="anim-spin-slower absolute inset-0 rounded-full border border-dashed border-white/[0.07]" />
        <div className="anim-spin-slow absolute inset-[13%] rounded-full border border-aura/10" />
        <div className="absolute inset-[27%] rounded-full border border-ice/10" />
      </motion.div>

      <div className="shell relative text-center">
        <p className="t-mono text-dusk">Ready to modernize?</p>

        <motion.h2
          style={reduced ? undefined : { skewX }}
          className="mt-5 font-display text-[clamp(2.4rem,7vw,4.8rem)] leading-[1.02] tracking-tight"
        >
          <KineticText
            as="span"
            text={identity.motto}
            mode="words"
            stagger={0.07}
            mask={false}
            className="grad-text anim-shimmer"
          />
        </motion.h2>

        <p className="t-lead mx-auto mt-6 max-w-2xl">
          Have an outdated website or an idea that deserves a better digital experience? Let&apos;s
          explore how Devora can help transform it.
        </p>

        <div className="mt-9 flex justify-center">
          <Magnetic strength={0.24}>
            <ButtonRoute to="/contact" size="lg" icon={ArrowUpRight} data-cursor-label="Start">
              Start a Project
            </ButtonRoute>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
