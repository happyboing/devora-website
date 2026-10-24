import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { useMotionValue, useSpring } from 'motion/react'

import { usePointerFine } from './usePointerFine'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type PointerOffsetOptions = {
  /**
   * Track the pointer on `window` instead of on the element itself. Use this
   * for decorative layers that must not intercept clicks (`pointer-events-none`).
   */
  global?: boolean
}

/**
 * Normalised pointer offset for a single element.
 *
 * The values run from -1 (top / left edge) through 0 (centre) to 1 (bottom /
 * right edge), with a spring so decorative layers trail the pointer instead of
 * snapping to it. Everything stays pinned at 0 on touch devices and under
 * reduced motion, which means the layers built on it simply hold still.
 *
 * ```
 * const { ref, x, y, handlers } = usePointerOffset()
 * const driftX = useTransform(x, [-1, 1], [20, -20])
 * <div ref={ref} {...handlers}><motion.div style={{ x: driftX }} /></div>
 * ```
 */
export function usePointerOffset<T extends HTMLElement = HTMLDivElement>(
  options: PointerOffsetOptions = {},
) {
  const { global = false } = options
  const ref = useRef<T>(null)
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.5 })

  const measure = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      x.set(((clientX - rect.left) / rect.width - 0.5) * 2)
      y.set(((clientY - rect.top) / rect.height - 0.5) * 2)
    },
    [x, y],
  )

  useEffect(() => {
    if (!enabled || !global) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      measure(event.clientX, event.clientY)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, global, measure])

  const handlers = {
    onPointerMove(event: ReactPointerEvent<HTMLElement>) {
      if (!enabled || event.pointerType !== 'mouse') return
      measure(event.clientX, event.clientY)
    },
    onPointerLeave() {
      x.set(0)
      y.set(0)
    },
  }

  return { ref, x: springX, y: springY, enabled, handlers }
}
