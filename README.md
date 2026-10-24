# Devora — Website Modernization & Redesign

An immersive, responsive marketing website for **Devora**, a fictional web-development
agency that specializes in website modernization and redesign. Built as an academic
project, the site presents the company's identity, services, organizational chart,
a sample job vacancy, and an inquiry form.

> **Note on authenticity.** Devora is a sample company. No business address, phone
> number, email address, social account, client, date, or metric has been invented.
> The Careers and Contact forms are **demonstration only** — they validate input in the
> browser and never transmit data anywhere.

---

## Tech stack

| Concern            | Choice                                                             |
| ------------------ | ------------------------------------------------------------------ |
| Framework          | React 19 + TypeScript                                              |
| Build tool         | Vite 8                                                             |
| Styling            | Tailwind CSS v4 (design tokens in `@theme`, custom CSS in `@layer components`) |
| Animation          | Motion (`motion/react`) — scroll, springs, layout and variants. GSAP is installed but currently unused: the scroll-driven pieces proved more predictable built on `position: sticky` + scroll-derived transforms |
| 3D                 | three.js via `@react-three/fiber` (lazy-loaded, no external textures) |
| Icons              | lucide-react                                                       |
| Fonts              | Self-hosted `@fontsource-variable` (Inter, Space Grotesk) — no CDN  |
| Routing            | React Router (`createBrowserRouter`)                               |

---

## Getting started

Requires **Node.js 20+** (developed on Node 24 LTS).

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check (tsc -b) + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # type-check only
```

> On Windows PowerShell, `npm.ps1` may be blocked by the execution policy. If so, run
> the same commands as `npm.cmd install`, `npm.cmd run dev`, and so on.

---

## Route map (hybrid layout)

The site is a **single scrolling home page** for the narrative sections, plus
dedicated pages for the team, careers, and contact.

| Route      | Page              | Contents                                                                 |
| ---------- | ----------------- | ------------------------------------------------------------------------ |
| `/`        | Home (single page)| `#home` hero → `#about` About Us → `#identity` Vision, Mission, Values & Motto → `#history` Company History & Development → `#services` Products & Services |
| `/team`    | Organizational Chart | Pyramid chart: Team Leader at the apex, then Administration, Public Relations and Development — 9 members total |
| `/careers` | Careers            | Company message + the job posting pubmat, the clearly-labelled **sample** Junior Frontend Developer vacancy and application form |
| `/contact` | Contact            | Demonstration inquiry form                              |
| `*`        | Not Found          | Friendly 404 with a route back home                     |

### Deep links to home sections

In-page sections are addressed with a query parameter rather than a hash, e.g.
`/?s=about` or `/?s=services`. This keeps real, shareable hrefs on the nav links while
letting `SectionScrollManager` scroll to the target and then strip the parameter with
`history.replaceState`. Sections remain plain `<section id="…">` anchors with
`scroll-margin-top` so native keyboard and screen-reader navigation still works.

### Static hosting / SPA fallback

Routing uses `BrowserRouter`, so a static host must rewrite unknown paths to
`index.html`. `public/_redirects` provides this for Netlify and Cloudflare Pages and is
copied into `dist/` at build time. `npm run preview` handles it automatically. On any
other host, add an equivalent "serve `index.html` for all routes" rule.

### GitHub Pages

`.github/workflows/deploy-pages.yml` builds the site and publishes it with GitHub's
official Pages actions. Enable it once under **Settings → Pages → Build and
deployment → Source: GitHub Actions**. Project sites are served from `/<repo>/`, so
the workflow derives `BASE_PATH` from the repository name and Vite applies it at
build time. `scripts/spa-fallback.mjs` copies `dist/index.html` to `dist/404.html`,
which gives GitHub Pages the same "serve the app for every route" behaviour that
`_redirects` provides elsewhere.

---

## Project structure

