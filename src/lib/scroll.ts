/** Anchor ids for the sections that live on the home page. */
export const SECTIONS = {
  home: 'home',
  about: 'about',
  identity: 'identity',
  history: 'history',
  services: 'services',
} as const

export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS]

/** Ids in document order — used for the active-section indicator. */
export const HOME_SECTION_IDS: readonly SectionId[] = [
  SECTIONS.home,
  SECTIONS.about,
  SECTIONS.identity,
  SECTIONS.history,
  SECTIONS.services,
]

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Scrolls to an in-page section and hands focus to its heading so keyboard and
 * screen-reader users land in the right place. Returns false when the section
 * is not currently mounted.
 */
export function scrollToSection(id: string): boolean {
  const section = document.getElementById(id)
  if (!section) return false

  section.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })

  const heading = section.querySelector<HTMLElement>('h1, h2, h3')
  if (heading) {
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
  }

  return true
}

/**
 * Deep-linkable URL for a home-page section. Using a query parameter means the
 * address bar reflects the current section, refresh keeps you there, and the
 * navigation still renders a genuine `href` rather than a dead link.
 */
export function sectionHref(id: string): string {
  return `/?s=${id}`
}
