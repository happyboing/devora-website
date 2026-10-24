import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { scrollToSection } from '@/lib/scroll'

/**
 * Central handler for `?s=<section>` deep links.
 *
 * Any link anywhere in the site that points at a home-page section resolves to
 * `/?s=about` and lands here. The parameter is consumed once, then removed from
 * the URL so a later refresh does not force a jump.
 */
export function SectionScrollManager() {
  const [searchParams, setSearchParams] = useSearchParams()
  const target = searchParams.get('s')

  useEffect(() => {
    if (!target) return

    let settled = false
    let outer = 0
    let inner = 0
    let fallback = 0

    const run = () => {
      if (settled) return
      settled = true
      scrollToSection(target)
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          next.delete('s')
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    }

    // Two frames: one for React to commit the sections, one for layout to settle.
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(run)
    })

    // `requestAnimationFrame` is throttled (or paused) while a tab is in the
    // background, so opening a deep link in a new tab could otherwise skip the
    // jump. This fallback is a no-op on a visible page, where rAF wins the race.
    fallback = window.setTimeout(run, 400)

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
      window.clearTimeout(fallback)
    }
  }, [target, setSearchParams])

  return null
}
