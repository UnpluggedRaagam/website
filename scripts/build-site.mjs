import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'index.softlife.source.html');
if (!fs.existsSync(sourcePath)) {
  fs.copyFileSync(path.join(root, 'index.html'), sourcePath);
}
const src = fs.readFileSync(sourcePath, 'utf8');

const headEnd = src.indexOf('</head>');
const mainStart = src.indexOf('<main id="main">');
const mainEnd = src.indexOf('</main>');
const bodyEnd = src.indexOf('</body>');
const scriptsStart = src.indexOf('<script data-8b-part="section-script:nav">');

const head = src.slice(0, headEnd + 7);
const scripts = src
  .slice(scriptsStart, bodyEnd)
  .replace(/<script data-8b-part="section-script:contact">[\s\S]*?<\/script>\s*/i, '');
const footerBlock = src.slice(src.indexOf('<footer'), scriptsStart);
const main = src.slice(mainStart, mainEnd + 7);

const sectionRe = /<!-- [\s\S]*? -->\n<section[\s\S]*?<\/section>\n/g;
const sections = [...main.matchAll(sectionRe)].map((m) => m[0]);
const byId = (id) => {
  const hit = sections.find((s) => s.includes(`id="${id}"`));
  if (!hit) throw new Error(`Missing section ${id}`);
  return hit;
};

const LOGO = 'assets/logo.png';
const HOST_LASYA = 'assets/photos/lasya.jpg';
const HOST_PRANIDHI = 'assets/photos/pranidhi.jpg';
const CONTACT_EMAIL = 'unpluggedraagam@gmail.com';
const PHONE_NUMBERS = ['9550307874', '9493100909'];
const PHONE_FOOTER_LINKS = PHONE_NUMBERS.map(
  (n) => `<li><a class="m-link" href="tel:+91${n}">${n}</a></li>`
).join('\n        ');
const PHONE_CALL_BLOCK = PHONE_NUMBERS.map(
  (n) => `<a class="m-link" href="tel:+91${n}">${n}</a>`
).join('<br>');

const COMMUNITY_PITCH =
  'A safe and judgement free singalong and jamming community for singers of all levels. Bring your voice, a favourite line, or just listen—lyrics on screen, tea on the side, no audition.';

const CAFES_DIR = path.join(root, 'assets', 'cafes');
const cafeImageFiles = fs.existsSync(CAFES_DIR)
  ? fs
      .readdirSync(CAFES_DIR)
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort((a, b) => {
        const na = Number.parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
        const nb = Number.parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
        return na - nb || a.localeCompare(b);
      })
  : [];

const cafesIslandJs = path.join(root, 'assets', 'cafes-island', 'cafes-island.js');
const cafesIslandCss = path.join(root, 'assets', 'cafes-island', 'cafes-island.css');
const hasCafesIsland = fs.existsSync(cafesIslandJs) && fs.existsSync(cafesIslandCss);

const cafesSection =
  cafeImageFiles.length > 0 && hasCafesIsland
    ? `<!-- cafes: React infinite slider (frontend/src/components/ui/image-auto-slider.tsx) -->
<div id="cafes-root"></div>
<link rel="stylesheet" href="assets/cafes-island/cafes-island.css">
<script type="module" src="assets/cafes-island/cafes-island.js"></script>
`
    : cafeImageFiles.length > 0
      ? `<!-- cafes: build the React island — cd frontend && npm run build:island -->
<section id="cafes" class="cafes-carousel" aria-labelledby="cafes-title-fallback">
  <p class="m-text-6" style="padding:2rem;text-align:center">Cafe gallery loading: run <code>npm run build:island</code> in <code>frontend/</code>, then <code>node scripts/build-site.mjs</code>.</p>
</section>
`
      : '';

