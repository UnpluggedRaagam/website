# Unplugged Raagam color palette

All pages load **[palette.css](./palette.css)**. Change colors there once; both `index.html` and `gallery.html` update on refresh.

## Logo source

Colors are matched to **`assets/logo.png`** (Unplugged Raagam). Logo file: maroon arch, terracotta & peach figures, black backdrop inside the artwork.

## Quick reference

| Token | Role | Default |
|-------|------|---------|
| `--sj-canvas` | Page background | `#faf3ed` |
| `--sj-ink` | Body text | `#3d1414` |
| `--sj-primary` | Headings, buttons, nav accent | `#a35f4d` |
| `--sj-terracotta-dark` | Hover / emphasis | `#8e5448` |
| `--sj-maroon` / deep | Manifesto ground | `#3d1414` / `#2d0a0a` |
| `--sj-panel` | Sand panels | `#e8c4b4` |
| `--sj-blush` | Peach panels | `#f0d5c8` |
| `--sj-mist` | Chips, stripes | `#f3e0d6` |
| `--sj-linen` | Photo backing | `#efe6de` |

The 8B template reads `--color-1` … `--color-8`; those are **aliases** to the `--sj-*` tokens in `palette.css`. Do not delete the `--color-*` lines unless you also update the inline CSS in the HTML.

## Favicon

After changing `--sj-gold` or `--sj-canvas`, rerun the build so the favicon data-URL matches:

```bash
node scripts/build-site.mjs
```

## JSON mirror

[ palette.json](./palette.json) duplicates the same values for design tools or documentation.
