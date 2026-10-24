import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

function read(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(QUERY).matches
}

/**
 * Tracks whether the device has a precise pointer (mouse / trackpad) that can
 * hover. Used to gate cursor and hover-only affordances so touch devices keep
 * their normal interactions untouched.
 */
export function usePointerFine(): boolean {
  const [fine, setFine] = useState(read)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setFine(mql.matches)
    setFine(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return fine
}
