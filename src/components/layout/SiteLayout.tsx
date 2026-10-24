import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import { Ambience } from '@/components/ui/Ambience'
import { Cursor } from '@/components/ui/Cursor'
import { CursorAura } from '@/components/ui/CursorAura'
import { EarthLayer } from '@/components/earth/EarthLayer'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { ScrollToTop } from './ScrollToTop'
import { SectionScrollManager } from './SectionScrollManager'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

/**
 * Chrome shared by every route. The routed page renders inside an
 * AnimatePresence so route changes cross-fade instead of snapping.
 */
export function SiteLayout() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()

  return (
    <div className="relative flex min-h-screen flex-col">
      <Ambience />
      {location.pathname === '/' && <EarthLayer />}
      <CursorAura />
      <Cursor />
      <ScrollProgress />
      <ScrollToTop />
      <SectionScrollManager />
      <Navbar />

      <main id="main" className="relative flex-1 pt-28 sm:pt-32">
        {reduced ? (
          <Outlet />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <Footer />
    </div>
  )
}
