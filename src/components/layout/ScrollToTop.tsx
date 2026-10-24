import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets the scroll position when the route itself changes. Section deep links
 * (`?s=…`) are excluded because those are handled by SectionScrollManager.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
