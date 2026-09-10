import { useEffect, useState } from "react";
import { ALL_SECTIONS, NAV_SECTIONS, SECTION_IDS, scrollToId, scrollTop } from "../lib/nav";
import { LINKS } from "../lib/links";
import { useScrollSpy } from "../lib/motion";
import { Wordmark, WORDMARK } from "./Wordmark";

export function Masthead() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);

  // Scroll: condense the nav capsule once the page has moved.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.scrollY;
      setCondensed(y > 40);
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

  // Lock the page while the mobile sheet is open.
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
      {/* A progressive blur behind the bar (the Google Labs header): five
          stacked backdrop blurs, each stronger than the last and each masked
          to its own band, heaviest at the top edge and easing off below. */}
      <div className="mast__blur" aria-hidden="true">
        <span className="mast__blur-layer mast__blur-layer--1" />
        <span className="mast__blur-layer mast__blur-layer--2" />
        <span className="mast__blur-layer mast__blur-layer--3" />
        <span className="mast__blur-layer mast__blur-layer--4" />
        <span className="mast__blur-layer mast__blur-layer--5" />
      </div>
      <div className="mast__capsule">
        <button type="button" className="mast__brand" onClick={goHome} aria-label="Keeper — home">
          <Wordmark {...WORDMARK} className="mast__wordmark" />
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

      {open && (
        <div className="sheet" role="dialog" aria-label="Menu">
          <nav className="sheet__list" aria-label="Sections">
            {ALL_SECTIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`sheet__row${active === item.id ? " is-active" : ""}`}
                aria-current={active === item.id ? "true" : undefined}
                onClick={() => goSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sheet__cta">
            <a className="btn btn--accent btn--lg btn--block" href={LINKS.getStarted}>
              <span className="btn__label">Get started: $14/mo <span className="arrow" aria-hidden="true">→</span></span>
            </a>
            <a className="btn btn--ghost btn--lg btn--block sheet__login" href={LINKS.login}>
              <span className="btn__label">Log in</span>
            </a>
            <p className="sheet__imprint">A Commonwealth Company</p>
          </div>
        </div>
      )}
    </header>
  );
}
