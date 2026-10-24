import { useEffect, useState } from 'react'

/**
 * Tracks which page section is currently dominant in the viewport so the
 * navigation can highlight it. Uses intersection ratios rather than a single
 * threshold, which stays accurate for both short and very tall sections.
 */
export function useActiveSection(ids: readonly string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let best: string | null = null
        let bestRatio = 0
        for (const id of ids) {
          const ratio = ratios.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }

        setActive(bestRatio > 0 ? best : null)
      },
      {
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8],
        rootMargin: '-18% 0px -55% 0px',
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [ids, enabled])

  return active
}
