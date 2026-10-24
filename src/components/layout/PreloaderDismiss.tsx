import { useEffect } from 'react'

declare global {
  interface Window {
    __devoraBootAt?: number
  }
}

/** Floor so the intro sequence always gets to play, never a jarring flash. */
const MIN_VISIBLE = 950
/** Longest we will wait for the web fonts before showing the page anyway. */
const FONT_TIMEOUT = 2600
/** Must outlast the panel's lift-away transition in `index.html`. */
const WIPE = 900

/**
 * Retires the startup screen that `index.html` paints before React exists.
 *
 * Mounted at the very top of the tree, so it runs as soon as the app commits.
 * The intro is held until the web fonts settle (or a couple of seconds pass,
 * whichever comes first) so the first frame the visitor sees is already
 * typeset. It then flips the document to `data-boot="done"`, which lifts the
 * whole panel away like a curtain, and finally removes the node.
 *
 * The same `data-boot` flag drives `useBooted()`, so the page's own entrance
 * animations can wait and start exactly as the curtain clears.
 */
export function PreloaderDismiss() {
  useEffect(() => {
    const started = window.__devoraBootAt ?? Date.now()
    let finished = false
    let startTimer = 0
    let removeTimer = 0

    const finish = () => {
      if (finished) return
      finished = true

      const wait = Math.max(0, MIN_VISIBLE - (Date.now() - started))

      startTimer = window.setTimeout(() => {
        document.documentElement.setAttribute('data-boot', 'done')
        removeTimer = window.setTimeout(() => {
          document.getElementById('boot-screen')?.remove()
        }, WIPE)
      }, wait)
    }

    const fallback = window.setTimeout(finish, FONT_TIMEOUT)

    if (document.fonts) {
      document.fonts.ready.then(finish, finish)
    } else {
      finish()
    }

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(removeTimer)
      window.clearTimeout(fallback)
    }
  }, [])

  return null
}
