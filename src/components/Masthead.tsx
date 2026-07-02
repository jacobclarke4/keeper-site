import { useEffect, useState } from "react";
import { ALL_SECTIONS, BASE_URL, NAV_SECTIONS, SECTION_IDS, scrollToId, scrollTop } from "../lib/nav";
import { LINKS } from "../lib/links";
import { useScrollSpy } from "../lib/motion";
import { Wordmark, WORDMARK } from "./Wordmark";

const MONOGRAM = `${BASE_URL}toc-icon.svg`;

export function Masthead() {
  const [condensed, setCondensed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);

  // Scroll: condense the masthead + fill the brand rule with reading progress.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.scrollY;
      setCondensed(y > 40);
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

  const goSection = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  const goHome = () => {
    setOpen(false);
    scrollTop();
  };

  return (
    <header className={`mast${condensed ? " is-condensed" : ""}${open ? " is-open" : ""}`}>
      <div className="mast__bar">
        <button type="button" className="mast__brand" onClick={goHome} aria-label="The Outcome Company — home">
          <Wordmark {...WORDMARK} className="mast__wordmark" />
          <img className="mast__monogram" src={MONOGRAM} alt="" />
          <span className="mast__running mono" aria-hidden="true">
            — THE OUTCOME COMPANY
          </span>
        </button>

        <nav className="mast__links" aria-label="Primary">
          {NAV_SECTIONS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => goSection(item.id)}
              className={`mast__link${active === item.id ? " is-active" : ""}`}
              aria-current={active === item.id ? "true" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mast__cta">
          <a className="mast__login" href={LINKS.login}>Log in</a>
          <a className="btn btn--accent btn--sm" href={LINKS.getStarted}>
            <span className="btn__label">Get started <span className="arrow" aria-hidden="true">→</span></span>
          </a>
        </div>

        <button
          className="mast__burger"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
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
        <div className="contents" role="dialog" aria-label="Menu">
          <div className="contents__head mono">CONTENTS — THE OUTCOME COMPANY</div>
          <nav className="contents__list" aria-label="Sections">
            {ALL_SECTIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`contents__entry${active === item.id ? " is-active" : ""}`}
                aria-current={active === item.id ? "true" : undefined}
                onClick={() => goSection(item.id)}
              >
                <span className="contents__body">
                  <span className="contents__title display">{item.label}</span>
                </span>
              </button>
            ))}
          </nav>
          <div className="contents__cta">
            <a className="btn btn--accent btn--lg btn--block" href={LINKS.getStarted}>
              <span className="btn__label">Get started — $14/mo <span className="arrow" aria-hidden="true">→</span></span>
            </a>
            <a className="btn btn--ghost btn--lg btn--block contents__login" href={LINKS.login}>
              <span className="btn__label">Log in</span>
            </a>
            <p className="contents__imprint mono">THE OUTCOME COMPANY · A COMMONWEALTH COMPANY</p>
          </div>
        </div>
      )}
    </header>
  );
}
