import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MotionConfig } from 'motion/react'

import { SiteLayout } from '@/components/layout/SiteLayout'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CareersPage } from '@/pages/CareersPage'
import { TeamPage } from '@/pages/TeamPage'

const router = createBrowserRouter([
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
])

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
