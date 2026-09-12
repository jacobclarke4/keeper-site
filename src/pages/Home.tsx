import { useEffect, useState } from "react";
import { LINKS } from "../lib/links";
import { scrollToId } from "../lib/nav";
import { TIERS, FAQ } from "../lib/outcomes";
import { STATS, MISSION, MAP, SCRIPTS, GUARANTEE, SERVICES } from "../lib/site";
import { CountUp } from "../components/motion-bits";
import { CompMap } from "../components/CompMap";
import { AppShot } from "../components/AppShot";
import { Ribbon } from "../components/Ribbon";
import { Ink, usePrefersReducedMotion } from "../lib/motion";
import { Arrow, Btn } from "../components/primitives";

/* ──────────────────────────────────────────────────────────
   Keeper — one viewport per section.
   Every section is min-height 100svh with its content centred,
   on phones too, so the copy stays short and the layouts compact.
   ────────────────────────────────────────────────────────── */

/* The hero's example: Keeper's member home, as the app draws it (the
   rebuild-ui branch of the-outcome-company-app): the assistant's pill at
   the top where her replies appear, the case deck, the mail tracking, and
   the member's capsule at the bottom. Illustrative, not live data. */

/* The assistants. Portraits in public/portraits/<id>.webp; two neighbouring
   accents each, the same scheme as the Pal Company portraits. */
type Pal = { id: string; name: string; colors: [string, string] };
const PALS: Pal[] = [
  { id: "nora", name: "Nora", colors: ["#f59e0b", "#ef4444"] },
  { id: "frankie", name: "Frankie", colors: ["#3b82f6", "#a855f7"] },
  { id: "lin", name: "Lin", colors: ["#ec4899", "#8b5cf6"] },
  { id: "ben", name: "Ben", colors: ["#10b981", "#22d3ee"] },
  { id: "camille", name: "Camille", colors: ["#0ea5e9", "#6366f1"] },
  { id: "hanna", name: "Hanna", colors: ["#f97316", "#e11d48"] },
  { id: "charlie", name: "Charlie", colors: ["#ff3d8f", "#ffb020"] },
  { id: "vivian", name: "Vivian", colors: ["#22c55e", "#a3e635"] },
];
const BASE_URL = import.meta.env.BASE_URL;

const CASE = {
  said: "Slipped on the loading dock. Right knee. Told my foreman before end of shift.",
  welcome: "Hi Sam. Nothing is due today. Tell me what happened and I'll take it from there.",
  thinking: "One moment.",
  reply: "That sounds like a workers' comp claim. I've reported the injury to your employer and filed the claim with the insurer.",
  headline: "Workers' comp claim",
  steps: [
    { n: 1, label: "Injury reported to your employer" },
    { n: 2, label: "Claim filed with the insurer" },
    { n: 3, label: "Insurer reviewing your claim" },
  ],
  total: 5,
  daysLeft: 9,
  mail: { title: "Claim to the insurer", kind: "Certified mail", steps: [["Assembled", "Mar 5"], ["Sent", "Mar 5"], ["Delivered", "Mar 8"]] as [string, string][], signed: "Signed for" },
};

/* The loop, in milliseconds from the start.
   0 you talk (the mic is live, your words arrive in the text bar) ·
   1 she thinks · 2 she answers and the case appears, step 1 ·
   3 the claim is filed, step 2, tracking appears · 4 the insurer has it,
   step 3, the road shows the fork · 5 hold, then fade and start again
   with the next assistant. */
const TIMELINE = [0, 3600, 4400, 8400, 10400, 14500];
const RESTART_FADE = 500;
const TYPE_MS = 34;

/* The portrait: the app's NoraPortrait, on the assistant's own gradient.
   No mute or speaker badge; voice and captions are simply always on. */
function Portrait({ pal, size, voice }: { pal: Pal; size: number; voice: "on" | "speaking" }) {
  const [a, b] = pal.colors;
  return (
    <span
      className={`pw pw--${voice}`}
      style={{ width: size, height: size, ["--pal-a" as string]: a, ["--pal-grad" as string]: `linear-gradient(165deg, ${a}, ${b} 62%, ${a})` }}
      aria-label={pal.name}
    >
      <img src={`${BASE_URL}portraits/${pal.id}.webp`} alt="" width={size} height={size} draggable={false} />
    </span>
  );
}

