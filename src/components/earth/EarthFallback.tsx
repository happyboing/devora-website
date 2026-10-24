/**
 * Static, CSS-only stand-in for the Earth.
 *
 * It is always rendered underneath the WebGL globe, where it supplies the bloom
 * and colour grade. If WebGL is unavailable (or the visitor asked for reduced
 * motion) this is all that shows — and it still reads as a glowing planet, so
 * the page never looks broken or unfinished.
 *
 * The body is deliberately dark: the globe sits behind the page's copy, and a
 * bright ball would wreck the contrast of every paragraph laid over it. The
 * light lives on the limb and in the bloom instead.
 */
export function EarthFallback({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {/* Ambient bloom */}
      <div
        className="absolute inset-0 rounded-full opacity-70 blur-[70px]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 38% 32%, rgba(245,138,180,0.42), rgba(224,66,124,0.22) 46%, transparent 74%)',
        }}
      />

      {/* Icy counter-glow */}
      <div
        className="absolute inset-0 scale-[1.35] rounded-full opacity-40 blur-[80px]"
        style={{
          backgroundImage: 'radial-gradient(circle at 70% 76%, rgba(94,214,255,0.28), transparent 62%)',
        }}
      />

      {/* The globe itself — a dark body under a rose limb light. */}
      <div className="planet-orb absolute inset-[19%]" />

      {/* Rim light */}
      <div className="absolute inset-[19%] rounded-full shadow-[inset_0_0_70px_-12px_rgba(94,214,255,0.4)]" />
    </div>
  )
}
