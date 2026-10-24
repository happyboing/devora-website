import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
  /** Optional hook so the owner can stop retrying entirely (e.g. drop WebGL). */
  onError?: (error: Error) => void
}

type State = { failed: boolean }

/**
 * Keeps an optional, heavy visual (WebGL, lazy chunk) from taking the page down
 * with it. If anything inside throws, the section renders its static fallback
 * while the rest of the site carries on normally.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error)

    if (import.meta.env.DEV) {
      console.warn('[Devora] An optional visual failed to render and was replaced by its fallback.', error, info)
    }
  }

  override render(): ReactNode {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