const NAV = `<!-- navigation -->
<header id="nav" data-8b-section="navigation">
  <div class="nav__bar">
    <a class="nav__logo nav__logo--img" href="index.html"><img src="${LOGO}" alt="Unplugged Raagam" width="320" height="320" decoding="async"></a>
    <nav aria-label="Main">
      <ul class="nav__links">
        <li><a class="m-link-2" href="index.html">Home</a></li>
        <li><a class="m-link-2" href="gallery.html">Gallery</a></li>
      </ul>
    </nav>
    <button class="m-icon-btn nav__toggle" type="button" aria-expanded="false" aria-controls="menu"><span class="u-sr">Open menu</span><span class="m-icon-btn__glyph" aria-hidden="true"></span></button>
  </div>
  <div class="menu" id="menu" hidden role="dialog" aria-modal="true" aria-label="Menu">
    <div class="menu__top">
      <a class="nav__logo nav__logo--img" href="index.html"><img src="${LOGO}" alt="Unplugged Raagam" width="320" height="320" decoding="async"></a>
      <button class="m-icon-btn menu__close" type="button"><span class="u-sr">Close menu</span><span class="m-icon-btn__glyph" aria-hidden="true"></span></button>
    </div>
    <ul class="menu__links">
      <li><a href="index.html">Home</a></li>
      <li><a href="gallery.html">Gallery</a></li>
    </ul>
  </div>
</header>
`;

function patchHead(headHtml, { title, description }) {
  let h = headHtml;
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  h = h.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${description}">`
  );
  h = h.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${title}">`
  );
  h = h.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${description}">`
  );
  h = h.replace(
    /<meta name="twitter:card" content="summary_large_image">/,
    `<meta name="twitter:card" content="summary">`
  );

  if (!h.includes('assets/palette.css')) {
    h = h.replace(
      /<meta charset="utf-8">\n/,
      `<meta charset="utf-8">\n<link rel="stylesheet" href="assets/palette.css">\n<link rel="stylesheet" href="assets/brand.css">\n`
    );
  } else if (!h.includes('assets/brand.css')) {
    h = h.replace(
      /(<link rel="stylesheet" href="assets\/palette\.css">\n)/,
      `$1<link rel="stylesheet" href="assets/brand.css">\n`
    );
  }

  h = h.replace(
    /\s*--color-1:[^;]+;\s*\n\s*--color-2:[^;]+;\s*\n\s*--color-3:[^;]+;\s*\n\s*--color-4:[^;]+;\s*\n\s*--color-5:[^;]+;\s*\n\s*--color-6:[^;]+;\s*\n\s*--color-7:[^;]+;\s*\n\s*--color-8:[^;]+;\s*/,
    '\n  /* colors: see assets/palette.css */\n  '
  );

  h = h.replace(
    /<link rel="icon" href="[^"]+"[^>]*>/,
    `<link rel="icon" href="${LOGO}" type="image/png">`
  );
  h = h.replace(
    /content="https:\/\/your-domain\.example\/preview\.png"/,
    `content="${LOGO}"`
  );

  return h;
}

const GALLERY_DIR = path.join(root, 'assets', 'gallery');
const galleryImageFiles = fs.existsSync(GALLERY_DIR)
  ? fs
      .readdirSync(GALLERY_DIR)
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort((a, b) => {
        if (a === 'address.jpg') return -1;
        if (b === 'address.jpg') return 1;
        const na = Number.parseInt(a.match(/\d+/)?.[0] ?? '0', 10);
        const nb = Number.parseInt(b.match(/\d+/)?.[0] ?? '0', 10);
        return na - nb || a.localeCompare(b);
      })
  : [];

function galleryPublicUrl(filename) {
  return `assets/gallery/${filename.replace(/ /g, '%20')}`;
}

function galleryImageTitle(filename) {
  if (filename === 'address.jpg') return 'Venue';
  const m = filename.match(/\((\d+)\)/);
  return m ? `Event moment ${m[1]}` : filename.replace(/\.[^.]+$/, '');
}

