import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

import { usePointerFine } from '@/lib/usePointerFine'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type CursorState = 'default' | 'link' | 'view' | 'drag' | 'text' | 'hidden'

/** Anything that should change the cursor's shape when hovered. */
const INTERACTIVE =
  'a, button, [role="button"], [role="tab"], summary, label, input, textarea, select, [data-cursor]'

const RING_SCALE: Record<CursorState, number> = {
  default: 1,
  link: 1.75,
  view: 0,
  drag: 0,
  text: 0,
  hidden: 0,
}

/**
 * A branded cursor: a precise dot with a trailing ring, both composited with
 * `mix-blend-difference` so they invert whatever sits beneath them.
 *
 * The shape reacts to context — it opens over links, gives way to a labelled
 * badge over elements marked `data-cursor="view"` / `"drag"`, and steps aside
 * over text fields so the native caret behaves normally. It only exists for
 * fine pointers, so touch devices keep their standard interactions.
 */
export function Cursor() {
  const reduced = usePrefersReducedMotion()
  const fine = usePointerFine()
  const enabled = fine && !reduced

  const [state, setState] = useState<CursorState>('hidden')
  const [label, setLabel] = useState('')

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    let frame = 0

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setState((current) => (current === 'hidden' ? 'default' : current))
      })
    }

    const onOver = (event: PointerEvent) => {
      const hit = (event.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null

      if (!hit) {
        setState('default')
        setLabel('')
        return
      }

      const tag = hit.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        setState('text')
        setLabel('')
        return
      }

      const explicit = hit.getAttribute('data-cursor')
      setState(explicit === 'view' || explicit === 'drag' ? explicit : 'link')
      setLabel(hit.getAttribute('data-cursor-label') ?? '')
    }

    const onOut = (event: PointerEvent) => {
      const related = event.relatedTarget as Element | null
      if (!related?.closest?.(INTERACTIVE)) {
        setState('default')
        setLabel('')
      }
    }

    const onLeave = () => setState('hidden')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const showDot = state === 'default'
  const showRing = state === 'default' || state === 'link'
  const showBadge = state === 'view' || state === 'drag'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div style={{ x: ringX, y: ringY }} className="absolute left-0 top-0">
        <motion.span
          animate={{ scale: showBadge ? 1 : 0.4, opacity: showBadge ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="grid size-[78px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-aura/50 bg-aura/90 text-[9px] font-medium uppercase tracking-[0.22em] text-void shadow-[0_0_40px_-8px_rgba(224,66,124,0.9)]"
        >
          {label}
        </motion.span>
      </motion.div>

      <motion.div style={{ x: ringX, y: ringY }} className="absolute left-0 top-0 mix-blend-difference">
        <motion.span
          animate={{ scale: showRing ? RING_SCALE[state] : 0.4, opacity: showRing ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="block size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90"
        />
      </motion.div>

      <motion.div style={{ x, y }} className="absolute left-0 top-0 mix-blend-difference">
        <motion.span
          animate={{ scale: showDot ? 1 : 0, opacity: showDot ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="block size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        />
      </motion.div>
    </div>
  )
}