/* Steps the loop; resolves to the finished state when motion is reduced.
   Each pass hands the member to the next assistant. */
function useCaseLoop(reduced: boolean) {
  const [step, setStep] = useState(reduced ? 4 : 0);
  const [fading, setFading] = useState(false);
  const [pass, setPass] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let timers: number[] = [];
    const run = () => {
      setFading(false);
      setStep(0);
      timers = TIMELINE.slice(1).map((at, i) => window.setTimeout(() => setStep(i + 1), at));
      const total = TIMELINE[TIMELINE.length - 1];
      timers.push(window.setTimeout(() => setFading(true), total));
      timers.push(window.setTimeout(() => { setPass((n) => n + 1); run(); }, total + RESTART_FADE));
    };
    const first = window.setTimeout(run, 0);
    return () => { window.clearTimeout(first); timers.forEach((t) => window.clearTimeout(t)); };
  }, [reduced]);
  return { step, fading, pass };
}

/* Reveals text one character at a time while active. */
function useTyped(text: string, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let i = 0;
    const reset = window.setTimeout(() => setN(0), 0);
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, TYPE_MS);
    return () => { window.clearTimeout(reset); window.clearInterval(id); };
  }, [text, active]);
  return active ? text.slice(0, n) : "";
}

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3.5a2.75 2.75 0 0 1 2.75 2.75v5.25a2.75 2.75 0 0 1-5.5 0V6.25A2.75 2.75 0 0 1 12 3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M6 11.25a6 6 0 0 0 12 0M12 17.25v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const KeyboardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M18 14h.01M9 14h6" />
  </svg>
);
const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

