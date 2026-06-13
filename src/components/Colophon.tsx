import { BASE_URL, type NavFn } from "../lib/nav";
import { OUTCOMES_TICKER } from "../lib/intake";
import { LINKS, goExternal } from "../lib/links";
import { Seal } from "./primitives";

const LOGO_DARK = `${BASE_URL}TOC%204.svg`;

export function Colophon({ nav }: { nav: NavFn }) {
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
          <button type="button" className="colophon__brand-home" onClick={() => nav("home")} aria-label="The Outcome Company — home">
            <img src={LOGO_DARK} alt="The Outcome Company" />
          </button>
          <p>Delivering what people actually want, at a price you agree to before we start.</p>
        </div>
        <div className="colophon__cols">
          {col("Membership", [
            { label: "Membership", onClick: () => nav("users") },
            { label: "Premium baskets", onClick: () => nav("users") },
            { label: "The Outcome Wallet", onClick: () => nav("users") },
            { label: "Get started", onClick: () => nav("waitlist") },
          ])}
          {col("Concierges", [
            { label: "Become a Concierge", onClick: () => nav("concierges") },
            { label: "How it works", onClick: () => nav("concierges") },
            { label: "Concierge waitlist", onClick: () => nav("concierge-apply") },
          ])}
          {col("The Companies", [
            { label: "Commonwealth", onClick: goExternal(LINKS.commonwealth) },
            { label: "The Maker Company", onClick: goExternal(LINKS.maker) },
            { label: "The Learning Company", onClick: goExternal(LINKS.learning) },
            { label: "The Audit Company", onClick: goExternal(LINKS.audit) },
          ])}
          {col("Commonwealth", [
            { label: "The Charter", onClick: goExternal(`${LINKS.commonwealth}charter`) },
            { label: "The Toolbox", onClick: goExternal(`${LINKS.commonwealth}toolbox`) },
          ])}
        </div>
      </div>

      <div className="colophon__rule wrap" />

      <div className="colophon__credo wrap">
        <Seal size={72} animate={false} className="colophon__seal" />
        <p>
          No company under this roof can be sold. Ever. 50¢ of every dollar of profit goes back
          to our Makers and Concierges.{" "}
          <button type="button" className="colophon__inline-link" onClick={goExternal(LINKS.commonwealth)}>Read the Charter →</button>
        </p>
      </div>

      <div className="colophon__imprint wrap mono">
        <span>PRINTED {year} · THE OUTCOME COMPANY · ALL EDITIONS</span>
        <span className="colophon__fin display">— fin —</span>
      </div>
    </footer>
  );
}
