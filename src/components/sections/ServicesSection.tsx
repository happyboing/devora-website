import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowUpRight,
  Blocks,
  Compass,
  Gauge,
  LayoutPanelTop,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { services, type OfferingIcon, type Offering } from '@/data/services'
import { SECTIONS } from '@/lib/scroll'
import { cn } from '@/lib/cn'
import { useSpotlight } from '@/lib/useSpotlight'
import { ButtonRoute } from '@/components/ui/Button'
import { KineticText } from '@/components/ui/KineticText'
import { Pill } from '@/components/ui/Pill'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TiltCard } from '@/components/ui/TiltCard'

const ICON_MAP: Record<OfferingIcon, typeof LayoutPanelTop> = {
  layout: LayoutPanelTop,
  compass: Compass,
  gauge: Gauge,
  blocks: Blocks,
  sparkles: Sparkles,
  shield: ShieldCheck,
}

const PIPELINE = [
  'Legacy → Audit',
  'Structure → IA',
  'UX → UI',
  'Build → Deploy',
  'Care → Evolve',
] as const

export function ServicesSection() {
  const [active, setActive] = useState(0)
  const current = services.offerings[active]

  return (
    <Section id={SECTIONS.services} labelledBy="services-heading" divider>
      <div className="shell">
        {/* Heading — editorial, offset from the centre line. */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="flex items-center gap-3 self-start">
            <span className="t-mono text-aura-soft">04</span>
            <span aria-hidden="true" className="h-px w-8 bg-white/15" />
            <span className="t-mono text-dusk">Products &amp; Services</span>
          </div>
          <div>
            <h2 id="services-heading" className="t-section text-frost">
              <KineticText as="span" text={services.heading} />
            </h2>
            <p className="t-lead mt-6 max-w-2xl">
              Website modernization and redesign is our main offering, with enhancements that keep
              what works and upgrade everything else.
            </p>
          </div>
        </div>

        {/* ----------------------------- Primary service ----------------------------- */}
        <Reveal y={26} className="mt-14">
          <SpotlightCard className="panel panel-hover overflow-hidden">
            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
              <div className="p-6 sm:p-8 lg:p-10">
                <Pill pulse>{services.primary.eyebrow}</Pill>
                <h3 className="mt-6 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-tight text-frost">
                  {services.primary.title}
                </h3>
                <p className="t-lead mt-6 max-w-2xl">{services.primary.description}</p>
                <div className="mt-9">
                  <ButtonRoute to="/contact" size="lg" icon={ArrowUpRight}>
                    {services.primary.cta}
                  </ButtonRoute>
                </div>
              </div>

              {/* Pipeline — a scan runs down the rail while each step reacts on hover. */}
              <div className="relative hidden flex-col justify-center gap-3 p-8 lg:flex">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'radial-gradient(140% 140% at 100% 0%, rgba(224,66,124,0.22), transparent 64%)',
                  }}
                />
                <div
                  aria-hidden="true"
                  className="anim-scan pointer-events-none absolute inset-y-10 left-2 w-px"
                />
                <div className="relative flex flex-col gap-3">
                  {PIPELINE.map((label, index) => (
                    <Reveal key={label} y={16} delay={index * 0.06}>
                      <div
                        className={cn(
                          'glass group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-500',
                          'hover:-translate-y-0.5 hover:border-aura/45',
                        )}
                      >
                        <span className="t-mono text-dusk transition-colors duration-500 group-hover:text-aura-soft">{`0${index + 1}`}</span>
                        <span className="h-px flex-1 bg-linear-to-r from-white/20 to-transparent" />
                        <span className="text-sm text-mist transition-colors duration-500 group-hover:text-frost">
                          {label}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* -------------------------------- Offerings -------------------------------- */}
        <div className="mt-16">
          <Reveal y={18}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="t-mono text-dusk">{services.offeringsHeading}</span>
              <span className="hidden text-xs text-dusk lg:block">Hover a line to preview it</span>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
            <ol className="border-t border-white/10">
              {services.offerings.map((item, index) => (
                <ServiceRow
                  key={item.index}
                  item={item}
                  index={index}
                  active={index === active}
                  onActivate={setActive}
                />
              ))}
            </ol>

            {/* Decorative live preview for pointer users. */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <TiltCard max={5}>
                  <div
                    aria-hidden="true"
                    className="panel relative grid aspect-square place-items-center overflow-hidden"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          'radial-gradient(120% 120% at 50% 0%, rgba(224,66,124,0.18), transparent 62%)',
                      }}
                    />
                    <div className="anim-spin-slower absolute inset-[9%] rounded-full border border-dashed border-white/10" />
                    <div className="anim-spin-slow absolute inset-[26%] rounded-full border border-aura/15" />
                    <div className="anim-breathe absolute inset-[34%] rounded-full bg-[radial-gradient(circle,rgba(224,66,124,0.28),transparent_68%)]" />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={current.index}
                        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -14, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex flex-col items-center gap-5 px-8 text-center"
                      >
                        <span className="text-outline font-display text-[7rem] leading-none opacity-50">
                          {current.index}
                        </span>
                        <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                          {(() => {
                            const Icon = ICON_MAP[current.icon]
                            return <Icon className="size-7 text-aura-soft" />
                          })()}
                        </span>
                        <p className="t-card text-frost">{current.title}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------- Conclusion + CTA ----------------------------- */}
        <Reveal y={20} className="mt-14">
          <SpotlightCard className="edge-top panel panel-hover flex flex-col items-center gap-5 overflow-hidden py-10 text-center sm:flex-row sm:justify-between sm:py-8 sm:text-left">
            <div className="px-6 sm:px-8 lg:px-10">
              <p className="t-lead max-w-2xl text-frost">{services.conclusion}</p>
            </div>
            <div className="px-6 sm:px-8 lg:px-10">
              <ButtonRoute to="/contact" size="lg" icon={ArrowUpRight}>
                {services.primary.cta}
              </ButtonRoute>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </Section>
  )
}

function ServiceRow({
  item,
  index,
  active,
  onActivate,
}: {
  item: Offering
  index: number
  active: boolean
  onActivate: (index: number) => void
}) {
  const { ref, onPointerMove } = useSpotlight<HTMLLIElement>()
  const Icon = ICON_MAP[item.icon]

  return (
    <li ref={ref} onPointerMove={onPointerMove} className="border-b border-white/10">
      <div
        onMouseEnter={() => onActivate(index)}
        className="spotlight group relative isolate grid grid-cols-[auto_1fr_auto] items-start gap-5 py-7 sm:gap-8"
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-0 left-0 w-px origin-top bg-linear-to-b from-aura to-ice transition-transform duration-500 ease-out',
            active ? 'scale-y-100' : 'scale-y-0',
          )}
        />

        <span
          className={cn(
            't-mono pt-1 transition-all duration-500',
            active
              ? 'translate-x-1 text-aura-soft'
              : 'text-dusk group-hover:translate-x-1 group-hover:text-aura-soft',
          )}
        >
          {item.index}
        </span>

        <div>
          <h4
            className={cn(
              't-card transition-all duration-500',
              active
                ? 'translate-x-1 text-frost'
                : 'text-mist group-hover:translate-x-1 group-hover:text-frost',
            )}
          >
            {item.title}
          </h4>
          <p className="t-body mt-3 max-w-2xl">{item.description}</p>
        </div>

        <span
          aria-hidden="true"
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-2xl border transition-all duration-500',
            active
              ? 'rotate-6 border-aura/45 bg-aura/10 text-aura-soft'
              : 'border-white/10 bg-white/[0.04] text-ice group-hover:-rotate-6',
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </li>
  )
}
