import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'

import { history, milestones } from '@/data/company'
import { SECTIONS } from '@/lib/scroll'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { useSpotlight } from '@/lib/useSpotlight'
import { KineticText } from '@/components/ui/KineticText'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { TiltCard } from '@/components/ui/TiltCard'

/**
 * Company journey.
 *
 * The four phases ride a horizontal track that is pulled sideways in step with
 * the page scroll while the panel itself holds in place — so the section reads
 * as one continuous, scroll-driven story rather than a row of static cards.
 *
 * The hold is built from `position: sticky` plus a scroll-derived transform
 * (rather than a ScrollTrigger pin) because the routed page sits inside a
 * transformed wrapper, where `position: fixed` pinning is unreliable. Under
 * reduced motion the whole thing collapses to a plain vertical list.
 */
export function HistorySection() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const scrub = !reduced

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const x = useSpring(0, { stiffness: 120, damping: 28, mass: 0.4 })
  const tip = useTransform(progress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return
    const distance = Math.max(0, track.offsetWidth - container.clientWidth)
    x.set(-value * distance)
  })

  // Keep the offset correct when the viewport (and therefore card widths) change.
  useEffect(() => {
    if (!scrub) {
      x.set(0)
      return
    }

    const update = () => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return
      const distance = Math.max(0, track.offsetWidth - container.clientWidth)
      x.set(-scrollYProgress.get() * distance)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [scrub, scrollYProgress, x])

  return (
    <Section id={SECTIONS.history} labelledBy="history-heading" divider>
      <div className="shell">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-3">
            <span className="t-mono text-aura-soft">03</span>
            <span aria-hidden="true" className="h-px w-8 bg-white/15" />
            <span className="t-mono text-dusk">Company History &amp; Development</span>
          </div>
          <h2 id="history-heading" className="t-section max-w-4xl text-frost">
            <KineticText as="span" text={history.heading} />
          </h2>
          <p className="t-lead max-w-2xl">
            Our approach has evolved alongside technology, while our commitment to HCI, UI/UX and
            teamwork has stayed constant.
          </p>
        </div>

        {/* Manifesto strip */}
        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-3 lg:gap-12">
          {history.paragraphs.map((paragraph, index) => (
            <Reveal key={index} y={20} delay={index * 0.06}>
              <div className="flex flex-col gap-4">
                <span className="t-mono text-dusk">{`0${index + 1}`}</span>
                <p className="t-body text-mist/90">{paragraph}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ------------------------------ Timeline ------------------------------ */}
      <div ref={wrapRef} className={cn('relative mt-16', scrub && 'lg:h-[240vh]')}>
        <div
          className={cn(
            scrub && 'lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center',
          )}
        >
          <div className="shell-wide">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="t-mono text-dusk">Milestones</span>
                <p className="text-sm text-mist">
                  A visual reading of our journey — phases, not dated events.
                </p>
              </div>
              <p className="text-xs text-dusk lg:max-w-[22rem] lg:text-right">
                {scrub
                  ? 'Keep scrolling — the four phases travel across as you go.'
                  : 'Four phases of Devora\u2019s development.'}
              </p>
            </div>

            {/* Scrub progress, with a comet head on its leading edge. */}
            <div aria-hidden="true" className="relative mt-8 h-px w-full bg-white/10">
              <motion.span
                style={{ scaleX: progress }}
                className="block h-px w-full origin-left bg-linear-to-r from-aura to-ice"
              />
              <motion.span
                style={{ left: tip }}
                className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ice shadow-[0_0_12px_2px_rgba(94,214,255,0.55)]"
              />
            </div>

            <div
              ref={containerRef}
              className={cn('mt-8', scrub && 'lg:overflow-hidden')}
            >
              <motion.div
                ref={trackRef}
                style={scrub ? { x } : undefined}
                className={cn(
                  'flex flex-col gap-6',
                  scrub && 'lg:w-max lg:flex-row lg:gap-8',
                )}
              >
                {milestones.map((item, index) => (
                  <Reveal
                    key={item.phase}
                    y={24}
                    delay={index * 0.06}
                    className={cn('w-full', scrub && 'lg:w-[26rem] xl:w-[30rem]')}
                  >
                    <TiltCard max={3} className="h-full">
                      <MilestoneCard item={item} />
                    </TiltCard>
                  </Reveal>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function MilestoneCard({ item }: { item: (typeof milestones)[number] }) {
  const { ref, onPointerMove } = useSpotlight<HTMLElement>()

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className="panel panel-hover spotlight group relative h-full overflow-hidden p-7 sm:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-8 origin-top-right font-display text-[7rem] leading-none text-white/[0.04] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:text-white/[0.06]"
      >
        {item.phase.replace('Phase ', '')}
      </span>

      <div className="relative flex items-center gap-4">
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-white/12 bg-white/[0.04]">
          <span className="absolute inset-0 rounded-full border border-aura/0 transition-colors duration-700 group-hover:border-aura/40" />
          <span className="font-display text-sm text-frost">
            {item.phase.replace('Phase ', '')}
          </span>
        </span>
        <span className="t-mono text-dusk">{item.phase}</span>
      </div>

      <h3 className="relative mt-8 t-card text-frost">{item.title}</h3>
      <p className="t-body relative mt-3">{item.description}</p>

      <div
        aria-hidden="true"
        className="relative mt-8 flex items-center gap-2 text-ice opacity-70"
      >
        <span className="size-1.5 rounded-full bg-current" />
        <span className="h-px flex-1 bg-linear-to-r from-current to-transparent" />
        <span className="size-1.5 rounded-full border border-current opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </article>
  )
}
