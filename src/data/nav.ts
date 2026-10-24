import { sectionHref, type SectionId } from '@/lib/scroll'

export type NavTarget = {
  label: string
  to: string
  section?: SectionId
}

/** Resolves a nav entry to a real, shareable href. */
export function targetHref(target: NavTarget): string {
  return target.section ? sectionHref(target.section) : target.to
}

/** Grouped "Company" dropdown: the company story and the team in one place. */
export const companyNav: NavTarget[] = [
  { label: 'About Us', to: '/', section: 'about' },
  { label: 'Vision & Values', to: '/', section: 'identity' },
  { label: 'Our Journey', to: '/', section: 'history' },
  { label: 'Organizational Chart', to: '/team' },
]

/** Flat links shown beside the dropdown. */
export const primaryNav: NavTarget[] = [
  { label: 'Services', to: '/', section: 'services' },
  { label: 'Careers', to: '/careers' },
]

export const ctaNav: NavTarget = { label: "Let's Talk", to: '/contact' }

/** Full sitemap used by the footer. */
export const footerNav: NavTarget[] = [
  { label: 'Home', to: '/' },
  ...companyNav,
  { label: 'Products & Services', to: '/', section: 'services' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact Us', to: '/contact' },
]
