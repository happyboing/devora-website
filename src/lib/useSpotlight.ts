import { useRef, type PointerEvent as ReactPointerEvent } from 'react'

/**
 * Feeds the pointer position into an element's `--mx` / `--my` custom
 * properties, which is what the `.spotlight` background reads.
 *
 * Writing straight to the node keeps the highlight off React's render path, so
 * it can track a mouse across a large panel without a single re-render.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || event.pointerType !== 'mouse') return

    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return { ref, onPointerMove }
}
