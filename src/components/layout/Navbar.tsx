import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'

import { companyNav, ctaNav, primaryNav, targetHref, type NavTarget } from '@/data/nav'
import { cn } from '@/lib/cn'
import { HOME_SECTION_IDS } from '@/lib/scroll'
import { useActiveSection } from '@/lib/useActiveSection'
import { ButtonRoute } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { Magnetic } from '@/components/ui/Magnetic'

const NAV_LINK_BASE =
  'relative inline-flex items-center rounded-full px-3 py-2 text-[0.875rem] font-medium text-mist transition-colors duration-300 hover:text-frost focus-visible:text-frost'

/** Understated pill that marks the currently visible section / route. */
function ActivePill() {
  return (
    <motion.span
      layoutId="nav-active-pill"
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.07]"
      aria-hidden="true"
    />
  )
}

function sectionIsActive(target: NavTarget, activeSection: string | null): boolean {
  return Boolean(target.section && target.section === activeSection)
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const activeSection = useActiveSection(HOME_SECTION_IDS, location.pathname === '/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  // Lock body scroll and support Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const isContact = location.pathname === '/contact'

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-frost focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'py-2.5' : 'py-4',
        )}
      >
        <div className="shell-wide">
          <nav
            aria-label="Primary"
            className={cn(
              'flex items-center justify-between gap-4 rounded-full border px-3 py-2 transition-all duration-500 sm:px-4',
              scrolled
                ? 'glass border-white/10 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.95)]'
                : 'border-transparent bg-transparent',
            )}
          >
            <Link
              to="/"
              className="group flex shrink-0 items-center rounded-full px-1 py-1"
              aria-label="Devora — home"
            >
              <Logo className="w-[104px] transition-opacity duration-300 group-hover:opacity-85 sm:w-[124px]" />
            </Link>

            {/* Desktop navigation */}
            <ul className="hidden items-center gap-1 lg:flex">
              {/* `CompanyDropdown` renders its own <li>, so it must not be wrapped in another one. */}
              <CompanyDropdown active={location.pathname === '/team' || isSectionActive(activeSection, companyNav)} />
              {primaryNav.map((target) =>
                target.section ? (
                  <li key={target.label}>
                    <Link
                      to={targetHref(target)}
                      className={cn(NAV_LINK_BASE, sectionIsActive(target, activeSection) && 'text-frost')}
                      aria-current={sectionIsActive(target, activeSection) ? 'true' : undefined}
                    >
                      {sectionIsActive(target, activeSection) ? <ActivePill /> : null}
                      {target.label}
                    </Link>
                  </li>
                ) : (
                  <li key={target.label}>
                    <NavLink
                      to={target.to}
                      className={({ isActive }) => cn(NAV_LINK_BASE, isActive && 'text-frost')}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive ? <ActivePill /> : null}
                          {target.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block">
                <Magnetic>
                  <ButtonRoute to={ctaNav.to} size="md" aria-current={isContact ? 'page' : undefined}>
                    {ctaNav.label}
                  </ButtonRoute>
                </Magnetic>
              </span>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="glass grid size-11 place-items-center rounded-full text-frost transition-colors duration-300 hover:border-ice/40 lg:hidden"
              >
                <MenuGlyph open={menuOpen} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeSection={activeSection} />
    </>
  )
}

function isSectionActive(activeSection: string | null, targets: NavTarget[]): boolean {
  return targets.some((target) => target.section === activeSection)
}

/** Simple two-bar glyph that morphs into a close icon. */
function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-3 w-4">
      <span
        className={cn(
          'absolute left-0 block h-[1.5px] w-4 rounded-full bg-current transition-all duration-300',
          open ? 'top-1/2 rotate-45' : 'top-0.5',
        )}
      />
      <span
        className={cn(
          'absolute left-0 block h-[1.5px] w-4 rounded-full bg-current transition-all duration-300',
          open ? 'top-1/2 -rotate-45' : 'top-[0.6rem]',
        )}
      />
    </span>
  )
}