const galleryManifest = galleryImageFiles.map((file) => ({
  title: galleryImageTitle(file),
  url: galleryPublicUrl(file),
}));

const galleryImagesTsPath = path.join(root, 'frontend', 'src', 'data', 'gallery-images.ts');
if (galleryImageFiles.length > 0) {
  const tsBody = `/** Auto-generated by scripts/build-site.mjs — do not edit by hand */\nexport const galleryImages = ${JSON.stringify(galleryManifest, null, 2)} as const;\n`;
  fs.mkdirSync(path.dirname(galleryImagesTsPath), { recursive: true });
  fs.writeFileSync(galleryImagesTsPath, tsBody, 'utf8');
}

const galleryIslandJs = path.join(root, 'assets', 'gallery-island', 'gallery-island.js');
const galleryIslandCss = path.join(root, 'assets', 'gallery-island', 'gallery-island.css');
const hasGalleryIsland = fs.existsSync(galleryIslandJs) && fs.existsSync(galleryIslandCss);

const gallerySection = hasGalleryIsland
  ? `<!-- gallery: circular GSAP carousel (frontend/src/components/ui/carousel-circular-image-gallery.tsx) -->
<div id="gallery-root"></div>
<link rel="stylesheet" href="assets/gallery-island/gallery-island.css">
<script type="module" src="assets/gallery-island/gallery-island.js"></script>
`
  : galleryImageFiles.length > 0
    ? `<!-- gallery: run npm run build:gallery-island in frontend/ -->
<section id="board" data-8b-section="board">
  <p class="m-text-6" style="padding:2rem;text-align:center">Gallery: run <code>npm run build:gallery-island</code> in <code>frontend/</code>, then rebuild the site.</p>
</section>
`
    : byId('board');

const meta = {
  index: {
    title: 'Unplugged Raagam — Telugu singalong & jamming community',
    description:
      'A judgement-free Telugu singalong and jamming community for all levels. 20+ events. Lyrics on screen, no audition. Follow for the next night.',
  },
  gallery: {
    title: 'Gallery — Unplugged Raagam',
    description: 'Photos from 20+ Unplugged Raagam singalongs and jam nights.',
  },
};

const heroBgUrls = galleryImageFiles.map((file) => galleryPublicUrl(file));
const heroBgDurationSec = Math.max(heroBgUrls.length * 5, 30);
const heroBgTrackImgs =
  heroBgUrls.length > 0
    ? [...heroBgUrls, ...heroBgUrls]
        .map(
          (url) =>
            `      <img src="${url}" alt="" width="1920" height="1080" decoding="async" loading="lazy" draggable="false">`
        )
        .join('\n')
    : '';
const heroBgMarkup =
  heroBgUrls.length > 0
    ? `<div class="hero__bg-slideshow" aria-hidden="true" style="--hero-bg-duration: ${heroBgDurationSec}s">
    <div class="hero__bg-track">
${heroBgTrackImgs}
    </div>
  </div>
  `
    : '';

const homeHero = byId('hero')
  .replace(
    /<section id="hero" data-8b-section="hero">\n/,
    `<section id="hero" data-8b-section="hero">\n  ${heroBgMarkup}`
  )
  .replace(
    /<h1 class="hero__mark">[\s\S]*?<\/h1>/,
    `<h1 class="hero__mark hero__mark--logo"><span class="u-sr">Unplugged Raagam</span><img class="hero__logo-img" src="${LOGO}" alt="" width="640" height="640" fetchpriority="high" decoding="async" aria-hidden="true"></h1>`
  )
  .replace(
    /<p class="hero__tag m-text-3">[\s\S]*?<\/p>/,
    `<p class="hero__tag m-text-3"><span>తె</span><span class="hero__tag-line" aria-hidden="true"></span><span class="hero__tag-text">Telugu singalong &amp; jamming community</span><span class="hero__tag-line" aria-hidden="true"></span><span>లు</span></p>`
  )
  .replace(/<p class="m-text-6">[\s\S]*?<\/p>\s*/, '')
  .replace(
    `<a class="m-btn" href="#membership"><span class="m-btn__label">Become a member</span></a>`,
    `<a class="m-btn" href="gallery.html"><span class="m-btn__label">See the gallery</span></a>`
  )
  .replace(`<a class="m-link" href="#week">See the week</a>`, '')
  .replace(/<figure class="hero__photo">[\s\S]*?<\/figure>\s*/, '');

