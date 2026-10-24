import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MotionConfig } from 'motion/react'

import { SiteLayout } from '@/components/layout/SiteLayout'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CareersPage } from '@/pages/CareersPage'
import { TeamPage } from '@/pages/TeamPage'
import { BASE_PATH } from '@/lib/base'

// Routes stay written relative to the site root; `basename` lets the same build
// run at a domain root or under /<repo>/ on GitHub Pages.
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SiteLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'team', element: <TeamPage /> },
        { path: 'careers', element: <CareersPage /> },
        { path: 'contact', element: <ContactPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: BASE_PATH || '/' },
)

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
