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

## Product gap the site is now ahead of

- [ ] **Workers' comp, ERISA appeals, and grievances do not exist in the app yet.** The site promises all three. the-outcome-company-app has the machinery (plain-language intake, clarifying questions, letter drafting with statute citations, "review before sending" drafts, certified mail via Lob, Sam concierge, human escalation, ten languages) and nearby outcomes (`wage_theft_recovery`, `workplace_issue` with an FMLA path, `appeal_anything`, an ERISA-citing insurance appeal template), but no workers' comp product, no grievance/arbitration/just-cause flow, and no ERISA pension/disability appeal product. Build those before launch, or soften the catalog.
- [ ] **One viewport per section**: on phones and tablets some copy is hidden to fit (step descriptions on phones, plan blurbs on non-featured tiers, the hero notes, the catalog intro). Confirm that is the intended trade.

## Assets to drop in

- [x] **Assistant portraits** are in `public/portraits/` (Camille is the French `Untitled-2.webp`).
- [ ] **The hero phone mirrors the app's rebuild-ui branch** (member pill, case deck card, badge/chip system, road strip, member capsule, `.pw` portrait). When those components change in the-outcome-company-app, this mock will drift; it is hand-copied CSS, not shared code.

## Ship

- [x] Pushed to `jacobclarke4/keeper-site`.
- [x] Pages enabled with the GitHub Actions source; live at https://jacobclarke4.github.io/keeper-site/.
- [ ] Once a Keeper domain exists: add `public/CNAME`, build with `VITE_BASE=/`, and replace `https://jacobclarke4.github.io/keeper-site/` in `index.html`, `public/sitemap.xml`, and `public/robots.txt`.
