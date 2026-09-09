# TODO

Open items from the Keeper rebrand (2026-09-09). Codebase carried over from
outcome-os/outcome-site, the live outcomeco.ai front page.

## Still pointing at The Outcome Company

- [ ] **Google Analytics.** `index.html` still loads TOC's gtag property (`G-TLGP2Z4EGR`). Replace with a Keeper measurement ID, or remove the tag.
- [ ] **App links.** "Get started" and "Log in" go to `https://app.outcomeco.ai/` (`LINKS` in `src/lib/links.ts`). Point at Keeper's app when it exists.
- [ ] **Sister-site placeholders.** `maker`, `learning`, and `audit` in `src/lib/links.ts` are TBD `theoutcome.ai` subdomains. Update or drop.
- [ ] **Logo mark.** The favicon (`public/toc-icon.svg`), the masthead monogram, and every panel shape are cut from TOC's calligraphic "O". Decide on a Keeper mark and swap the path in `src/components/primitives.tsx`.
- [ ] **Social card.** `public/og.png` is the TOC card. Regenerate for Keeper.
- [ ] **Commonwealth.** Copy, footer, and structured data still say Keeper is a Commonwealth company. Confirm that's still true.

## Ship

- [x] Pushed to `jacobclarke4/keeper-site`.
- [x] Pages enabled with the GitHub Actions source; live at https://jacobclarke4.github.io/keeper-site/.
- [ ] Once a Keeper domain exists: add `public/CNAME`, build with `VITE_BASE=/`, and replace `https://jacobclarke4.github.io/keeper-site/` in `index.html`, `public/sitemap.xml`, and `public/robots.txt`.
