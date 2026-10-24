import { useState } from 'react'

import { initialsOf } from '@/data/team'
import { assetUrl } from '@/lib/base'
import { cn } from '@/lib/cn'

type AvatarProps = {
  name: string
  /**
   * Optional portrait. Drop the file into `public/team/` and point at it from
   * `src/data/team.ts` (e.g. `photo: '/team/kaira-galay.jpg'`). Until one is
   * added — or if it fails to load — the initials tile is shown instead.
   */
  photo?: string
  className?: string
}

/**
 * Member avatar. Shows the member's portrait when one is supplied, and falls
 * back to a gradient tile carrying their initials if the file is missing.
 */
export function Avatar({ name, photo, className }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const src = photo ? assetUrl(photo) : null
  const showPhoto = Boolean(src) && !failed

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl',
        'border border-white/10 bg-charcoal',
        className,
      )}
    >
      <span
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(120% 120% at 18% 12%, rgba(224,66,124,0.55), transparent 58%), radial-gradient(120% 120% at 88% 88%, rgba(94,214,255,0.4), transparent 60%)',
        }}
      />
      <span
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
      />

      {showPhoto && src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="relative size-full object-cover"
        />
      ) : (
        <span className="relative font-display text-[0.95rem] font-semibold tracking-tight text-frost">
          {initialsOf(name)}
        </span>
      )}
    </span>
  )
}
