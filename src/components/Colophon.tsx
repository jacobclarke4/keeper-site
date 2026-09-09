import { scrollToId, scrollTop } from "../lib/nav";
import { OUTCOMES_TICKER } from "../lib/outcomes";
import { LINKS, goExternal } from "../lib/links";
import { Seal, Btn, Arrow } from "./primitives";
import { Wordmark, WORDMARK } from "./Wordmark";

export function Colophon() {
  const year = new Date().getFullYear();
  const col = (title: string, items: { label: string; onClick?: () => void }[]) => (
    <div className="foot__col">
      <h5 className="foot__col-h">{title}</h5>
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
    <footer className="foot">
      {/* the wire ribbon — every outcome, in passing, warm and slow */}
      <div className="ribbon" aria-hidden="true">
        <div className="ribbon__track">
          {[...OUTCOMES_TICKER, ...OUTCOMES_TICKER].map((t, i) => (
            <span className="ribbon__item" key={i}>
              <span className="ribbon__dot" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="foot__top wrap">
        <div className="foot__brand">
          <button type="button" className="foot__brand-home" onClick={scrollTop} aria-label="Keeper — top">
            <Wordmark {...WORDMARK} variant="dark" />
          </button>
          <p>Tell us what happened. We handle the paper.</p>
          <Btn className="foot__cta" variant="ghost-dark" href={LINKS.getStarted}>
            Get started <Arrow />
          </Btn>
          <div className="foot__gnews">
            <span className="foot__gnews-label">Follow us in Google Search</span>
            {/* Google Preferred Sources button — hydrated by publisher.js (index.html) */}
            <div {...{ "google-add-preferred-source-btn": "" }} />
          </div>
        </div>
        <div className="foot__cols">
          {col("Keeper", [
            { label: "How it works", onClick: () => scrollToId("how") },
            { label: "What we file", onClick: () => scrollToId("catalog") },
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
          ])}
        </div>
      </div>

      <div className="foot__credo wrap">
        <Seal size={72} animate={false} className="foot__seal" />
        <p>
          © {year} Keeper ·{" "}
          <button type="button" className="foot__inline-link" onClick={goExternal(LINKS.commonwealth)}>A Commonwealth Company</button>
        </p>
      </div>
    </footer>
  );
}
