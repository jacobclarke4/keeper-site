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

## The page, after the 2026-09-12 outline

- [ ] **Mission statement** is a first draft: "Keeper keeps every deadline and every paper in your claim in one place, from the day you're hurt to the last check. You do the errands, we do the paperwork, and nothing slips." Tighten as you like in `src/lib/site.ts`.
- [ ] **The step counts** come from the app's own comp map (348 boxes, 78 decisions, 539 paths, 7 stations; the walk is 77 steps in 9 phases). The outline's "132 steps to 7 actions and 8 approvals" had no source, so the site uses the app's numbers.
- [ ] **The $1,000 guarantee.** The app calls it the "Keeper guarantee" and marks its terms as not final. The site says so in the fineprint. Right-size the amount per union when the stats exist.
- [x] **The bridges to the real world** (certified mail, notary, legal services, transportation) were removed from the site on 2026-09-12: they are the recipe, not the pitch.
- [ ] **The Challenge stats** are cited inline: BLS 2024 (2.5M injuries), RAND / DOL (about 45% never file), Lockton via Risk & Insurance (two-thirds of denials paid within a year; first denials up 20% in five years). Re-check before launch.
- [ ] **Services** are the app's portal items by name. Sub-trees (the five grievance kinds) are folded into one line.
- [ ] **No photography.** Stock photos and the scrolling ticker were removed on 2026-09-12 (the warehouse shot didn't land). If images come back, they need to be licence-free and should sit inside a section, not behind it.
- [ ] **The hero map loop** (draw, red road, collapse to one line, seven stations, the red walk) is timed in `src/components/CompMap.tsx` (`T` and `STATION_STAGGER`). Only the hero is 100vh; every other section sizes to its content (`src/styles/12-round.css`).

## Style

- [x] **The style guide (2026-09-11) is applied in `src/styles/15-guide.css`**: the app's card shadow on every card with no borders, the four radii, the eight type steps, charcoal primary buttons at 44px, pills at 36px in cards, the keyboard focus ring. The $14 price tag stays red on purpose: it is a price mark, not a control.
- [x] **Illinois and Indiana** are mentioned once, in the pricing fine print, and nowhere else.

## Assets to drop in

- [x] **Assistant portraits** are in `public/portraits/` (Camille is the French `Untitled-2.webp`).
- [ ] **The app shot (`src/components/AppShot.tsx`) and the phone mirror the app's rebuild-ui branch** (member pill, case deck card, badge/chip system, road strip, member capsule, `.pw` portrait). When those components change in the-outcome-company-app, this mock will drift; it is hand-copied CSS, not shared code.

## Ship

- [x] Pushed to `jacobclarke4/keeper-site`.
- [x] Pages enabled with the GitHub Actions source; live at https://jacobclarke4.github.io/keeper-site/.
- [ ] Once a Keeper domain exists: add `public/CNAME`, build with `VITE_BASE=/`, and replace `https://jacobclarke4.github.io/keeper-site/` in `index.html`, `public/sitemap.xml`, and `public/robots.txt`.
