import { useEffect, useState } from "react";
import { LINKS, goExternal } from "../lib/links";
import { CATALOG, ALSO, TIERS, FAQ } from "../lib/outcomes";
import { Ink, useInView, usePrefersReducedMotion } from "../lib/motion";
import { Arrow, Btn, CheckChip, Seal, TabPill } from "../components/primitives";

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

/* The portrait with the voice badge: the app's NoraPortrait, on the
   assistant's own gradient. Badge: speaker while ready, bars while speaking. */
function Portrait({ pal, size, voice }: { pal: Pal; size: number; voice: "on" | "speaking" }) {
  const [a, b] = pal.colors;
  return (
    <span
      className={`pw pw--${voice}`}
      style={{ width: size, height: size, ["--pal-a" as string]: a, ["--pal-grad" as string]: `linear-gradient(165deg, ${a}, ${b} 62%, ${a})` }}
      aria-label={pal.name}
    >
      <img src={`${BASE_URL}portraits/${pal.id}.webp`} alt="" width={size} height={size} draggable={false} />
      {voice === "speaking" ? (
        <span className="pw-badge pw-badge--speaking" aria-hidden="true"><i /><i /><i /></span>
      ) : (
        <span className="pw-badge pw-badge--on" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" /></svg>
        </span>
      )}
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

/* The Wallet balance panel — a plump track that fills and stops dead at the cap. */
function BalancePanel() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -15% 0px" });
  return (
    <div ref={ref} className={`balance${inView ? " is-filled" : ""}`}>
      <p className="balance__label">This month&apos;s spend</p>
      <div className="balance__track">
        <span className="balance__fill" />
        <span className="balance__cap" aria-hidden="true">
          <span className="balance__cap-dot" />
          <span className="balance__cap-label">Your balance</span>
        </span>
        <span className="balance__beyond" aria-hidden="true" />
      </div>
      <div className="balance__foot">
        <CheckChip className="balance__chip">Nothing runs past your balance.</CheckChip>
        <p className="balance__fine">Your balance is the only limit. No credit · no hidden fees · no meters.</p>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <div className="page-home">
      {/* ── hero ────────────────────────────────────────── */}
      <section className="hero" id="top">
        <div className="hero__sun" aria-hidden="true" />
        <div className="wrap hero__grid">
          <div className="hero__lead">
            <Ink as="h1" fx="rise" delay={220} className="hero__h1">
              Insurance for <em>your Insurance.</em>
            </Ink>

            <Ink as="div" fx="none" delay={300} className="hero__medallion">
              <span className="medallion">
                <span className="medallion__amt">$14</span>
                <span className="medallion__per">/month</span>
              </span>
            </Ink>

            <Ink as="p" fx="rise" delay={360} className="hero__lede">
              Workers&apos; comp claims, ERISA appeals, and grievances, drafted and filed for union
              members.<span className="hide-phone"> No forms to decode. No retainer.</span>
            </Ink>

            <Ink as="div" fx="rise" delay={440} className="hero__ctas">
              <Btn variant="accent" size="lg" href={LINKS.getStarted}>
                Get started <Arrow />
              </Btn>
            </Ink>

            <Ink as="p" fx="rise" delay={500} className="hero__micro hide-phone">
              Cancel anytime. We&apos;ll never charge you for anything you didn&apos;t say yes to.
            </Ink>
          </div>

          <PhoneMock />
        </div>
      </section>

      {/* ── who this is for: one big statement ─────────── */}
      <section className="section section--statement" id="bridge">
        <span className="shape shape--blush shape--left" aria-hidden="true" />
        <div className="wrap">
          <Ink as="p" fx="rise" className="eyebrow-caps">Who this is for</Ink>
          <Ink as="h2" fx="rise" delay={70} className="statement">
            Built for the people who keep everything running. The paperwork that protects you was
            never written for you. Keeper is here to get it right.
          </Ink>
          <Ink as="p" fx="rise" delay={140} className="statement__sub hide-phone">
            Whatever your trade, whatever your local, whatever language you speak. You tell us what
            happened. We take it from there.
          </Ink>
        </div>
      </section>

      {/* ── how it works ────────────────────────────────── */}
      <section className="section" id="how">
        <span className="shape shape--coral shape--tr" aria-hidden="true" />
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <TabPill>How it works</TabPill>
            <h2 className="section-head__title">Three steps. That&apos;s it.</h2>
          </Ink>
          <div className="exps">
            {[
              { n: "1", t: "Tell us what happened.", d: "In your own words. The injury, the denial letter, the write-up. Type it, say it, or send a photo of the paper." },
              { n: "2", t: "We draft and file.", d: "We ask a few questions, pull the deadlines and rules that apply, and write the claim, appeal, or grievance. You review it before it goes out." },
              { n: "3", t: "You get the paper trail.", d: "The filed document, the certified-mail receipt, and a plain-words plan for what comes next." },
            ].map((s, i) => (
              <Ink key={s.n} as="article" fx="rise" delay={i * 90} className={`exp exp--${i}`}>
                <span className="exp__pill">Step {s.n}</span>
                <span className="exp__num" aria-hidden="true">{s.n}</span>
                <h3 className="exp__t">{s.t}</h3>
                <p className="exp__d">{s.d}</p>
              </Ink>
            ))}
          </div>
          <Ink as="p" fx="rise" delay={90} className="how__support">
            And when a case needs a person, a real one steps in,{" "}
            <em className="accent-ocean">in your language.</em>
          </Ink>
        </div>
      </section>

      {/* ── the catalog ─────────────────────────────────── */}
      <section className="section" id="catalog">
        <span className="shape shape--red shape--bl" aria-hidden="true" />
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head section-head--tight">
            <TabPill>What we file</TabPill>
            <h2 className="section-head__title">
              Real filings, <em>done right.</em>
            </h2>
            <p className="section-head__sub hide-phone">
              Every one ends the same way: written, reviewed by you, filed, and in your hands with
              the deadline met. Open any one to see how it works.
            </p>
          </Ink>

          <div className="rail" role="list">
            {CATALOG.map((o, i) => (
              <Ink as="article" fx="rise" delay={(i % 4) * 60} key={o.title} className={`polaroid polaroid--${i % 4}`} role="listitem">
                <span className="polaroid__art" aria-hidden="true">
                  <span className="polaroid__glyph">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="polaroid__group">{o.group}</span>
                <h3 className="polaroid__t">{o.title}</h3>
                <p className="polaroid__d">{o.deliver}</p>
              </Ink>
            ))}
          </div>
          <Ink as="p" fx="rise" className="catalog__also">
            Also: {ALSO.join(", ")}.
          </Ink>
        </div>
      </section>

      {/* ── pricing ─────────────────────────────────────── */}
      <section className="section" id="pricing">
        <span className="shape shape--blush shape--right" aria-hidden="true" />
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head section-head--tight">
            <TabPill>Pricing</TabPill>
            <h2 className="section-head__title">
              Simple pricing. <em>No surprises.</em>
            </h2>
          </Ink>

          <div className="plans">
            {TIERS.map((t, i) => (
              <Ink
                as="div"
                fx="rise"
                delay={i * 70}
                key={t.name}
                className={`plan${t.soon ? " plan--soon" : ""}${i === 0 ? " plan--feature" : ""}`}
              >
                <span className="plan__tag">{t.name}</span>
                <span className={`plan__price${i === 0 ? " plan__price--hero" : ""}`}>
                  {t.price}
                  {t.per && <span className="plan__per">{t.per}</span>}
                </span>
                <p className="plan__blurb">{t.blurb}</p>
                {t.soon ? (
                  <span className="chip-soon">Coming soon</span>
                ) : (
                  <a className="btn btn--accent btn--sm plan__cta" href={LINKS.getStarted}>
                    <span className="btn__label">
                      Get started <span className="arrow" aria-hidden="true">→</span>
                    </span>
                  </a>
                )}
              </Ink>
            ))}
          </div>

          <Ink as="p" fx="rise" className="fineprint">
            One membership, cancel anytime.<span className="hide-phone"> A few heavy requests may cost
            more to run, always shown and agreed before we begin, never more than 14% over cost.</span>{" "}
            Keeper is not a law firm and does not give legal advice.
          </Ink>
        </div>
      </section>

      {/* ── support: one big statement ───────────────── */}
      <section className="section section--statement" id="support">
        <span className="shape shape--red shape--right" aria-hidden="true" />
        <div className="wrap">
          <Ink as="p" fx="rise" className="eyebrow-caps">The human side</Ink>
          <Ink as="h2" fx="rise" delay={70} className="statement">
            A claim is stressful. A denial is worse. You shouldn&apos;t be doing this alone at
            midnight.
          </Ink>
          <Ink as="p" fx="rise" delay={140} className="statement__sub">
            Our support line is open around the clock, in ten languages. And when a case needs a
            person, a real one steps in and stays on it. You&apos;re never stuck. You&apos;re never
            alone with it.
          </Ink>
        </div>
      </section>

      {/* ── the wallet ──────────────────────────────────── */}
      <section className="section" id="wallet">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head section-head--tight">
            <TabPill>The Wallet</TabPill>
            <h2 className="section-head__title">
              Your money <em>stays yours.</em>
            </h2>
            <p className="section-head__sub">
              Everything you spend comes from your own balance. No credit, no hidden fees, and no
              way for a bill to grow while you&apos;re not looking.
            </p>
          </Ink>
          <div className="panel wallet">
            <span className="blob" aria-hidden="true" />
            <BalancePanel />
          </div>
        </div>
      </section>

      {/* ── part of something bigger ────────────────────── */}
      <section className="section" id="commonwealth">
        <div className="wrap">
          <div className="panel panel--navy commonwealth">
            <span className="commonwealth__halo" aria-hidden="true" />
            <div className="commonwealth__copy">
              <Ink as="div" fx="rise">
                <TabPill onDark>Part of something bigger</TabPill>
              </Ink>
              <Ink as="h2" fx="rise" delay={70} className="commonwealth__h">
                One part of <em>Commonwealth.</em>
              </Ink>
              <Ink as="p" fx="rise" delay={120} className="commonwealth__p">
                Keeper is one part of Commonwealth, a community built on a simple promise: bring
                everyone into this new world together, and leave no one behind.
              </Ink>
              <Ink as="p" fx="rise" delay={160} className="commonwealth__p">
                Half of every dollar of profit goes back to the community. That promise can never be
                sold or taken away. It&apos;s written down, and it&apos;s binding.
              </Ink>
              <Ink as="div" fx="rise" delay={200} className="commonwealth__cta">
                <Btn variant="ghost-dark" onClick={goExternal(`${LINKS.commonwealth}charter`)}>
                  Read the Charter <Arrow />
                </Btn>
              </Ink>
            </div>
            <div className="commonwealth__seal">
              <Seal size={180} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="section" id="faq">
        <span className="shape shape--coral shape--left" aria-hidden="true" />
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head section-head--tight">
            <TabPill>Questions</TabPill>
            <h2 className="section-head__title">
              Good questions, <em>straight answers.</em>
            </h2>
          </Ink>
          {/* FAQPage structured data, generated from the same FAQ source that
             renders below so the markup can never drift from the visible text
             (Google requires an exact match). Baked into the static HTML by the
             prerender step, so crawlers and AI systems read it without JS. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQ.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }}
          />
          <div className="faq">
            {FAQ.map((f) => (
              <details className="faq__item" key={f.q}>
                <summary className="faq__q">
                  <span className="faq__q-text">{f.q}</span>
                  <span className="faq__toggle" aria-hidden="true">
                    <span className="faq__toggle-icon" />
                  </span>
                </summary>
                <div className="faq__open">
                  <div className="faq__a">{f.a}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
