import { House } from 'lucide-react'

import { identity } from '@/data/company'
import { ButtonRoute } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center pb-24 pt-20 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(120% 60% at 50% 0%, rgba(224,66,124,0.24), transparent 72%)',
        }}
      />
      <div className="shell relative">
        <span className="t-mono text-dusk">404</span>
        <h1 className="mt-4 font-display text-[clamp(2.8rem,8vw,5.6rem)] leading-[0.98] tracking-tight">
          <span className="grad-text">This page has gone off-grid</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl t-lead text-mist/90">
          The page you were looking for doesn't exist. Return to the {identity.name} home page to explore the full site.
        </p>
        <ButtonRoute to="/" className="mt-8" icon={House}>
          Back to Home
        </ButtonRoute>
      </div>
    </section>
  )
}
