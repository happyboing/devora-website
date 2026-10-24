import { useEffect, useState } from 'react'

function isBooting(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('data-boot') === 'loading'
}

/**
 * `true` once the startup screen has begun lifting away.
 *
 * The page's entrance animations are held on this so the hero performs its
 * reveal *as* the curtain clears, rather than finishing unseen behind it.
 * Falls back to `true` after a short grace period so a failed boot can never
 * leave the content stranded in its hidden state.
 */
export function useBooted(): boolean {
  const [booted, setBooted] = useState(() => !isBooting())

  useEffect(() => {
    if (booted) return

    const check = () => {
      if (!isBooting()) setBooted(true)
    }

    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-boot'],
    })

    const fallback = window.setTimeout(check, 3000)
    check()

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [booted])

  return booted
}
