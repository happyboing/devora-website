import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'

import { mission, values, vision, identity, type ValueId } from '@/data/company'
import { SECTIONS } from '@/lib/scroll'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { KineticText } from '@/components/ui/KineticText'
import { Pill } from '@/components/ui/Pill'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TiltCard } from '@/components/ui/TiltCard'

export function IdentitySection() {
  const [open, setOpen] = useState<ValueId | null>(values[0]?.id ?? null)
  const reduced = usePrefersReducedMotion()

  return (
    <Section id={SECTIONS.identity} labelledBy="identity-heading" divider>
      <div className="shell">
        {/* Heading — offset to the right to break the site's centred rhythm. */}
        <div className="flex flex-col gap-5 lg:items-end lg:text-right">
          <div className="flex items-center gap-3">
            <span className="t-mono text-aura-soft">02</span>
            <span aria-hidden="true" className="h-px w-8 bg-white/15" />
            <span className="t-mono text-dusk">Vision · Mission · Values · Motto</span>
          </div>
          <h2 id="identity-heading" className="t-section max-w-3xl text-frost">
            <KineticText as="span" text="A clear purpose behind every build." />
          </h2>
          <p className="t-lead max-w-2xl">
            Devora keeps its focus on usability, function and innovation — the pillars that let each
            website carry its business&apos; identity with clarity.
          </p>
        </div>

        {/* ----------------------------- Vision & Mission ----------------------------- */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal y={26}>
            <TiltCard max={5} className="h-full">
              <SpotlightCard className="panel panel-hover relative h-full overflow-hidden p-6 sm:p-8 lg:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -top-10 font-display text-[9rem] leading-none text-white/[0.03]"
                >
                  01
                </span>
                <Pill className="mb-6">{vision.label}</Pill>
                <p className="t-lead relative text-frost">{vision.text}</p>
              </SpotlightCard>
            </TiltCard>
          </Reveal>

          <Reveal y={26} delay={0.08}>
            <TiltCard max={5} className="h-full">
              <SpotlightCard className="panel panel-hover relative h-full overflow-hidden p-6 sm:p-8 lg:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -top-10 font-display text-[9rem] leading-none text-white/[0.03]"
                >
                  02
                </span>
                <Pill className="mb-6">{mission.label}</Pill>
                <p className="t-lead relative text-frost">{mission.text}</p>
              </SpotlightCard>
            </TiltCard>
          </Reveal>
        </div>

        {/* ------------------------------- Values index ------------------------------- */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal y={20} className="lg:sticky lg:top-28 lg:self-start">
            <span className="t-mono text-dusk">What we stand for</span>
            <p className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.15] tracking-tight text-frost">
              Five values, held to on every project.
            </p>
            <div className="mt-6 h-px w-full bg-linear-to-r from-aura/60 via-ice/40 to-transparent" />
            <p className="mt-6 max-w-sm text-sm text-dusk">
              Open a value to read how it shapes the work.
            </p>
          </Reveal>

          <ul className="border-t border-white/10">
            {values.map((value, index) => {
              const isOpen = open === value.id
              return (
                <motion.li
                  key={value.id}
                  initial={reduced ? false : { opacity: 0, x: 26 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/10"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`value-panel-${value.id}`}
                    onClick={() => setOpen(isOpen ? null : value.id)}
                    onMouseEnter={() => setOpen(value.id)}
                    onFocus={() => setOpen(value.id)}
                    className="group relative isolate flex w-full items-center justify-between gap-6 overflow-hidden py-6 text-left"
                  >
                    {/* Aura sweep marks the row being read. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-y-0 -left-4 right-0 -z-10 origin-left bg-linear-to-r from-aura/[0.16] via-aura/[0.05] to-transparent transition-transform duration-500 ease-out',
                        isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />

                    <span className="flex items-baseline gap-5 sm:gap-8">
                      <span
                        className={cn(
                          't-mono transition-all duration-500',
                          isOpen
                            ? 'text-aura-soft'
                            : 'text-dusk group-hover:translate-x-1 group-hover:text-aura-soft',
                        )}
                      >
                        {value.index}
                      </span>
                      <span
                        className={cn(
                          't-card transition-all duration-500',
                          isOpen
                            ? 'translate-x-1 text-frost'
                            : 'text-mist group-hover:translate-x-1 group-hover:text-frost',
                        )}
                      >
                        {value.title}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500',
                        isOpen
                          ? 'border-aura/50 bg-aura/15 text-aura-soft'
                          : 'border-white/12 text-mist group-hover:rotate-90 group-hover:border-white/25',
                      )}
                    >
                      <Plus
                        className={cn(
                          'size-4 transition-transform duration-500 ease-out',
                          isOpen && 'rotate-[135deg]',
                        )}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="panel"
                        id={`value-panel-${value.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="t-body max-w-2xl pb-7 sm:pl-[3.9rem]">{value.description}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* --------------------------------- Motto --------------------------------- */}
        <Reveal y={22} className="mt-16">
          <div className="edge-top relative overflow-hidden py-12 text-center sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                backgroundImage:
                  'radial-gradient(120% 60% at 50% 0%, rgba(224,66,124,0.24), transparent 70%)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="anim-spin-slower aspect-square w-[min(92vw,42rem)] rounded-full border border-dashed border-white/[0.07]" />
              <div className="anim-spin-slow absolute inset-[16%] rounded-full border border-ice/10" />
            </div>

            <div className="relative">
              <span className="t-mono text-dusk">Our Motto</span>
              <p className="mt-5 font-display text-[clamp(2.2rem,6.2vw,4.8rem)] leading-[0.98] tracking-tight">
                <KineticText
                  as="span"
                  text={identity.motto}
                  mode="words"
                  stagger={0.08}
                  mask={false}
                  className="grad-text anim-shimmer"
                />
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
