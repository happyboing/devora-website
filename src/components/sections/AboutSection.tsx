import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'

import { about } from '@/data/company'
import { SECTIONS } from '@/lib/scroll'
import { KineticText } from '@/components/ui/KineticText'
import { Parallax } from '@/components/ui/Parallax'
import { Reveal } from '@/components/ui/Reveal'
import { ScrollStatement } from '@/components/ui/ScrollStatement'
import { Section } from '@/components/ui/Section'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TiltCard } from '@/components/ui/TiltCard'

const FRAME = [
  { tint: 'bg-aura', label: 'HCI · UI · UX' },
  { tint: 'bg-ice', label: 'Modernization Pipeline' },
  { tint: 'bg-aura-soft', label: 'Design → Build → Evolve' },
] as const

export function AboutSection() {
  // A rail beside the reading column fills as the paragraphs are read, and the
  // light on its tip rides the same scroll position.
  const railRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 72%', 'end 58%'] })
  const rail = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: 0.4 })
  const tip = useTransform(rail, [0, 1], ['0%', '100%'])

  return (
    <Section id={SECTIONS.about} labelledBy="about-heading">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* ------------------------- Sticky identity column ------------------------- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3">
              <span className="t-mono text-aura-soft">01</span>
              <span aria-hidden="true" className="h-px w-8 bg-white/15" />
              <span className="t-mono text-dusk">About Devora</span>
            </div>

            <h2 id="about-heading" className="t-section mt-6 text-frost">
              <KineticText as="span" text={about.heading} />
            </h2>

            <p className="t-lead mt-6 max-w-md">
              Devora helps businesses thrive in a fast-evolving digital world — translating their
              goals into modern, high-performing websites.
            </p>

            <Reveal y={16} delay={0.12}>
              <ul className="mt-9 flex flex-col gap-3">
                {FRAME.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm text-mist">
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${item.tint}`} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* --------------------------- Reading column --------------------------- */}
          <div ref={railRef} className="relative flex flex-col gap-8 lg:pl-10">
            <div aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-px bg-white/10 lg:block">
              <motion.span
                style={{ scaleY: rail }}
                className="block h-full w-px origin-top bg-linear-to-b from-aura via-aura-soft to-ice"
              />
              <motion.span
                style={{ top: tip }}
                className="absolute -left-1 size-2 -translate-y-1/2 rounded-full bg-ice shadow-[0_0_14px_2px_rgba(94,214,255,0.55)]"
              />
            </div>

            {about.paragraphs.map((paragraph, index) => (
              <ScrollStatement
                key={index}
                text={paragraph}
                className="max-w-[44rem] font-display text-[clamp(1.15rem,1.7vw,1.55rem)] leading-[1.55] tracking-[-0.01em] text-frost"
              />
            ))}

            {/* Structural graphic: a layered prism, drifting against the scroll. */}
            <Parallax distance={40} className="mt-4">
              <TiltCard max={4}>
                <SpotlightCard className="panel panel-hover relative overflow-hidden p-6 sm:p-8 lg:min-h-[19rem]">
                  <div className="relative h-full min-h-[15rem]">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        backgroundImage:
                          'radial-gradient(120% 120% at 50% 0%, rgba(224,66,124,0.22), transparent 62%)',
                      }}
                    />
                    <div
                      className="absolute -left-10 top-6 size-[16rem] rounded-full opacity-60 blur-[60px]"
                      style={{ background: 'radial-gradient(circle, rgba(224,66,124,0.32), transparent 68%)' }}
                    />
                    <div
                      className="absolute -bottom-14 right-[-5rem] size-[20rem] rounded-full opacity-50 blur-[70px]"
                      style={{ background: 'radial-gradient(circle, rgba(94,214,255,0.24), transparent 68%)' }}
                    />

                    {/* Counter-rotating guides give the prism a little orbit of its own. */}
                    <div className="anim-spin-slower absolute left-1/2 top-1/2 size-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />
                    <div className="anim-spin-slow absolute left-1/2 top-1/2 size-[13rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-aura/20" />

                    <div
                      className="anim-float absolute left-1/2 top-1/2 size-[15rem] -translate-x-1/2 -translate-y-1/2 opacity-70"
                      style={{
                        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                        backgroundImage:
                          'conic-gradient(from 200deg, rgba(224,66,124,0.55), transparent 40%, rgba(94,214,255,0.38) 70%, transparent 100%)',
                      }}
                    />
                    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                      <span className="t-mono text-dusk">Framework</span>
                      <span className="text-sm text-mist">Design · Engineering · Human-Computer Interaction</span>
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </Parallax>
          </div>
        </div>
      </div>
    </Section>
  )
}
