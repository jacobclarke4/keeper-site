import { useEffect, useState } from "react";
import { BASE_URL, EDITIONS, PAGES, type NavFn, type PageId } from "../lib/nav";

const LOGO_LIGHT = `${BASE_URL}TOC%203.svg`;
const MONOGRAM = `${BASE_URL}toc-icon.svg`;

// Every edition listed in the mobile CONTENTS index.
const CONTENTS: PageId[] = ["home", "users", "concierges"];
const CONTENTS_TITLES: Record<string, string> = {
  home: "Home",
  users: "Membership",
  concierges: "For Concierges",
};

export function Masthead({ page, nav }: { page: PageId; nav: NavFn }) {
  const [condensed, setCondensed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  // Scroll: condense the masthead + fill the brand rule with reading progress.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.scrollY;
      setCondensed(y > 56);
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, y / total) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Lock the page while the CONTENTS index is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (p: Parameters<NavFn>[0]) => {
    setOpen(false);
    nav(p);
  };

  const ed = EDITIONS[page];

  return (
    <header className={`mast${condensed ? " is-condensed" : ""}${open ? " is-open" : ""}`}>
      <div className="mast__bar">
        <button type="button" className="mast__brand" onClick={() => go("home")} aria-label="The Outcome Company — home">
          <img className="mast__wordmark" src={LOGO_LIGHT} alt="" />
          <img className="mast__monogram" src={MONOGRAM} alt="" />
          <span className="mast__running mono" aria-hidden="true">
            — {ed.head} · FOLIO {ed.folio}
          </span>
        </button>

        <nav className="mast__links" aria-label="Primary">
          {PAGES.map((p, i) => (
            <button
              type="button"
              key={p.id}
              onClick={() => go(p.id)}
              className={`mast__link${page === p.id ? " is-active" : ""}`}
              aria-current={page === p.id ? "page" : undefined}
            >
              <span className="mast__tick mono">{String(i + 1).padStart(2, "0")}</span>
              {p.label}
            </button>
          ))}
        </nav>

        <div className="mast__cta">
          <button className="btn btn--accent btn--sm" onClick={() => go("waitlist")}>
            <span className="btn__label">Join Waitlist <span className="arrow" aria-hidden="true">→</span></span>
          </button>
        </div>

        <button
          className="mast__burger"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close contents" : "Open contents"}
          aria-expanded={open}
        >
          <span className={open ? "is-open" : ""} />
          <span className={open ? "is-open" : ""} />
          <span className={open ? "is-open" : ""} />
        </button>
      </div>

      {/* the brand rule: hairline that doubles as reading progress */}
      <div className="mast__rule" aria-hidden="true">
        <span className="mast__progress" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {open && (
        <div className="contents" role="dialog" aria-label="Contents">
          <div className="contents__head mono">CONTENTS — INDEX OF EDITIONS</div>
          <nav className="contents__list" aria-label="All pages">
            {CONTENTS.map((id) => (
              <button
                type="button"
                key={id}
                className={`contents__entry${page === id ? " is-active" : ""}`}
                onClick={() => go(id)}
                aria-current={page === id ? "page" : undefined}
              >
                <span className="contents__body">
                  <span className="contents__title display">{CONTENTS_TITLES[id]}</span>
                  <span className="contents__sub">— {EDITIONS[id].subtitle}</span>
                </span>
                <span className="contents__dots" aria-hidden="true" />
                <span className="contents__folio mono">{EDITIONS[id].folio}</span>
              </button>
            ))}
          </nav>
          <div className="contents__cta">
            <button className="btn btn--accent btn--lg btn--block" onClick={() => go("waitlist")}>
              <span className="btn__label">Join the Waitlist <span className="arrow" aria-hidden="true">→</span></span>
            </button>
            <p className="contents__imprint mono">THE OUTCOME COMPANY · A COMMONWEALTH COMPANY</p>
          </div>
        </div>
      )}
    </header>
  );
}
