# Khatt Inc. (شركة خط للبرمجيات)

Static site for https://khatt-inc.github.io/ (GitHub Pages, organization showcase).

Khatt is a Cairo software studio building honest, privacy-first products: offline mesh messaging, private personal finance for Egypt, and grounded AI education.

## Pages

- **`/`** — Studio home: the three products, comparison table, principles, about, contact.
- **`/wasel/`** — **Wasel (وصل)**: offline mesh messenger for Android (Bluetooth Low Energy mesh, end-to-end encrypted).
- **`/wasel/privacy/`** — Wasel privacy policy. *Registered in Google Play Console and linked inside the app: keep this URL stable.*
- **`/wasel/child-safety/`** — Wasel child safety standards. *Also registered with Google Play: keep stable.*
- **`/rasid/`** — **Rasid (رصيد)**: private money tracker for Egypt on Android, with the direct APK download (`downloads/rasid-release.apk`, SHA-256 shown on the page).
- **`/rasid/privacy/`** — Rasid privacy policy.
- **`/ed-ai/`** — **Khatt ED-AI (خط للتعليم الذكي)**: AI-native workspace for teachers, students and parents in Egypt (pilot stage).
- **`/ed-ai/privacy/`** — Khatt ED-AI pilot privacy policy.

## Design system

`assets/css/style.css` is the single stylesheet.

- Concept, "The Line": khatt (خط) means line. Ink line on warm paper with a vermilion seal; light theme by default, dark theme follows the system (toggle stored locally).
- The line system: a `.spine` (SVG, filled as you scroll, with a `.pen` nib riding its tip) runs down every page inside `.trail`; each section's `.wrap` starts with a `.node` the spine passes; each product has a `.fig` (Wasel = mesh of hops, Rasid = balance beam, ED-AI = ruled notebook) that draws itself; a `.seal` is stamped on the footer edge. Keep the `.trail` / `.spine` markup in sync when editing pages. JS only sets SVG attributes, classes and the `--prog` custom property via CSSOM (never `style=""` markup), so the CSP holds.
- Motion lives in the "Motion" block of `style.css`: hero choreography, Arabic "pen-write" wipes, staggered scroll reveals, hover fills, scroll-driven parallax (`animation-timeline`, progressive), cross-page `@view-transition`, animated mobile menu. Everything sits behind `prefers-reduced-motion: no-preference`; the reduce block shows the final state.
- Type: Fraunces (display serif), Aref Ruqaa (Arabic display), Figtree (UI), Readex Pro (Arabic UI), JetBrains Mono (labels); all self-hosted under the SIL OFL.
- Products are colour-coded with `data-product="wasel|rasid|edai"` on the page body or a section; the accent is the `--p` token.
- Shared header and footer markup is duplicated in every page (no build step); keep them in sync when editing.
- Bump the `?v=` query on `style.css` / `main.js` links when you change those files.

## Privacy and security standards

- No third-party trackers, no third-party requests.
- Strict CSP (`default-src 'self'`): no inline styles or scripts.
- No build step: semantic HTML, CSS custom properties, a little vanilla JavaScript.

## Local preview

```bash
python3 -m http.server 8080
# http://localhost:8080
```
