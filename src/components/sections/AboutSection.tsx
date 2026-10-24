import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'

import csrPhoto from '@assets/GROUP PICTURE.jpg'
import { about, csr } from '@/data/company'
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

            {/* Corporate social responsibility: the team with the Project SOAP donations. */}
            <Parallax distance={40} className="mt-4">
              <TiltCard max={4}>
                <SpotlightCard className="panel panel-hover relative overflow-hidden p-4 sm:p-5">
                  <figure className="relative">
                    <div className="overflow-hidden rounded-xl border border-white/10">
                      <img
                        src={csrPhoto}
                        alt="The Devora team holding the hygiene supplies donated for Project SOAP 2026 at Mapúa Malayan Colleges Laguna."
                        loading="lazy"
                        decoding="async"
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                    <figcaption className="flex flex-col gap-2 px-1 pb-1 pt-5 sm:px-2">
                      <span className="t-mono text-aura-soft">{csr.label}</span>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-frost sm:text-xl">
                        {csr.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-mist">{csr.description}</p>
                    </figcaption>
                  </figure>
                </SpotlightCard>
              </TiltCard>
            </Parallax>
          </div>
        </div>
      </div>
    </Section>
  )
}