/**
 * Accessible disclosure for the grouped company links.
 * Opens on hover for pointers and on focus/click for keyboard users, and
 * `visibility` (rather than opacity alone) keeps the links out of the tab
 * order while it is closed.
 */
function CompanyDropdown({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLLIElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <li
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(NAV_LINK_BASE, 'gap-1.5', (open || active) && 'text-frost')}
      >
        {active && !open ? <ActivePill /> : null}
        <span>Company</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={cn('size-3 transition-transform duration-300', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>

      <div
        id={panelId}
        className={cn(
          'absolute left-1/2 top-[calc(100%+0.75rem)] w-64 -translate-x-1/2 transition-all duration-300',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
        )}
      >
        <div className="glass overflow-hidden rounded-2xl p-2 shadow-[0_30px_70px_-40px_rgba(0,0,0,1)]">
          <ul className="flex flex-col">
            {companyNav.map((target) => (
              <li key={target.label}>
                <Link
                  to={targetHref(target)}
                  className="group flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm text-mist transition-colors duration-300 hover:bg-white/[0.06] hover:text-frost"
                  onClick={() => setOpen(false)}
                >
                  <span>{target.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-dusk transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ice"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}

function MobileMenu({
  open,
  onClose,
  activeSection,
}: {
  open: boolean
  onClose: () => void
  activeSection: string | null
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Move focus into the panel when it opens so keyboard users are not left behind.
  useEffect(() => {
    if (!open) return
    const first = panelRef.current?.querySelector<HTMLElement>('a, button')
    first?.focus({ preventScroll: true })
  }, [open])

  return (
    // `inert` keeps the closed menu's links out of the tab order and the
    // accessibility tree, so an aria-hidden panel never hides focusable items.
    <div
      id="mobile-menu"
      ref={panelRef}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        'fixed inset-0 z-40 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-void/85 backdrop-blur-xl transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'absolute inset-x-3 top-[4.75rem] overflow-hidden rounded-3xl border border-white/10 bg-charcoal/95 p-4 transition-all duration-500 ease-out',
          open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
        )}
      >
        <nav aria-label="Mobile" className="max-h-[70vh] overflow-y-auto">
          <p className="t-mono px-3 pb-2 pt-1 text-dusk">Company</p>
          <ul className="flex flex-col">
            {companyNav.map((target) => (
              <li key={target.label}>
                <MobileLink target={target} onSelect={onClose} active={sectionIsActive(target, activeSection)} />
              </li>
            ))}
          </ul>

          <div className="hairline my-4" />

          <p className="t-mono px-3 pb-2 text-dusk">Explore</p>
          <ul className="flex flex-col">
            {primaryNav.map((target) => (
              <li key={target.label}>
                <MobileLink target={target} onSelect={onClose} active={sectionIsActive(target, activeSection)} />
              </li>
            ))}
            <li>
              <MobileLink
                target={ctaNav}
                onSelect={onClose}
                active={false}
                hint="Project inquiry"
              />
            </li>
          </ul>
        </nav>

        <div className="mt-4">
          <ButtonRoute to={ctaNav.to} size="lg" className="w-full" onClick={onClose}>
            Start a Project
          </ButtonRoute>
        </div>
      </div>
    </div>
  )
}

function MobileLink({
  target,
  onSelect,
  active,
  hint,
}: {
  target: NavTarget
  onSelect: () => void
  active: boolean
  hint?: string
}): ReactNode {
  return (
    <Link
      to={targetHref(target)}
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-base transition-colors duration-300 hover:bg-white/[0.05]',
        active ? 'text-frost' : 'text-mist',
      )}
    >
      <span>{target.label}</span>
      {hint ? <span className="t-mono text-dusk">{hint}</span> : null}
      {active ? <span aria-hidden="true" className="size-1.5 rounded-full bg-ice" /> : null}
    </Link>
  )
}
