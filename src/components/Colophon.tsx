import { scrollToId, scrollTop } from "../lib/nav";
import { OUTCOMES_TICKER } from "../lib/outcomes";
import { LINKS, goExternal } from "../lib/links";
import { Seal, Btn, Arrow } from "./primitives";
import { Wordmark, WORDMARK } from "./Wordmark";

export function Colophon() {
  const year = new Date().getFullYear();
  const col = (title: string, items: { label: string; onClick?: () => void }[]) => (
    <div className="colophon__col">
      <h5 className="mono">{title}</h5>
      <ul>
        {items.map((it) => (
          <li key={it.label}>
            {it.onClick ? (
              <button type="button" onClick={it.onClick}>{it.label}</button>
            ) : (
              <span>{it.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="colophon">
      {/* the wire ribbon — every outcome, in passing */}
      <div className="ribbon" aria-hidden="true">
        <div className="ribbon__track">
          {[...OUTCOMES_TICKER, ...OUTCOMES_TICKER].map((t, i) => (
            <span className="ribbon__item" key={i}>
              <span className="ribbon__star">✦</span>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="colophon__top wrap">
        <div className="colophon__brand">
          <button type="button" className="colophon__brand-home" onClick={scrollTop} aria-label="The Outcome Company — top">
            <Wordmark {...WORDMARK} variant="dark" />
          </button>
          <p>Tell us what you need. Consider it handled.</p>
          <Btn className="colophon__cta" variant="ghost-dark" href={LINKS.getStarted}>
            Get started <Arrow />
          </Btn>
        </div>
        <div className="colophon__cols">
          {col("The Outcome Company", [
            { label: "How it works", onClick: () => scrollToId("how") },
            { label: "What we can do", onClick: () => scrollToId("catalog") },
            { label: "Pricing", onClick: () => scrollToId("pricing") },
            { label: "Support", onClick: () => scrollToId("support") },
          ])}
          {col("Commonwealth", [
            { label: "The Charter", onClick: goExternal(`${LINKS.commonwealth}charter`) },
            { label: "Privacy" },
            { label: "Terms" },
          ])}
          {col("The Companies", [
            { label: "Commonwealth", onClick: goExternal(LINKS.commonwealth) },
            { label: "The Maker Company", onClick: goExternal(LINKS.maker) },
            { label: "The Learning Company", onClick: goExternal(LINKS.learning) },
          ])}
        </div>
      </div>

      <div className="colophon__rule wrap" />

      <div className="colophon__credo wrap">
        <Seal size={72} animate={false} className="colophon__seal" />
        <p>
          © {year} The Outcome Company ·{" "}
          <button type="button" className="colophon__inline-link" onClick={goExternal(LINKS.commonwealth)}>A Commonwealth Company</button>
        </p>
      </div>
    </footer>
  );
}
