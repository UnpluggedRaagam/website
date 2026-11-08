# Event photos

Drop your jam and singalong images here (JPEG or WebP, roughly 1200px wide).

Then update `gallery.html` and the moodboard `img` tags:

- Replace Unsplash URLs with paths like `assets/photos/your-file.jpg`
- Keep `width` and `height` matching each image’s aspect ratio
- Add credits in [CREDITS.md](../CREDITS.md)

Rebuild pages after editing the source template:

```bash
node scripts/build-site.mjs
```

Edit [index.softlife.source.html](../index.softlife.source.html) only if you need structural changes; the build script applies Unplugged Raagam branding on top.
