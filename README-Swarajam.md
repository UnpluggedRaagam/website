# Unplugged Raagam — Telugu singalong & jamming site

Static multi-page site based on the free MIT [8B Softlife community template](https://8b.com/templates/softlife/) (via [21st.dev](https://21st.dev)).

## Pages

| File | Purpose |
|------|---------|
| [index.html](index.html) | Home, spirit, host note (contact/RSVP in footer only) |
| [gallery.html](gallery.html) | Photo moodboard (16 slots) |

## Colors (one place)

Edit **[assets/palette.css](assets/palette.css)** — see [assets/PALETTE.md](assets/PALETTE.md). Both HTML pages link this file.

## Local preview

Open any `.html` file in a browser, or serve the folder:

```bash
npx --yes serve .
```

## Customize

1. **Contact** — Update email, phone, and address in the footer section of `scripts/build-site.mjs` (`joinFooterPatched`), then run `node scripts/build-site.mjs`.
3. **Photos** — See [assets/photos/README.md](assets/photos/README.md).
4. **Colours** — Edit `assets/palette.css` only (see `assets/PALETTE.md`).

## Source

- Template source snapshot: `index.softlife.source.html`
- Regenerate all pages: `node scripts/build-site.mjs`
- Original agent notes: [AGENTS.md](AGENTS.md)

## License

MIT (template code). Demo photos remain under the [Unsplash License](https://unsplash.com/license) until you replace them.
