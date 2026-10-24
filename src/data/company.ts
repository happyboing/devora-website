/**
 * Canonical Devora company content.
 * Wording is reproduced from the supplied company information; only
 * presentation-level formatting (paragraph splitting, casing) has changed.
 */

export const identity = {
  name: 'Devora',
  tagline: 'Website Modernization & Redesign',
  motto: 'Explore Your Aura, Create with Devora.',
} as const

export const hero = {
  headline: 'Explore Your Aura. Create with Devora.',
  subheadline: 'Modern websites. Meaningful experiences. Limitless possibilities.',
  description:
    'Devora transforms outdated websites into modern, engaging, and high-performing digital experiences. We combine creative design, innovative technology, and user-centered thinking to help businesses thrive in an evolving digital world.',
  primaryCta: 'Start a Project',
  secondaryCta: 'Discover Devora',
} as const

export const about = {
  heading: 'Building the Future of Digital Experiences.',
  paragraphs: [
    'At Devora, we specialize in website modernization and redesign. Our journey began with a vision: to help businesses thrive in a fast-evolving digital world. Noticing that many websites lagged behind in design and technology, we set out to deliver modern, innovative solutions that make an impact.',
    'Driven by creativity, collaboration, and a passion for user-centered design, our team harnesses the latest web technologies to build websites that are not only eye-catching but also highly functional and unique.',
    "We're dedicated to helping your business stand out and succeed—let's build a website with aura together.",
  ],
} as const

export const vision = {
  label: 'Our Vision',
  text: 'To help businesses build a strong digital presence through websites that are functional, engaging, and easy to use.',
} as const

export const mission = {
  label: 'Our Mission',
  text: 'To turn ideas into innovative, user-centered digital solutions by blending technology, design, and teamwork. We started with basic web development and now specialize in creating functional and engaging websites using HCI and UI/UX principles.',
} as const

export type ValueId = 'creativity' | 'functionality' | 'user-centered' | 'collaboration' | 'innovation'

export type CompanyValue = {
  id: ValueId
  index: string
  title: string
  description: string
}

export const values: CompanyValue[] = [
  {
    id: 'creativity',
    index: '01',
    title: 'Creativity',
    description:
      'We create unique and visually engaging websites that reflect the identity of each business.',
  },
  {
    id: 'functionality',
    index: '02',
    title: 'Functionality',
    description:
      'We make sure our websites are not only good-looking but also work properly and efficiently.',
  },
  {
    id: 'user-centered',
    index: '03',
    title: 'User-Centered Design',
    description:
      'We prioritize the needs and experience of users when designing websites and digital experiences.',
  },
  {
    id: 'collaboration',
    index: '04',
    title: 'Collaboration',
    description:
      'We work closely with clients and within our team to turn ideas into effective digital solutions.',
  },
  {
    id: 'innovation',
    index: '05',
    title: 'Innovation',
    description:
      'We continuously explore new technologies and approaches to improve the websites and experiences we create.',
  },
]

export const history = {
  heading: 'From Creative Beginnings to Digital Innovation.',
  paragraphs: [
    'Devora started as a small team passionate about crafting websites that blend functionality and visual appeal for businesses. As client needs evolved, so did Devora—expanding from basic frontend design to full-service web development, including backend work and a strong emphasis on user-centered HCI and UI/UX practices.',
    'Our growth has been shaped by openness to new technologies, and a culture that balances individual creativity with teamwork. We believe both initiative and collaboration drive innovative solutions. By setting clear roles and organized project timelines, we consistently deliver digital experiences that meet our clients’ changing needs.',
    'Today, Devora combines technical expertise, creativity, and effective teamwork to build websites that help businesses succeed.',
  ],
} as const

export type Milestone = {
  phase: string
  title: string
  description: string
}

/**
 * A visual reading of the company history above — phases, not dated events.
 */
export const milestones: Milestone[] = [
  {
    phase: 'Phase 01',
    title: 'The Beginning',
    description:
      'A small team united by a passion for creative and functional website design.',
  },
  {
    phase: 'Phase 02',
    title: 'Expanding Our Skills',
    description:
      'Growth from basic frontend design into broader web development capabilities.',
  },
  {
    phase: 'Phase 03',
    title: 'User-Centered Innovation',
    description:
      'A stronger focus on Human-Computer Interaction (HCI), UI/UX, accessibility, and usability.',
  },
  {
    phase: 'Phase 04',
    title: 'Building with Purpose',
    description:
      'A collaborative team combining design and development to create modern digital experiences.',
  },
]

export const careers = {
  heading: "Create What's Next With Us.",
  intro:
    "At Devora, we believe great digital experiences are built by people who are curious, creative, and passionate about solving problems. We're always interested in connecting with individuals who value collaboration, thoughtful design, and continuous learning.",
} as const

export const contact = {
  heading: "Let's Build Something With Aura.",
  description:
    "Have an outdated website or an idea that deserves a better digital experience? Let's explore how Devora can help transform it.",
} as const