const homeManifesto = byId('manifesto')
  .replace('The softlife principle', 'The Unplugged Raagam spirit')
  .replace(/We think the good life[\s\S]*?together\./, COMMUNITY_PITCH)
  .replace(
    /Founded in 2019[\s\S]*?still the point\./,
    `Lasya and Pranidhi founded Unplugged Raagam and have hosted <b>20+ events</b> with a community that keeps growing.`
  )
  .replace(`href="#letter">Read Margot's note`, `href="#letter">Read our hosts' note`);

const homeLetter = byId('letter')
  .replace(/Rest <b>responsibly\.<\/b>/, 'Sing <b>together.</b>')
  .replace(
    /<div class="letter__layout">[\s\S]*(?=<p class="letter__motto)/,
    `<div class="letter__layout letter__layout--hosts">
    <div class="letter__portrait letter__portrait--l m-arch"><img src="${HOST_LASYA}" alt="Lasya, co-host of Unplugged Raagam" width="1200" height="1600" loading="lazy" decoding="async"></div>
    <div class="letter__sheet m-surface-4">
      <h2 class="m-text-2" data-8b-motion="embolden">Dear <b data-8b-split="words">singer,</b></h2>
      <div class="letter__body">
        <p>We are Lasya and Pranidhi, hosts and founders of Unplugged Raagam. We are a team of two who are passionate about music and want to create a safe and judgement free space for singers to perform and sing along.</p>
        <p>We have successfully hosted more than 20 events to date and have a strong community of singers who sing together and jam after.</p>
        <p>We are always looking for new singers to join our community and perform with us. We are also looking for new venues to host our events.</p>
      </div>
      <div class="letter__sign">
        <p class="m-text-3">Lasya and Pranidhi · Hosts &amp; founders</p>
      </div>
    </div>
    <div class="letter__portrait letter__portrait--r m-arch"><img src="${HOST_PRANIDHI}" alt="Pranidhi, co-host of Unplugged Raagam" width="1200" height="1600" loading="lazy" decoding="async"></div>
  </div>
  `
  );

const homeContact = byId('contact')
  .replace(
    /<img src="[^"]*" alt="[^"]*"[^>]*>/,
    '<img src="assets/gallery/address.jpg" alt="Unplugged Raagam event venue" width="1200" height="1600" loading="lazy" decoding="async">'
  )
  .replace(
    /<h2 class="m-text-2"[^>]*>[\s\S]*?<\/h2>/,
    '<h2 class="m-text-2" data-8b-motion="embolden">Get in <b data-8b-split="words">touch</b></h2>'
  )
  .replace(
    /<div class="contact__details">[\s\S]*?<\/div>\s*(?=<form)/,
    `<div class="contact__details">
        <div>
          <h3 class="m-text-3">Venue</h3>
          <p>Next venue announced on Instagram.</p>
        </div>
        <div>
          <h3 class="m-text-3">Write</h3>
          <p><a class="m-link" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
        </div>
        <div>
          <h3 class="m-text-3">Call</h3>
          <p>${PHONE_CALL_BLOCK}</p>
        </div>
        <div>
          <h3 class="m-text-3">Follow</h3>
          <p><a class="m-link" href="https://www.instagram.com/unplugged.raagam/" target="_blank" rel="noopener">Instagram</a><br><a class="m-link" href="https://www.youtube.com/@UnpluggedRaagam" target="_blank" rel="noopener">YouTube</a></p>
        </div>
      </div>
      `
  )
  .replace(/<form[\s\S]*?<\/form>\s*/i, '');

const joinFooterPatched = footerBlock
  .replace(
    /© 2026 softlife Society Ltd\.[\s\S]*?London\./,
    '© 2026 Unplugged Raagam. Telugu singalong & jamming.'
  )
  .replace(/soft<b data-8b-split="words">life<\/b>/, 'Unplugged <b data-8b-split="words">Raagam</b>')
  .replace(/style="--len:8"/, 'style="--len:17"')
  .replace(/hello@softlife\.example/gi, 'unpluggedraagam@gmail.com')
  .replace(
    /<h2 class="m-text-3">Visit<\/h2>\s*<p>14 Linden Row<br>London W11 2QP<\/p>/,
    '<h2 class="m-text-3">Visit</h2>\n      <p>Next venue announced on Instagram.</p>'
  )
  .replace(
    /<h2 class="m-text-3">Hours<\/h2>\s*<p>Mon–Fri 7:30–23:00<br>Sat–Sun 9:00–23:00<\/p>/,
    '<h2 class="m-text-3">Hours</h2>\n      <p>Event dates &amp; venues — follow us on Instagram.</p>'
  )
  .replace(
    /<li><a data-8b-placeholder="phone"[^>]*>[\s\S]*?<\/a><\/li>\s*/i,
    `${PHONE_FOOTER_LINKS}\n        `
  )
  .replace(/href="#journal"/g, 'href="gallery.html"')
  .replace(/>The journal</, '>Gallery<')
  .replace(
    /href="https:\/\/instagram\.com\/"/g,
    'href="https://www.instagram.com/unplugged.raagam/"'
  )
  .replace(
    /<li><a data-8b-placeholder="social" class="m-link" href="https:\/\/www\.instagram\.com\/unplugged\.raagam\/">Instagram<\/a><\/li>/,
    `<li><a class="m-link" href="https://www.instagram.com/unplugged.raagam/" target="_blank" rel="noopener">Instagram</a></li>
        <li><a class="m-link" href="https://www.youtube.com/@UnpluggedRaagam" target="_blank" rel="noopener">YouTube</a></li>`
  )
  .replace(
    /<li><a class="m-link" href="#contact">Newsletter<\/a><\/li>/,
    ''
  )
  .replace(/\bsoftlife\b/gi, 'Unplugged Raagam');

function pageWithFooter(headHtml, bodySections, footer, opts) {
  const h = patchHead(headHtml, opts);
  return `${h}
<body class="m-text">
<a class="u-skip m-link-2" href="#main">Skip to content</a>
${NAV}
<main id="main">
${bodySections.join('\n')}
</main>
${footer}
${scripts}
</body>
</html>
`;
}

const footerHome = joinFooterPatched;

const homeSections = [homeHero, homeManifesto, homeLetter];
if (cafesSection) homeSections.push(cafesSection);
homeSections.push(homeContact);

const indexHtml = pageWithFooter(head, homeSections, footerHome, meta.index);
fs.writeFileSync(path.join(root, 'index.html'), indexHtml, 'utf8');
fs.writeFileSync(
  path.join(root, 'gallery.html'),
  pageWithFooter(head, [gallerySection], footerHome, meta.gallery),
  'utf8'
);

for (const name of ['index.html', 'gallery.html']) {
  const p = path.join(root, name);
  let html = fs.readFileSync(p, 'utf8');
  html = html
    .replace(/hello@softlife\.example/gi, 'unpluggedraagam@gmail.com')
    .replace(/hello@swarajam\.example/gi, 'unpluggedraagam@gmail.com');
  fs.writeFileSync(p, html, 'utf8');
}

for (const removed of ['sessions.html', 'join.html']) {
  const p = path.join(root, removed);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

console.log('Built index.html, gallery.html (colors: assets/palette.css)');
