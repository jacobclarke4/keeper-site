import { LINKS } from "../lib/links";
import { scrollToId } from "../lib/nav";
import { FAQ } from "../lib/outcomes";
import { STATS, MAP, SCRIPTS, GUARANTEE, SERVICES } from "../lib/site";
import { CountUp } from "../components/motion-bits";
import { AppShot } from "../components/AppShot";
import { CalendarTile, Fit } from "../components/AppTiles";
import { AssistantCarousel } from "../components/AssistantCarousel";
import { AssistantProvider } from "../components/AssistantProvider";
import { AssistantPhone } from "../components/AssistantPhone";
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
          <Ink as="h1" fx="rise" delay={120} className="hero__h1">
            Insurance for <em>your Insurance.</em>
          </Ink>
          <Ink as="p" fx="rise" delay={220} className="hero__lede">
            For union members who get hurt at work, denied a benefit, or written up. Say what happened, and Keeper files the claim, the appeal, or the grievance, tracks every deadline, and keeps every paper.
          </Ink>
          <Ink as="div" fx="rise" delay={320} className="hero__row">
            <span className="medallion">
              <span className="medallion__amt">$14</span>
              <span className="medallion__per">/month</span>
            </span>
          </Ink>
          <Ink as="div" fx="rise" delay={400} className="hero__row hero__row--cta">
            <Btn variant="accent" size="lg" href={LINKS.getStarted}>
              Get started <Arrow />
            </Btn>
            <span className="hero__micro">Cancel anytime.</span>
          </Ink>
        </div>
        <div className="hero__map">
          <Ink as="div" fx="rise" delay={200} className="hero__tablet" aria-label="The Keeper home on a tablet, example">
            <div className="tablet">
              <div className="tablet__screen app">
                <div className="tablet__body">
                  <Fit width={960} narrow={{ at: 560, width: 600 }}><AppShot /></Fit>
                </div>
              </div>
            </div>
          </Ink>
        </div>
        </div>
      </section>

      {/* ── the challenge: the ribbon ───────────────────── */}
      <section className="section section--dark sec sec--ribbon" id="challenge">
        <div className="wrap">
          <Ink as="p" fx="rise" className="ribbon__lede">
            <b>The paperwork is built to lose you.</b> Get hurt, get denied, get written up, and the forms, clocks, and letters start. Miss one and the case is over. Most people miss one, and most of them were right.
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

      {/* ── the guarantee: a red band, the number first ──── */}
      <section className="section section--dark sec sec--rebate" id="rebate">
        <div className="wrap rebate">
          <Ink as="div" fx="rise" className="rebate__amt-wrap">
            <span className="rebate__tag">The Keeper guarantee: we stand behind the paperwork.</span>
            <CountUp value={GUARANTEE.amount} duration={1800} className="rebate__amt" />
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
            <h2 className="sec__title">Say what happened. Keeper does the paperwork.</h2>
            <p className="sec__blurb">A workers&apos; comp claim alone is {MAP.boxes} boxes and dozens of clocks. Keeper knows the whole map. You do three things.</p>
          </Ink>
          <ol className="walk">
            {[
              { t: "Tell your assistant what happened.", d: "In your own words, typed or spoken. A photo of the letter works too." },
              { t: "Keeper drafts and files.", d: "The claim, the appeal, or the grievance, written to the rule it relies on and sent certified. You approve every page first." },
              { t: "You keep the paper trail.", d: "Every letter tracked to the signature, every deadline on your calendar, every receipt in your Wallet." },
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
              <h2 className="sec__title">It tells you what to say, and who to say it to.</h2>
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
              <h2 className="sec__title">One app. Every case, every letter, every clock.</h2>
            </div>
          </Ink>
          <AssistantProvider>
          <div className="bento">
            <Ink as="article" fx="rise" className="bento__tile bento__tile--home">
              <h3 className="bento__h">Your home: every open case, and how many days are left on each.</h3>
              <div className="bento__art"><Fit width={920} narrow={{ at: 560, width: 600 }}><AppShot /></Fit></div>
            </Ink>
            <Ink as="article" fx="rise" delay={90} className="bento__tile bento__tile--roster">
              <h3 className="bento__h">Pick your assistant. It writes, files, and reminds you.</h3>
              <div className="bento__art"><AssistantCarousel /></div>
            </Ink>
            <Ink as="article" fx="rise" delay={60} className="bento__tile bento__tile--phone bento__tile--dark">
              <h3 className="bento__h">Say what happened. A case opens, and the first letter goes out.</h3>
              <div className="bento__art"><AssistantPhone /></div>
            </Ink>
            <Ink as="article" fx="rise" delay={150} className="bento__tile bento__tile--cal">
              <h3 className="bento__h">Every deadline on one calendar, with the law it comes from.</h3>
              <div className="bento__art bento__art--fill"><CalendarTile /></div>
            </Ink>
          </div>
          </AssistantProvider>
        </div>
      </section>

      {/* ── services: the shelf, in cards ───────────────── */}
      <section className="section sec" id="services">
        <div className="wrap">
          <Ink as="div" fx="rise" className="sec__head sec__head--row">
            <div>
              <h2 className="sec__title">What Keeper files for you.</h2>
            </div>
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

      {/* ── pricing: a charcoal band, the price first ───── */}
      <section className="section section--dark sec sec--price" id="pricing">
        <div className="wrap rebate">
          <Ink as="div" fx="rise" className="rebate__amt-wrap">
            <span className="rebate__tag">One membership. Every case you ever need.</span>
            <span className="rebate__amt price__amt">$14<span className="price__per">/month</span></span>
          </Ink>
          <Ink as="div" fx="rise" delay={120} className="rebate__words">
            <ul className="price__list">
              <li>Every workers&apos; comp claim, ERISA appeal, and grievance, drafted, filed, and sent certified.</li>
              <li>An assistant who knows the deadlines and tells you what to say.</li>
              <li>A real person when a case needs one, and $1,000 if you do every step and are wrongly denied anyway.</li>
            </ul>
            <a className="btn btn--accent btn--lg price__btn" href={LINKS.getStarted}>
              <span className="btn__label">Get started <span className="arrow" aria-hidden="true">→</span></span>
            </a>
            <p className="rebate__fine">Cancel anytime. Certified mail at cost, agreed before we send. Keeper is not a law firm. Available today in Illinois and Indiana.</p>
          </Ink>
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