/* The phone: the member home, as the app draws it. */
function PhoneMock() {
  const reduced = usePrefersReducedMotion();
  const { step, fading, pass } = useCaseLoop(reduced);
  const pal = PALS[pass % PALS.length];
  const listening = !reduced && step === 0;
  const thinking = !reduced && step === 1;
  const speaking = !reduced && step === 2;
  const said = useTyped(CASE.said, listening);
  const caseStep = step >= 4 ? 3 : step >= 3 ? 2 : step >= 2 ? 1 : 0;
  const phase = caseStep > 0 ? CASE.steps[caseStep - 1] : null;
  const pct = Math.round((caseStep / CASE.total) * 100);
  return (
    <div className="hero__stack" aria-label="Keeper on your phone, example">
      <Ink as="div" fx="none" delay={640} className="phone">
        <div className={`phone__screen app${fading ? " is-fading" : ""}`}>
          <div className="phone__island" aria-hidden="true" />
          <div className="phone__status" aria-hidden="true">
            <span>9:41</span>
            <span className="phone__signal" />
          </div>
          <header className="app__bar">
            <span className="app__brand">Keeper</span>
            <span className="app__bar-title">Home</span>
          </header>

          <div className="app__body">
            <section className="npill">
              <Portrait pal={pal} size={56} voice={speaking ? "speaking" : "on"} />
              <div className="npill__copy">
                <span className="npill__name">{pal.name}</span>
                <p className="npill__line">{thinking ? CASE.thinking : step >= 2 ? CASE.reply : CASE.welcome}</p>
              </div>
            </section>

            <section className={`cases${caseStep > 0 ? " is-in" : ""}`}>
              <div className="cases__head">
                <h2 className="cases__title">Your cases</h2>
                <span className="cases__count">1 / 3</span>
              </div>
              <article className="deckcard">
                <span className="badge badge--solid badge--info">In progress</span>
                <h3 className="deckcard__h">{CASE.headline}</h3>
                <div className="deckcard__chips">
                  {caseStep >= 2 ? (
                    <span className="badge badge--solid badge--warning">{CASE.daysLeft} days left</span>
                  ) : (
                    <span className="badge badge--neutral">No rush</span>
                  )}
                </div>
                <div className="deckcard__track">
                  <span className="deckcard__step">Step {caseStep || 1} of {CASE.total}</span>
                  <span className="deckcard__phase">{phase ? phase.label : CASE.steps[0].label}</span>
                  <span className="bar"><span className="bar__fill" style={{ width: `${Math.max(pct, 20)}%` }} /></span>
                </div>
                <span className={`deckcard__mail${caseStep >= 2 ? " is-in" : ""}`}>
                  <span className="timeline__dot is-done"><Check /></span>
                  <span className="deckcard__mail-text">{CASE.mail.kind} · {caseStep >= 3 ? `Delivered ${CASE.mail.steps[2][1]} · ${CASE.mail.signed}` : `Sent ${CASE.mail.steps[1][1]}`}</span>
                </span>
                <span className={`road${caseStep >= 3 ? " is-in" : ""}`} aria-hidden="true">
                  {[1, 2, 3].map((n) => (
                    <span className="road__seg" key={n}>
                      <span className={`road__dot${n === caseStep ? " road__dot--here" : n < caseStep ? " road__dot--done" : ""}`} />
                      <span className={`road__line${n < caseStep ? " road__line--done" : ""}`} />
                    </span>
                  ))}
                  <span className="road__fork" />
                  <span className="road__branches"><span className="road__pay" /><span className="road__no" /></span>
                </span>
              </article>
            </section>

          </div>

          <div className="band" aria-hidden="true">
            <div className={`textbar${listening ? " is-on" : ""}`}>
              <span className="textbar__text">{said}{listening && <span className="textbar__caret" />}</span>
              <span className="textbar__send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l8 7-8 7" /></svg></span>
            </div>
            <div className="capsule">
              <span className={`capsule__mic${listening ? " is-rec" : ""}`}><MicIcon /></span>
              <Portrait pal={pal} size={40} voice={speaking ? "speaking" : "on"} />
              <span className="capsule__keys"><KeyboardIcon /></span>
            </div>
          </div>
        </div>
      </Ink>
    </div>
  );
}

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

      {/* ── keeper, and the guarantee: two tiles ────────── */}
      <section className="section sec" id="intro">
        <div className="wrap tiles">
          <Ink as="article" fx="rise" className="tile tile--warm">
            <p className="sec__eyebrow">Introducing Keeper</p>
            <h2 className="tile__title">{MISSION}</h2>
          </Ink>
          <Ink as="article" fx="rise" delay={90} className="tile tile--red" id="rebate">
            <p className="sec__eyebrow">The guarantee</p>
            <CountUp value={GUARANTEE.amount} duration={1600} className="tile__amt" />
            <p className="tile__line">{GUARANTEE.line}</p>
            <button type="button" className="tile__btn" onClick={() => scrollToId("how")}>How it works</button>
            <p className="tile__fine">{GUARANTEE.fine}</p>
          </Ink>
        </div>
      </section>

      {/* ── how it works: three things you do ───────────── */}
      <section className="section sec" id="how">
        <div className="wrap sec__grid">
          <Ink as="div" fx="rise" className="sec__head">
            <p className="sec__eyebrow">How it works</p>
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
      <section className="section section--dark sec" id="scripts">
        <div className="wrap sec__grid">
          <Ink as="div" fx="rise" className="sec__head">
            <p className="sec__eyebrow">Every situation, scripted</p>
            <h2 className="sec__title">Say this. To them.</h2>
            <p className="sec__blurb">The words for every situation the map knows about, and who they are for.</p>
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
              <p className="sec__eyebrow">The app</p>
              <h2 className="sec__title">Every case, every letter, every clock. One screen.</h2>
            </div>
            <p className="sec__blurb">The deck of your cases, where each letter is, and the days left on every deadline. On the phone too.</p>
          </Ink>
          <div className="composite">
            <AppShot />
            <div className="phone-slot product" aria-label="Keeper on your phone, example">
              <PhoneMock />
            </div>
          </div>
        </div>
      </section>

      {/* ── services: the shelf, in cards ───────────────── */}
      <section className="section sec" id="services">
        <div className="wrap">
          <Ink as="div" fx="rise" className="sec__head sec__head--row">
            <div>
              <p className="sec__eyebrow">What we do</p>
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
            <p className="sec__eyebrow">Pricing</p>
            <h2 className="sec__title">Simple pricing. No surprises.</h2>
          </Ink>
          {TIERS.map((t) => (
            <Ink key={t.name} as="article" fx="rise" delay={90} className="pcard">
              <p className="sec__eyebrow">{t.name}</p>
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
              <p className="sec__eyebrow">Questions</p>
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
