/**
 * Reports whether the browser can actually create a WebGL context.
 * Used to decide between the real 3D hero and its CSS fallback, so the
 * page never depends on WebGL being available.
 */
export function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')

    if (!gl) return false

    // Release the probe context immediately.
    const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')
    lose?.loseContext()

    return true
  } catch {
    return false
  }
}
