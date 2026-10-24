/**
 * Fixed atmospheric background: coloured washes, slowly drifting light blobs,
 * a masked grid and a full-bleed film grain. Purely decorative, so the whole
 * layer is hidden from assistive technology and never intercepts pointers.
 */
export function Ambience() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        {/* Base colour washes */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(120% 78% at 50% -12%, rgba(224,66,124,0.20), transparent 62%), radial-gradient(85% 60% at 102% 4%, rgba(94,214,255,0.12), transparent 58%), radial-gradient(70% 55% at -6% 88%, rgba(224,66,124,0.10), transparent 60%)',
          }}
        />

        {/* Drifting light blobs */}
        <div
          className="ambience-blob anim-drift absolute -left-[14%] top-[6%] size-[42vw] max-h-[560px] max-w-[560px]"
          style={{ background: 'radial-gradient(circle, rgba(224,66,124,0.34), transparent 68%)' }}
        />
        <div
          className="ambience-blob anim-drift absolute right-[-10%] top-[32%] size-[36vw] max-h-[480px] max-w-[480px]"
          style={{
            background: 'radial-gradient(circle, rgba(94,214,255,0.22), transparent 68%)',
            animationDelay: '-7s',
          }}
        />
        <div
          className="ambience-blob anim-drift absolute bottom-[-12%] left-[24%] size-[40vw] max-h-[520px] max-w-[520px]"
          style={{
            background: 'radial-gradient(circle, rgba(245,138,180,0.20), transparent 70%)',
            animationDelay: '-14s',
          }}
        />

        {/* Masked technical grid */}
        <div className="grid-lines absolute inset-0 opacity-60" />

        {/* Vignette keeps the edges calmer than the centre */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(125% 105% at 50% 45%, transparent 38%, rgba(4,4,10,0.72) 82%, rgba(4,4,10,0.96) 100%)',
          }}
        />
      </div>

      <div className="grain" aria-hidden="true" />
    </>
  )
}
