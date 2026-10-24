import { useCallback, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/cn'

type LightboxProps = {
  src: string
  /** Description of the artwork itself — reused for both the thumb and the zoom. */
  alt: string
  /** Who the trigger is, phrased as an action for screen readers. */
  openLabel: string
  title: string
  caption?: string
  width?: number
  height?: number
  className?: string
  imageClassName?: string
}

/**
 * Poster viewer.
 *
 * The trigger is a real button and the viewer is a native `<dialog>` opened with
 * `showModal()`, so the browser supplies the top layer, focus handling,
 * background inerting and Esc-to-close — no hand-rolled focus trap to get wrong.
 * The only custom pieces are the backdrop styling and the scroll lock.
 *
 * Because a `showModal` dialog sits above everything, it also sits above the
 * branded pointer. While it is open the document is flagged so the operating
 * system's cursor comes back.
 */
function useModalCursor() {
  const previous = useRef<string | null>(null)

  const take = useCallback(() => {
    const root = document.documentElement
    previous.current = root.getAttribute('data-native-cursor')
    root.setAttribute('data-native-cursor', '')
  }, [])

  const release = useCallback(() => {
    const root = document.documentElement
    if (previous.current === null) root.removeAttribute('data-native-cursor')
    else root.setAttribute('data-native-cursor', previous.current)
  }, [])

  return { take, release }
}

export function Lightbox({
  src,
  alt,
  openLabel,
  title,
  caption,
  width,
  height,
  className,
  imageClassName,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { take, release } = useModalCursor()

  // A history navigation can tear this view down while the dialog is still
  // open, in which case the close handler never runs — so the document has to
  // be put back on the way out regardless.
  useEffect(
    () => () => {
      release()
      document.documentElement.style.overflow = ''
    },
    [release],
  )

  const open = () => {
    const dialog = dialogRef.current
    if (!dialog) return

    take()
    // Native `showModal` restores focus to the trigger when the dialog closes.
    dialog.showModal()
    document.documentElement.style.overflow = 'hidden'
  }

  const close = () => dialogRef.current?.close()

  const onClosed = () => {
    release()
    document.documentElement.style.overflow = ''
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        data-cursor="view"
        data-cursor-label="View"
        aria-label={openLabel}
        className={cn(
          'group/lightbox block w-full rounded-2xl transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aura',
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          className={imageClassName}
        />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={title}
        className="poster-dialog"
        onClose={onClosed}
        onClick={(event) => {
          // Clicks that land on the dialog box itself are backdrop clicks.
          if (event.target === dialogRef.current) close()
        }}
      >
        <div className="poster-dialog__panel rounded-2xl border border-white/10 bg-ink/95 p-3 shadow-[0_50px_120px_-40px_rgba(0,0,0,1)] sm:p-4">
          <img
            src={src}
            alt=""
            className="mx-auto max-h-[74vh] w-auto rounded-xl"
          />

          <div className="mt-3 flex items-center justify-between gap-4 px-1">
            <p className="text-xs text-mist">{caption}</p>
            <button
              type="button"
              onClick={close}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 text-mist transition-colors duration-300 hover:border-aura/50 hover:text-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aura"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Close {title}</span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
