# Unplugged Raagam — React cafés carousel (shadcn + Tailwind)

The main site is static HTML. This **Vite + React + TypeScript** app embeds two islands:

| Page | Mount | Component |
|------|--------|-----------|
| `index.html` | `#cafes-root` | Infinite cafés slider |
| `gallery.html` | `#gallery-root` | Circular GSAP image gallery |

## Stack

| Tool | Purpose |
|------|---------|
| **Vite 8** | Bundler |
| **React 19** + **TypeScript** | UI |
| **Tailwind CSS v4** (`@tailwindcss/vite`) | Styles |
| **shadcn conventions** | `components.json`, `@/components/ui`, `src/lib/utils.ts` (`cn`) |

The original static site had **no** React/shadcn setup; this `frontend/` folder is the correct place for UI components.

### Why `src/components/ui/`?

shadcn CLI copies primitives and community blocks into **`components/ui`** by default. Keeping that path lets you run:

```bash
npx shadcn@latest add button
```

without retargeting paths. Aliases are set in `components.json` and `tsconfig.app.json` (`@/*` → `src/*`).

## Setup (if starting fresh)

From repo root:

```bash
cd frontend
npm install
```

Optional — official shadcn init (already scaffolded; run only to add more blocks):

```bash
npx shadcn@latest init
```

## Key files

| Path | Role |
|------|------|
| `src/components/ui/image-auto-slider.tsx` | Cafés infinite scroll (props: `images[]`) |
| `src/components/ui/carousel-circular-image-gallery.tsx` | Circular gallery (GSAP + MotionPath, lucide arrows) |
| `src/components/ui/demo.tsx` / `gallery-demo.tsx` | Local previews |
| `src/data/gallery-images.ts` | **Auto-generated** from `assets/gallery/` by `build-site.mjs` |
| `src/cafes-island.tsx` / `src/gallery-island.tsx` | Embed entry points |
| `vite.island.config.ts` / `vite.gallery.config.ts` | Island build outputs |

## Commands

```bash
npm run dev          # Preview slider at http://localhost:5173
npm run build:island          # → assets/cafes-island/
npm run build:gallery-island # → assets/gallery-island/
npm run build:islands        # both
```

Then from site root:

```bash
node scripts/build-site.mjs
```

Serve the static site (`npx serve .`) and open **Home** — the cafés block auto-scrolls.

## Component API

**`ImageAutoSlider`**

- `images: string[]` (required) — public URLs; production uses `assets/cafes/cafe%20N.jpg`
- `durationSeconds?: number` — loop speed (default 28)
- `imageAltPrefix?: string`

No extra providers or hooks. No lucide icons in this block.

## Image assets

Cafe JPEGs live in **`../assets/cafes/`** (not copied into `frontend/`). The island bundle references them by URL so the static server serves one canonical folder.
