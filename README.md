# Keeper site

Marketing site for Keeper. React 19 + TypeScript + Vite 7, Tailwind 4, Lenis
smooth scroll, with a post-build Playwright prerender so crawlers get full HTML.

## Develop

```sh
npm install
npx playwright install chromium   # once, for the prerender step
npm run dev
```

## Build

```sh
npm run build     # tsc -b && vite build, then scripts/prerender.mjs bakes dist/index.html + 404.html
npm run preview
```

## Deploy

Pushes to `main` build and publish `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`. The site is served under `/keeper-site/` by
default; set `VITE_BASE=/` and add `public/CNAME` when a custom domain is
attached, and update the absolute URLs in `index.html`, `public/sitemap.xml`,
and `public/robots.txt`.

## Layout

- `src/pages/Home.tsx`: the single long-scroll front page.
- `src/components/`: masthead, colophon, wordmark, and shared primitives.
- `src/lib/links.ts`: absolute URLs to the app and sister sites, in one place.
- `src/styles/`: design system split by layer (base, shell, home, pages, responsive).
