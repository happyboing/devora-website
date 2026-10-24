import { Hero } from '@/components/hero/Hero'
import { AboutSection } from '@/components/sections/AboutSection'
import { CtaSection } from '@/components/sections/CtaSection'
import { HistorySection } from '@/components/sections/HistorySection'
import { IdentitySection } from '@/components/sections/IdentitySection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { KineticBand } from '@/components/ui/KineticBand'
import { capabilities } from '@/data/services'

export function HomePage() {
  return (
    <>
      <Hero />
      <KineticBand items={capabilities} className="mt-10 border-y border-white/[0.08]" />
      <AboutSection />
      <IdentitySection />
      <HistorySection />
      <ServicesSection />
      <CtaSection />
    </>
  )
}
