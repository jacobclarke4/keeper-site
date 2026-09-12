import { LINKS } from "../lib/links";
import { scrollToId } from "../lib/nav";
import { TIERS, FAQ } from "../lib/outcomes";
import { STATS, MISSION, MAP, SCRIPTS, GUARANTEE, SERVICES } from "../lib/site";
import { CountUp } from "../components/motion-bits";
import { CompMap } from "../components/CompMap";
import { AppShot } from "../components/AppShot";
import { CompTile, TrackingPhone, CalendarTile, Fit, COMP_W } from "../components/AppTiles";
import { Ribbon } from "../components/Ribbon";
import { Ink } from "../lib/motion";
import { Arrow, Btn } from "../components/primitives";

/* ──────────────────────────────────────────────────────────
   Keeper — one viewport per section.
   Every section is min-height 100svh with its content centred,
   on phones too, so the copy stays short and the layouts compact.
   ────────────────────────────────────────────────────────── */

export function HomePage() {
  return (
    <div className="page-home">
      {/* ── hero: the map is the visual ─────────────────── */}
      <section className="hero hero--map" id="top">
        <div className="hero__wash" aria-hidden="true" />
        <div className="wrap hero__grid">
        <div className="hero__copy">
          <Ink as="p" fx="rise" delay={60} className="hero__kicker">
            For union members
          </Ink>
          <Ink as="h1" fx="rise" delay={120} className="hero__h1">
            Insurance for <em>your Insurance.</em>
          </Ink>
          <Ink as="p" fx="rise" delay={220} className="hero__lede">
            Hurt at work? A benefit denied? We keep every deadline and every paper, so nothing slips.
          </Ink>
          <Ink as="div" fx="rise" delay={320} className="hero__row">
            <span className="medallion">
              <span className="medallion__amt">$14</span>
              <span className="medallion__per">/month</span>
            </span>
            <Btn variant="accent" size="lg" href={LINKS.getStarted}>
              Get started <Arrow />
            </Btn>
            <span className="hero__micro">Cancel anytime.</span>
          </Ink>
        </div>
        <div className="hero__map">
          <CompMap />
        </div>
        </div>
      </section>

      {/* ── the challenge: the ribbon ───────────────────── */}
      <section className="section section--dark sec sec--ribbon" id="challenge">
        <div className="wrap">
          <Ink as="p" fx="rise" className="ribbon__lede">
            <b>The system loses people.</b> A first denial is up 20% in five years. Most of the people it happens to are right, and most of them never find out.
          </Ink>
          <Ribbon />
          <div className="figures figures--row">
            {STATS.map((st, i) => (
              <Ink key={st.n} as="article" fx="rise" delay={i * 80} className="figure">
                <CountUp value={st.n} className="figure__n" />
                <p className="figure__label">{st.label}</p>
                <a className="figure__source" href={st.href} target="_blank" rel="noopener noreferrer">{st.source}</a>
              </Ink>
            ))}
          </div>
        </div>
      </section>

      {/* ── introducing keeper: one statement ───────────── */}
      <section className="section sec" id="intro">
        <div className="wrap">
          <Ink as="h2" fx="rise" className="mission">{MISSION}</Ink>
        </div>
      </section>

      {/* ── the guarantee: a red band, the number first ──── */}
      <section className="section section--dark sec sec--rebate" id="rebate">
        <div className="wrap rebate">
          <Ink as="div" fx="rise" className="rebate__amt-wrap">
            <CountUp value={GUARANTEE.amount} duration={1800} className="rebate__amt" />
            <span className="rebate__tag">The Keeper guarantee</span>
          </Ink>
          <Ink as="div" fx="rise" delay={120} className="rebate__words">
            <p className="rebate__line">{GUARANTEE.line}</p>
            <button type="button" className="tile__btn" onClick={() => scrollToId("how")}>How it works</button>
            <p className="rebate__fine">{GUARANTEE.fine}</p>
          </Ink>
        </div>
      </section>

      {/* ── how it works: three things you do ───────────── */}
      <section className="section sec" id="how">
        <div className="wrap sec__grid">
          <Ink as="div" fx="rise" className="sec__head">
            <h2 className="sec__title">{MAP.boxes} steps. Seven stations. Three things you do.</h2>
            <p className="sec__blurb">We mapped every fork a claim can take. You walk one line.</p>
          </Ink>
          <ol className="walk">
            {[
              { t: "Tell us what happened.", d: "Type it, say it, or send a photo of the paper." },
              { t: "We draft and file.", d: "The claim, appeal, or grievance, with the rule it relies on. You approve it first." },
              { t: "You get the paper trail.", d: "The filed document, the certified-mail receipt, and what comes next." },
            ].map((st, i) => (
              <Ink key={st.t} as="li" fx="rise" delay={i * 80} className="walk__item">
                <span className="walk__n" aria-hidden="true">{i + 1}</span>
                <h3 className="walk__t">{st.t}</h3>
                <p className="walk__d">{st.d}</p>
              </Ink>
            ))}
          </ol>
        </div>
      </section>

      {/* ── scripts: charcoal ───────────────────────────── */}
      <section className="section sec" id="scripts">
        <div className="wrap">
          <Ink as="div" fx="rise" className="sec__head sec__head--row">
            <div>
              <h2 className="sec__title">Say this. To them.</h2>
            </div>
          </Ink>
          <ul className="bubbles">
            {SCRIPTS.map((sc, i) => (
              <Ink key={sc.to} as="li" fx="rise" delay={i * 80} className="bubble-say">
                <p className="bubble-say__text">{sc.say}</p>
                <span className="bubble-say__to">To {sc.to}</span>
              </Ink>
            ))}
          </ul>
        </div>
      </section>

      {/* ── the product: phone and tablet ───────────────── */}
      <section className="section section--dark sec" id="product">
        <div className="wrap">
          <Ink as="div" fx="rise" className="sec__head sec__head--row">
            <div>
              <h2 className="sec__title">The app, page by page.</h2>
            </div>
          </Ink>
          <div className="bento">
            <Ink as="article" fx="rise" className="bento__tile bento__tile--home">
              <h3 className="bento__h">Your home. Every case, every clock.</h3>
              <div className="bento__art"><Fit width={920}><AppShot /></Fit></div>
            </Ink>
            <Ink as="article" fx="rise" delay={90} className="bento__tile bento__tile--comp">
              <h3 className="bento__h">Workers&apos; comp, box by box.</h3>
              <div className="bento__art"><Fit width={COMP_W}><CompTile /></Fit></div>
            </Ink>
            <Ink as="article" fx="rise" delay={60} className="bento__tile bento__tile--phone bento__tile--dark">
              <h3 className="bento__h">Every letter, tracked to the signature.</h3>
              <div className="bento__art"><TrackingPhone /></div>
            </Ink>
            <Ink as="article" fx="rise" delay={150} className="bento__tile bento__tile--cal">
              <h3 className="bento__h">Every deadline, with the law it comes from.</h3>
              <div className="bento__art"><Fit width={860}><CalendarTile /></Fit></div>
            </Ink>
          </div>
        </div>
      </section>

      {/* ── services: the shelf, in cards ───────────────── */}
      <section className="section sec" id="services">
        <div className="wrap">
          <Ink as="div" fx="rise" className="sec__head sec__head--row">
            <div>
              <h2 className="sec__title">Every service, by name.</h2>
            </div>
            <p className="sec__blurb">Workers&apos; comp, ERISA, and grievances first. The rest of the shelf behind them.</p>
          </Ink>
          <ul className="shelf">
            {SERVICES.map((sv, i) => (
              <Ink key={sv.name} as="li" fx="rise" delay={(i % 4) * 50 + Math.floor(i / 4) * 40} className={`shelf__card${i === 0 ? " shelf__card--lead" : ""}`}>
                <span className="shelf__mark" aria-hidden="true" />
                <span className="shelf__name">{sv.name}</span>
              </Ink>
            ))}
          </ul>
        </div>
      </section>

      {/* ── pricing: one card ───────────────────────────── */}
      <section className="section sec" id="pricing">
        <div className="wrap wrap--narrow">
          <Ink as="div" fx="rise" className="sec__head sec__head--center">
            <h2 className="sec__title">Simple pricing. No surprises.</h2>
          </Ink>
          {TIERS.map((t) => (
            <Ink key={t.name} as="article" fx="rise" delay={90} className="pcard">
              <span className="pcard__price">
                {t.price}
                {t.per && <span className="pcard__per">{t.per}</span>}
              </span>
              <p className="pcard__line">{t.blurb}</p>
              <a className="btn btn--accent" href={LINKS.getStarted}>
                <span className="btn__label">Get started <span className="arrow" aria-hidden="true">→</span></span>
              </a>
              <p className="pcard__fine">Cancel anytime. Certified mail at cost, agreed before we send. Keeper is not a law firm. Available today in Illinois and Indiana.</p>
            </Ink>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="section sec" id="faq">
        <div className="wrap">
          <Ink as="div" fx="rise" className="sec__head sec__head--row">
            <div>
              <h2 className="sec__title">Straight answers.</h2>
            </div>
          </Ink>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
              }),
            }}
          />
          <div className="faq">
            {FAQ.map((f) => (
              <details className="faq__item" key={f.q}>
                <summary className="faq__q">
                  <span className="faq__q-text">{f.q}</span>
                  <span className="faq__toggle" aria-hidden="true"><span className="faq__toggle-icon" /></span>
                </summary>
                <div className="faq__open"><div className="faq__a">{f.a}</div></div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
