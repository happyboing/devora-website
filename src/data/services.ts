export type OfferingIcon =
  | 'layout'
  | 'compass'
  | 'gauge'
  | 'blocks'
  | 'sparkles'
  | 'shield'

export type Offering = {
  index: string
  icon: OfferingIcon
  title: string
  description: string
}

export const services = {
  heading: 'Digital Solutions, Reimagined.',
  primary: {
    eyebrow: 'Primary Service',
    title: 'Website Modernization & Redesign',
    description:
      "Upgrade your business's online presence with Devora's comprehensive website modernization service—ideal for businesses with outdated sites. We revamp your website's design, navigation, performance, and mobile compatibility while preserving the features critical to your company.",
    cta: 'Upgrade Your Website',
  },
  offeringsHeading: 'What We Offer',
  offerings: [
    {
      index: '01',
      icon: 'layout',
      title: 'Modern Website Design',
      description:
        "Refresh outdated layouts with visually engaging designs that align with each business's identity.",
    },
    {
      index: '02',
      icon: 'compass',
      title: 'Improved User Experience',
      description:
        'Enhance navigation, information architecture, usability, and accessibility to create a smoother experience for visitors.',
    },
    {
      index: '03',
      icon: 'gauge',
      title: 'Performance and Mobile Optimization',
      description:
        'Improve loading performance, responsive behavior, and compatibility across desktop, tablet, and mobile devices.',
    },
    {
      index: '04',
      icon: 'blocks',
      title: 'Advanced Website Features',
      description:
        'Integrate features such as online selling, booking systems, dashboards, and workflow automation based on business requirements.',
    },
    {
      index: '05',
      icon: 'sparkles',
      title: 'AI-Powered Tools and Automation',
      description:
        'Integrate suitable AI-powered tools, including intelligent chatbots for customer questions, automation for repetitive inquiries, and content assistance for service descriptions, FAQs, and other website content.',
    },
    {
      index: '06',
      icon: 'shield',
      title: 'Feature Preservation and System Enhancement',
      description:
        'Retain essential existing website functionality while modernizing its appearance, performance, and capabilities.',
    },
  ] satisfies Offering[],
  conclusion:
    "Devora's service lets you keep what works and upgrade everything else, giving you greater value and new possibilities.",
} as const

/** Keyword strip used as an ambient capability marquee. No client claims. */
export const capabilities: string[] = [
  'Website Modernization',
  'Redesign',
  'Frontend Development',
  'Backend Development',
  'UI/UX Design',
  'Human-Computer Interaction',
  'Accessibility',
  'Responsive Layouts',
  'Performance',
  'AI-Powered Tools',
  'Workflow Automation',
  'Feature Preservation',
]
