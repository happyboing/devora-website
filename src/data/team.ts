export type MemberGroup = 'administration' | 'public-relations' | 'development'

export type TeamMember = {
  id: string
  name: string
  role: string
  responsibility: string
  group: MemberGroup
  /**
   * Portrait in `public/team/`. Every member has one; if a file is missing the
   * avatar falls back to the member's initials rather than inventing a face.
   */
  photo?: string
}

export type Department = {
  id: MemberGroup
  name: string
  summary: string
  members: TeamMember[]
}

export type OrgChart = {
  heading: string
  description: string
  leaderLabel: string
  leader: TeamMember
  departments: Department[]
}

export const orgChart: OrgChart = {
  heading: 'The People Behind Devora.',
  description:
    'Every successful digital experience begins with a team that combines leadership, organization, communication, and technical expertise.',
  leaderLabel: 'Team Leader',
  leader: {
    id: 'kaira-galay',
    name: 'Kaira Grace A. Galay',
    role: 'Team Leader',
    responsibility: 'Guides the team, sets goals, and ensures all projects run smoothly.',
    group: 'administration',
    photo: '/team/kaira-galay.jpg',
  },
  departments: [
    {
      id: 'administration',
      name: 'Administration',
      summary: 'Keeps schedules, records and internal communication running.',
      members: [
        {
          id: 'justin-tuazon',
          name: 'Justin Elijah R. Tuazon',
          role: 'Secretary',
          responsibility: 'Manages meeting notes, schedules, and team communications.',
          group: 'administration',
          photo: '/team/justin-tuazon.jpg',
        },
        {
          id: 'lanz-garcia',
          name: 'Lanz Marcus M. Garcia',
          role: 'Administrative Assistant',
          responsibility: 'Supports the secretary in organizing files and coordinating logistics.',
          group: 'administration',
          photo: '/team/lanz-garcia.jpg',
        },
      ],
    },
    {
      id: 'public-relations',
      name: 'Public Relations',
      summary: 'Represents Devora publicly and shapes outward-facing materials.',
      members: [
        {
          id: 'psalmea-maranan',
          name: 'Psalmea Reign D. Maranan',
          role: 'Public Speaker',
          responsibility: 'Represents Devora and maintains public outreach.',
          group: 'public-relations',
          photo: '/team/psalmea-maranan.jpg',
        },
        {
          id: 'mauel-de-torres',
          name: 'Mauel Czedrik D. De Torres',
          role: 'PR Assistant',
          responsibility: 'Assists with public materials and event coordination.',
          group: 'public-relations',
          photo: '/team/mauel-de-torres.jpg',
        },
      ],
    },
    {
      id: 'development',
      name: 'Development Team',
      summary: 'Designs and builds the digital experiences Devora delivers.',
      members: [
        {
          id: 'jeremy-caagbay',
          name: 'Jeremy N. Caagbay',
          role: 'Frontend Developer',
          responsibility:
            'Builds and styles the visual parts of the website that users interact with.',
          group: 'development',
          photo: '/team/jeremy-caagbay.jpg',
        },
        {
          id: 'lance-alpuerto',
          name: 'Lance Ian Carlo E. Alpuerto',
          role: 'Full Stack Developer',
          responsibility: 'Builds and connects both the frontend and backend parts of the website.',
          group: 'development',
          photo: '/team/lance-alpuerto.jpg',
        },
        {
          id: 'aron-dela-cruz',
          name: 'Aron Migeel R. Dela Cruz',
          role: 'Backend Developer',
          responsibility: 'Develops server-side logic and connects the website to databases.',
          group: 'development',
          photo: '/team/aron-dela-cruz.jpg',
        },
        {
          id: 'joshua-delos-santos',
          name: 'Joshua Evan B. Delos Santos',
          role: 'UI/UX Designer',
          responsibility: 'Designs layouts and ensures the website is easy and pleasant to use.',
          group: 'development',
          photo: '/team/joshua-delos-santos.jpg',
        },
      ],
    },
  ],
}

/** The leader plus every department member — nine people in total. */
export const allMembers: TeamMember[] = [
  orgChart.leader,
  ...orgChart.departments.flatMap((department) => department.members),
]

/** Initials used for the abstract avatars — no portrait photographs are invented. */
export function initialsOf(name: string): string {
  const parts = name
    .replace(/\./g, ' ')
    .split(/\s+/)
    .filter((part) => part.length > 0 && /^[A-Za-z]/.test(part))

  const first = parts[0]?.charAt(0) ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : ''

  return `${first}${last}`.toUpperCase()
}
