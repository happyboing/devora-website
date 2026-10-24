import { lazy, Suspense, useEffect, useState } from 'react'

import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { hasWebGL } from '@/lib/webgl'
import { EarthFallback } from './EarthFallback'

/** The 3D globe is a separate chunk, fetched only when it is actually usable. */
const EarthScene = lazy(() => import('./EarthScene'))

type Mode = 'idle' | 'ready' | 'static'

/** Below this width the 3D bundle costs more than it is worth; the CSS planet shows. */
const WIDE_QUERY = '(min-width: 768px)'

/**
 * The page-wide "Earth".
 *
 * A fixed layer sitting just above the ambient washes and just below the
 * content, holding the globe at the centre of the viewport for the whole way
 * down the home page. It deliberately does not travel with the scroll: the
 * planet reads as the room the page happens inside, while all of the movement
 * is carried by the content in front of it.
 *
 * Progressive enhancement, same contract as the rest of the site:
 *
 * 1. The CSS planet always renders — bloom, rim light and all.
 * 2. WebGL layers on top only on a wide viewport, when the device supports it,
 *    the visitor has not asked for reduced motion, and the chunk loads without
 *    error. The chunk is fetched in idle time so it never competes with the
 *    content the visitor actually came for.
 * 3. Reduced motion keeps the CSS planet and skips the 3D layer entirely.
 */
export function EarthLayer() {
  const reduced = usePrefersReducedMotion()
  const [mode, setMode] = useState<Mode>('idle')

  // Decide whether the 3D layer is worth loading at all.
  useEffect(() => {
    if (reduced) {
      setMode('static')
      return
    }

    const wide = window.matchMedia(WIDE_QUERY)
    let idleId = 0
    let timer = 0

    const cancel = () => {
      if (idleId) window.cancelIdleCallback(idleId)
      idleId = 0
      window.clearTimeout(timer)
      timer = 0
    }

    const sync = () => {
      cancel()

      if (!wide.matches || !hasWebGL()) {
        setMode('static')
        return
      }

      // Wait for a quiet moment: the 3D chunk is heavy and purely decorative.
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(() => setMode('ready'), { timeout: 2000 })
      } else {
        timer = window.setTimeout(() => setMode('ready'), 600)
      }
    }

    sync()
    wide.addEventListener('change', sync)

    return () => {
      cancel()
      wide.removeEventListener('change', sync)
    }
  }, [reduced])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Orbit guides are centred on the globe, so they read as one object. */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[150vw] -translate-x-1/2 -translate-y-1/2 sm:w-[112vw] lg:w-[82vw] lg:max-w-[66rem]">
        <div className="absolute inset-[3%] rounded-full border border-white/[0.05]" />
        <div className="anim-spin-slower absolute inset-[3%] rounded-full border border-dashed border-white/[0.06]" />
        <div
          className="absolute inset-[12%] rounded-full opacity-50"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(224,66,124,0.4) 80deg, transparent 170deg, rgba(94,214,255,0.35) 280deg, transparent 360deg)',
            mask: 'radial-gradient(circle, transparent 94%, #000 96%)',
            WebkitMask: 'radial-gradient(circle, transparent 94%, #000 96%)',
          }}
        />
      </div>

      <div className="absolute left-1/2 top-1/2 aspect-square w-[150vw] -translate-x-1/2 -translate-y-1/2 sm:w-[112vw] lg:w-[82vw] lg:max-w-[66rem]">
        <div className="absolute inset-0 opacity-50 sm:opacity-65 lg:opacity-80">
          <EarthFallback className="absolute inset-0" />

          {mode === 'ready' && (
            <div className="earth-webgl absolute inset-0">
              <ErrorBoundary fallback={null} onError={() => setMode('static')}>
                <Suspense fallback={null}>
                  <EarthScene />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
