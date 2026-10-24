import { motion, useScroll, useSpring, useTransform, useVelocity, type Variants } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { hero } from '@/data/company'
import { SECTIONS, sectionHref } from '@/lib/scroll'
import { useBooted } from '@/lib/useBooted'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { ButtonRoute } from '@/components/ui/Button'
import { KineticText } from '@/components/ui/KineticText'
import { Magnetic } from '@/components/ui/Magnetic'
import { HeroVisual } from './HeroVisual'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const fade: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const FOCUS = [
  { label: 'Modernization', detail: 'Redesign & rebuild' },
  { label: 'UI/UX & HCI', detail: 'User-centered' },
  { label: 'Full Stack', detail: 'Front to back' },
] as const

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const booted = useBooted()

  // The headline leans with the scroll velocity, then squares back up — the
  // page's own momentum made visible in the type.
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const skewRaw = useTransform(velocity, [-2200, 0, 2200], [-4.5, 0, 4.5], { clamp: true })
  const skewX = useSpring(skewRaw, { stiffness: 220, damping: 34, mass: 0.4 })

  // Nothing animates until the startup curtain starts to lift, so the reveal is
  // performed for the visitor rather than finished behind the splash.
  const play = reduced || booted

  return (
    <section
      id={SECTIONS.home}
      aria-labelledby="hero-heading"
      className="relative pt-6 sm:pt-10 lg:pt-14"
    >
      {/* Orbital frame + capability labels, centred on the copy. */}
      <HeroVisual />

      <div className="shell-wide relative">
        <motion.div
          variants={container}
          initial={reduced ? 'visible' : 'hidden'}
          animate={play ? 'visible' : 'hidden'}
          className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.div variants={fade} className="mb-7 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 backdrop-blur-sm">
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="anim-pulse-glow absolute inline-flex size-full rounded-full bg-ice" />
                <span className="relative inline-flex size-1.5 rounded-full bg-ice" />
              </span>
              <span className="t-mono text-mist">Website Modernization Studio</span>
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            aria-label={hero.headline}
            className="t-display text-[clamp(2.4rem,5vw,4.6rem)]"
            style={reduced ? undefined : { skewX }}
          >
            <KineticText
              as="span"
              text="Explore Your Aura."
              mode="chars"
              className="block text-frost"
              decorative
              immediate
              active={play}
            />
            <KineticText
              as="span"
              text="Create with Devora."
              mode="chars"
              className="block grad-text anim-shimmer"
              mask={false}
              decorative
              immediate
              active={play}
              delay={0.16}
            />
          </motion.h1>

          <motion.p variants={fade} className="t-hero-sub mt-7 max-w-xl">
            {hero.subheadline}
          </motion.p>

          <motion.p variants={fade} className="t-lead mt-5 max-w-xl">
            {hero.description}
          </motion.p>

          <motion.div variants={fade} className="mt-9 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Magnetic strength={0.22} className="w-full sm:w-auto">
              <ButtonRoute
                to="/contact"
                size="lg"
                icon={ArrowUpRight}
                className="w-full justify-center sm:w-auto"
                data-cursor-label="Start"
              >
                {hero.primaryCta}
              </ButtonRoute>
            </Magnetic>

            <ButtonRoute
              to={sectionHref(SECTIONS.about)}
              variant="ghost"
              size="lg"
              icon={ArrowDown}
              iconPosition="right"
              className="w-full justify-center sm:w-auto"
            >
              {hero.secondaryCta}
            </ButtonRoute>
          </motion.div>

          {/* Focus areas — capability descriptors, not performance claims. */}
          <motion.ul
            variants={fade}
            className="mt-12 grid w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-3 sm:divide-x sm:divide-white/10"
          >
            {FOCUS.map((item) => (
              <li
                key={item.label}
                className="group/focus relative isolate overflow-hidden border-b border-white/10 px-4 py-4 transition-colors duration-500 last:border-b-0 hover:bg-white/[0.03] sm:border-b-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-aura/70 via-aura/30 to-transparent transition-transform duration-500 ease-out group-hover/focus:scale-x-100 group-focus-within/focus:scale-x-100"
                />
                <p className="font-display text-sm tracking-tight text-frost">{item.label}</p>
                <p className="mt-1 text-xs text-dusk transition-colors duration-500 group-hover/focus:text-mist">
                  {item.detail}
                </p>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="shell-wide relative mt-14 hidden items-center justify-center gap-4 sm:flex">
        <span aria-hidden="true" className="h-px w-16 bg-linear-to-r from-transparent to-white/15" />
        <span className="relative h-10 w-px overflow-hidden bg-white/8" aria-hidden="true">
          <span className="anim-scroll-hint absolute inset-x-0 top-0 h-4 bg-linear-to-b from-transparent via-ice to-transparent" />
        </span>
        <span className="t-mono text-dusk">Scroll to explore</span>
        <span aria-hidden="true" className="h-px w-16 bg-linear-to-l from-transparent to-white/15" />
      </div>
    </section>
  )
}
