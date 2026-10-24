import { Link } from 'react-router-dom'
import { Mail, Sparkles } from 'lucide-react'

import { footerNav, targetHref } from '@/data/nav'
import { identity } from '@/data/company'
import { ButtonRoute } from '@/components/ui/Button'
import { LogoLockup } from '@/components/ui/Logo'
import { Parallax } from '@/components/ui/Parallax'
import { Reveal } from '@/components/ui/Reveal'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-8 overflow-hidden border-t border-white/10 pt-16 sm:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[52rem] -translate-x-1/2 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(closest-side, rgba(224,66,124,0.28), transparent 72%)',
        }}
      />

      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-10">
          <Reveal y={18}>
            <LogoLockup />
            <p className="t-body mt-6 max-w-sm">
              {identity.name} modernizes and redesigns outdated websites into functional, engaging
              and user-centered digital experiences.
            </p>
            <p className="mt-6 font-display text-lg tracking-tight text-frost">
              {identity.motto}
            </p>
          </Reveal>

          <Reveal y={18} delay={0.06}>
            <h2 className="t-mono text-dusk">Sitemap</h2>
            <ul className="mt-5 grid gap-2.5">
              {footerNav.map((target) => (
                <li key={target.label}>
                  <Link
                    to={targetHref(target)}
                    className="group inline-flex items-center gap-2 text-sm text-mist transition-colors duration-300 hover:text-frost"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-0 bg-ice transition-all duration-300 group-hover:w-3"
                    />
                    {target.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal y={18} delay={0.12}>
            <h2 className="t-mono text-dusk">Start a conversation</h2>
            <p className="t-body mt-5 max-w-xs">
              Tell us about your website and where you want it to go next.
            </p>
            <ButtonRoute to="/contact" size="lg" className="mt-6" icon={Sparkles}>
              Send an Inquiry
            </ButtonRoute>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Mail className="mt-0.5 size-4 shrink-0 text-ice" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-ash">
                <span className="text-mist">Contact details:</span> Devora has not published a
                public address, phone number or email address yet. Please use the{' '}
                <Link to="/contact" className="text-ice underline-offset-4 hover:underline">
                  inquiry form
                </Link>{' '}
                instead.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="hairline mt-14" />

        <div className="flex flex-col gap-4 py-8 text-xs text-dusk sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {identity.name}. An academic company website project.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{identity.tagline}</span>
            <span aria-hidden="true" className="hidden size-1 rounded-full bg-edge sm:inline-block" />
            <span>Built with React, Vite &amp; TypeScript</span>
          </p>
        </div>
      </div>

      {/* Oversized wordmark signing off the page, drifting as the footer arrives. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mt-2 select-none overflow-hidden [mask-image:linear-gradient(to_bottom,#000_45%,transparent_96%)]"
      >
        <Parallax distance={26} axis="y">
          <span className="block whitespace-nowrap text-center font-display text-[25vw] font-semibold uppercase leading-[0.72] tracking-[-0.06em] text-white/[0.035]">
            {identity.name}
          </span>
        </Parallax>
      </div>
    </footer>
  )
}