```
assets/                     Original Devora logo PNGs (never modified)
                            devorapubmat1-opt.jpg — web copy of the job pubmat
                            devorapubmat1.png     — original pubmat, never modified
                            KAIRA…JOSHUA.png      — original member portraits
public/                     favicon.svg, _redirects (SPA fallback)
                            team/ — web-sized member portraits (see below)
src/
  App.tsx                   Router + MotionConfig(reducedMotion="user")
  main.tsx                  Entry point, self-hosted fonts, startup-screen gate
  index.css                 Design system: tokens, base layer, component classes
  data/                     Canonical company copy (see below)
    company.ts              identity, hero, about, values, history, milestones
    services.ts             primary service + 6 offerings
    team.ts                 org chart: leader + 3 departments, 9 members + photos
    jobs.ts                 the sample vacancy
    nav.ts                  navigation model
  lib/                      scroll helpers, hooks, validation, WebGL capability
  components/
    layout/                 SiteLayout, Navbar, Footer, scroll managers,
                            PreloaderDismiss (retires the index.html splash)
    earth/                  EarthLayer + EarthScene (3D globe) + CSS fallback
    hero/                   Hero, HeroVisual (orbit guides + labels framing the centred copy)
    sections/               About, Identity, History, Services, CTA
    ui/                     Button, Logo, Section, Reveal, SpotlightCard,
                            Cursor, KineticText, KineticBand, ScrollStatement,
                            Parallax, TiltCard, Magnetic, Lightbox
  pages/                    HomePage, TeamPage, CareersPage, ContactPage, NotFoundPage
```

All user-facing copy lives in `src/data/*.ts`. The wording is reproduced from the
supplied company information; only paragraph splitting and casing were adjusted.

### Startup screen

`index.html` inlines a branded full-screen splash (markup, styles and a progress
counter) so something is on screen before the stylesheet or the app bundle arrive.
`PreloaderDismiss` retires it after the first commit, once the self-hosted fonts have
settled: the counter lands on `100`, the curtain lifts, and the hero's own entrance
plays *through* the lift rather than behind it. An 8-second watchdog guarantees the
splash can never trap anyone, and the whole sequence is a plain fade under reduced
motion.

`useBooted` is what times that handover — page entrance animations wait for
`html[data-boot="done"]` before they start.

### The Earth

The home page's globe is built entirely in the browser: approximate continent outlines
are rasterised into an offscreen equirectangular mask, sampled with a Fibonacci sphere,
and the land hits become glowing points. Nothing is fetched, so the site stays
self-hosted and works offline. It turns slowly on its own, sits at the centre of the
viewport, and stays put while the page scrolls — a fixed backdrop rather than something
that slides away, so it can be scaled up without ever crossing the copy. Pointer movement
only tilts the view a few degrees. The 3D layer is progressive enhancement — a CSS planet
renders underneath it, in the same position and at the same size, and is all that shows
when WebGL is unavailable, reduced motion is requested, or the viewport is narrow enough
that the 3D bundle is not worth its weight. The 3D chunk is fetched in idle time so it
never competes with the content.

### The motion system

Rather than scattering one-off effects, the movement comes from a small set of shared
primitives that the sections compose:

| Primitive        | What it does                                                              |
| ---------------- | ------------------------------------------------------------------------- |
| `KineticText`    | Masks each word (or character) so a line assembles instead of fading in.   |
| `ScrollStatement`| Warms a passage word by word in step with the scroll.                      |
| `KineticBand`    | Two-row travelling ticker (solid + uppercase echo, opposite directions) that also skews with scroll *velocity*. |
| `Parallax`       | Drifts a layer against the scroll.                                         |
| `TiltCard`       | Subtle pointer-tracked tilt on panels.                                     |
| `Magnetic`       | Pulls a button toward the pointer.                                         |
| `usePointerOffset` | Normalised pointer springs for decorative layers — the hero frame and the CTA rings. |
| `useSpotlight`   | Writes the pointer position to `--mx`/`--my` so panels can light up under it. |
| `Cursor`         | Branded pointer: instant dot, trailing ring, and a badge for marked media. |

