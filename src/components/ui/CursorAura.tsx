import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

/**
 * Soft aura that trails the pointer.
 *
 * Only mounts for fine-pointer devices, never on reduced-motion, and sits
 * behind all content — so it can add atmosphere without ever blocking a click
 * or a keyboard focus ring.
 */
export function CursorAura() {
  const reduced = usePrefersReducedMotion()
  const [finePointer, setFinePointer] = useState(false)

  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const springX = useSpring(x, { stiffness: 130, damping: 22, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 130, damping: 22, mass: 0.6 })

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFinePointer(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!finePointer || reduced) return

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [finePointer, reduced, x, y])

  if (!finePointer || reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed -left-[260px] -top-[260px] -z-10 size-[520px] rounded-full opacity-70"
    >
      <div
        className="size-full rounded-full blur-[70px]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(224,66,124,0.22), rgba(94,214,255,0.10) 45%, transparent 70%)',
        }}
      />
    </motion.div>
  )
}
