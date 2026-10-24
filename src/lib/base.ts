/**
 * Vite's deploy base without the trailing slash: '' at the domain root and
 * '/<repo>' on a GitHub Pages project site. React Router paths and in-app links
 * stay base-relative, so anything that builds a raw href (or needs to compare
 * against a full `window.location.pathname`) should use this.
 */
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Prefixes a `public/` path such as `/team/kaira-galay.jpg` with the base. */
export function assetUrl(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`
}