Two rules keep this honest. First, `background-clip: text` cannot see glyphs that live
inside an overflow-clipped mask, so gradient headings pass `mask={false}` and reveal out
of a blur instead — that is also why `KineticText` groups characters per word with
`white-space: nowrap`, since a mask per character would otherwise let a word break
anywhere.

Second, each section gets its own composition rather than a repeated card grid: the
About column sticks beside reading-paced prose, Identity splits into a tiling
vision/mission pair over an interactive values index, History holds and scrubs sideways,
Services pairs a hover-reactive offerings list with a live preview, and the closing CTA
is oversized type that leans with the scroll.

The History timeline is deliberately built from `position: sticky` plus a scroll-derived
transform instead of a ScrollTrigger pin: the routed page sits inside a transformed
wrapper (for route transitions), where `position: fixed` pinning is unreliable.
Under reduced motion the timeline collapses to a plain vertical list.

### The custom cursor

`Cursor` mounts only on `(hover: hover) and (pointer: fine)` and only when reduced motion
is not requested; the native pointer is hidden by a class the component adds, so touch
devices and a failed script always keep a real cursor. Text fields opt back in to the
I-beam. A native `<dialog>` (the poster lightbox) sits in the browser's top layer, above
any `z-index`, so while one is open the document is flagged `data-native-cursor` and the
OS pointer takes over.

### Member photos

All nine portraits live in `public/team/` as 480 px, square, web-sized JPEGs made from the
supplied originals in `assets/` (which are left untouched). `src/data/team.ts` points at
them by member id:

```ts
{ id: 'kaira-galay', name: 'Kaira Grace A. Galay', /* … */ photo: '/team/kaira-galay.jpg' }
```

To swap a portrait, add the new file to `public/team/` and update its `photo` path. If a
path is missing or the image fails to load, the member keeps their initials tile — the
chart never breaks.


All user-facing copy lives in `src/data/*.ts`. The wording is reproduced from the
supplied company information; only paragraph splitting and casing were adjusted.

---

## Accessibility

- Semantic landmarks (`header`/`nav`/`main`/`footer`), one `<h1>` per page, ordered headings.
- A visible, high-contrast focus ring on every interactive element (`:focus-visible`).
- Kinetic type is decorative to assistive tech in exactly one place: a heading keeps an
  `aria-label` and hides its masked tokens, so the line is announced as a single name.
  A generic `<span>`/`<p>` may not carry `aria-label`, so there the real text stays
  exposed and reads naturally.
- The poster lightbox is a native `<dialog>` opened with `showModal()`, so the browser
  supplies the top layer, background inerting, focus moving in, Esc-to-close and focus
  returning to the trigger.
- `prefers-reduced-motion` is respected everywhere: Motion's
  `MotionConfig reducedMotion="user"`, the CSS `@media (prefers-reduced-motion: reduce)`
  block (disables smooth scrolling and decorative animation), the startup screen's
  animation, the 3D Earth (skipped and frozen), and the custom cursor (never mounted —
  the OS pointer stays).
- Decorative visuals are `aria-hidden`; neither the 3D canvas nor the startup screen is
  required to understand or operate the page.
- Form errors are tied to their fields via `aria-invalid` and announced in a
  `role="status"` live region on submit.
- The page-wide Earth is progressive enhancement: a CSS planet renders underneath it, the
  chunk is only fetched when WebGL is available, and a failed chunk or lost context falls
  back to the static planet. The startup screen announces itself with `role="status"`, is
  dismissed once the app is ready, and then removes itself from the DOM.

---

## The demonstration forms

`CareersPage` and `ContactPage` validate entirely on the client (`src/lib/validation.ts`).
On a valid submit they show an explicit message stating that nothing was sent. There is no
backend, no email service, and no data persistence by design.

---

## Scripts

| Script              | Description                                 |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR          |
| `npm run build`     | Type-check (`tsc -b`) then build to `dist/` |
| `npm run preview`   | Preview the production build locally        |
| `npm run typecheck` | Type-check only, no emit                    |
