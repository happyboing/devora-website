export type JobVacancy = {
  position: string
  department: string
  employmentType: string
  workArrangement: string
  isSample: boolean
  description: string
  responsibilities: string[]
  qualifications: string[]
  howToApply: string
}

export const vacancy: JobVacancy = {
  position: 'Junior Frontend Developer',
  department: 'Development Team',
  employmentType: 'Full-Time (Sample Position)',
  workArrangement: 'Hybrid (Sample Arrangement)',
  isSample: true,
  description:
    'Devora is looking for a creative and motivated Junior Frontend Developer who is passionate about building responsive, visually engaging, and user-friendly websites. The successful candidate will work with the development and design teams to transform ideas and UI/UX concepts into functional digital experiences.',
  responsibilities: [
    'Develop and maintain responsive website interfaces.',
    'Convert UI/UX designs into functional web pages.',
    'Collaborate with backend developers and UI/UX designers.',
    'Test website functionality and resolve frontend issues.',
    'Follow modern web development practices and accessibility principles.',
    'Participate in code reviews, brainstorming sessions, and collaborative projects.',
  ],
  qualifications: [
    'Familiarity with HTML, CSS, and JavaScript.',
    'Basic understanding of responsive web design.',
    'Familiarity with Git and version control concepts.',
    'Knowledge of React or another frontend framework is an advantage.',
    'Willingness to learn, accept feedback, and work collaboratively.',
    'A portfolio of personal, academic, or professional projects is an advantage.',
  ],
  howToApply:
    'Interested candidates may submit their résumé and portfolio through the application form.',
}

/** Option list for the application form's "position applying for" field. */
export const applicationPositions: string[] = [
  vacancy.position,
  'Frontend Developer (General Application)',
  'UI/UX Designer (General Application)',
  'Backend Developer (General Application)',
]
