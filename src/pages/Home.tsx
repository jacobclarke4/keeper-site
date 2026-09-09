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

/* The hero's example case: one workers' comp claim, told through its
   journal. Two voices: the member's own notes, in their words, and
   Keeper's actions on the case. The phone plays it as a loop.
   Illustrative, not live data. */
type Entry = { date: string; who: "you" | "keeper"; text: string };

const CASE = {
  title: "Workers' comp claim",
  statusBefore: "Opened Mar 3",
  statusAfter: "Insurer decides by Mar 19",
  entries: [
    { date: "Mar 3", who: "you", text: "Slipped on the loading dock. Right knee. Told my foreman before end of shift." },
    { date: "Mar 5", who: "keeper", text: "Claim filed with the insurer. Certified-mail receipt attached." },
    { date: "Mar 6", who: "you", text: "Doctor says six weeks light duty. Photo of the note attached." },
  ] as Entry[],
  next: "Accepted: checks start. Denied: we file the appeal that week.",
};

/* The loop, in milliseconds from the start: when each step lands.
   0 typing the first note · 1 note becomes an entry · 2 Keeper files ·
   3 doctor's note · 4 what's next · 5 hold, then fade and restart. */
const TIMELINE = [0, 3200, 4900, 6600, 8200, 12000];
const RESTART_FADE = 500;
const TYPE_MS = 34;

/* The other cases in the stack, peeking out beneath the open one. */
const PEEKS = [
  { title: "ERISA appeal", status: "Plan decides · 31 days" },
  { title: "Grievance · Art. 12", status: "Step 1 · Tuesday" },
];

/* The dotted arc that links the three step bubbles, drawn on enter. */
function StepArc() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -20% 0px" });
  return (
    <div ref={ref} className={`how__arc${inView ? " is-drawn" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1000 120" preserveAspectRatio="none">
        <path
          className="how__arc-path"
          d="M60,84 C260,-6 740,-6 940,84"
          fill="none"
          stroke="var(--current)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="0.004 0.02"
          pathLength={1}
        />
      </svg>
    </div>
  );
}

/* Steps the loop; resolves to the finished state when motion is reduced. */
function useCaseLoop(reduced: boolean) {
  const [step, setStep] = useState(reduced ? 4 : 0);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    if (reduced) return;
    let timers: number[] = [];
    const run = () => {
      setFading(false);
      setStep(0);
      timers = TIMELINE.slice(1).map((at, i) => window.setTimeout(() => setStep(i + 1), at));
      const total = TIMELINE[TIMELINE.length - 1];
      timers.push(window.setTimeout(() => setFading(true), total));
      timers.push(window.setTimeout(run, total + RESTART_FADE));
    };
    const first = window.setTimeout(run, 0);
    return () => { window.clearTimeout(first); timers.forEach((t) => window.clearTimeout(t)); };
  }, [reduced]);
  return { step, fading };
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

/* The phone: Keeper on a handset, the case deck stacked, the journal
   writing itself in a loop. */
function PhoneMock() {
  const reduced = usePrefersReducedMotion();
  const { step, fading } = useCaseLoop(reduced);
  const typing = !reduced && step === 0;
  const typed = useTyped(CASE.entries[0].text, typing);
  const filed = step >= 2;
  return (
    <div className="hero__stack" aria-label="Keeper on your phone, example">
      <Ink as="div" fx="none" delay={640} className="phone">
        <div className="phone__screen">
          <div className="phone__island" aria-hidden="true" />
          <div className="phone__status" aria-hidden="true">
            <span>9:41</span>
            <span className="phone__signal" />
          </div>
          <div className="phone__bar">
            <span className="phone__brand">Keeper</span>
            <span className="phone__title">Your cases</span>
          </div>
          <div className="deck">
            <article className={`deck__card deck__card--open${fading ? " is-fading" : ""}`}>
              <header className="journal__head">
                <p className="note__line">{CASE.title}</p>
                <span className={`note__status${filed ? " note__status--live" : ""}`} key={filed ? "after" : "before"}>
                  {filed ? CASE.statusAfter : CASE.statusBefore}
                </span>
              </header>
              <ol className="journal__list" aria-live="polite">
                {CASE.entries.map((e, i) => (
                  <li key={i} className={`journal__entry journal__entry--${e.who}${step >= i + 1 ? " is-in" : ""}`}>
                    <span className="journal__rail" aria-hidden="true" />
                    <span className="journal__date">{e.date}</span>
                    <span className="journal__who">{e.who === "you" ? "You" : "Keeper"}</span>
                    <p className="journal__text">{e.who === "you" ? `\u201C${e.text}\u201D` : e.text}</p>
                  </li>
                ))}
                <li className={`journal__entry journal__entry--next${step >= 4 ? " is-in" : ""}`}>
                  <span className="journal__rail" aria-hidden="true" />
                  <span className="journal__date">Next</span>
                  <span className="journal__who">Keeper</span>
                  <p className="journal__text">{CASE.next}</p>
                </li>
              </ol>
              <div className={`journal__add${typing ? " is-typing" : ""}`} aria-hidden="true">
                <span className="journal__add-text">
                  {typing ? typed : "Add a note to this case…"}
                  {typing && <span className="journal__add-caret" />}
                </span>
                <span className="journal__add-mic" />
              </div>
            </article>
            {PEEKS.map((p) => (
              <article className="deck__card deck__card--peek" key={p.title}>
                <p className="note__line">{p.title}</p>
                <span className="deck__peek-status">{p.status}</span>
              </article>
            ))}
          </div>
        </div>
      </Ink>
    </div>
  );
}

/* Alternate the two chip tones across catalog groups on first sight. */
const groupTone = (() => {
  const order: string[] = [];
  return (group: string) => {
    let idx = order.indexOf(group);
    if (idx === -1) {
      idx = order.length;
      order.push(group);
    }
    return idx % 2 === 0 ? "seafoam" : "current";
  };
})();

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

      {/* ── who this is for ─────────────────────────────── */}
      <section className="section" id="bridge">
        <div className="wrap">
          <div className="panel panel--seafoam panel--ocorner bridge">
            <span className="blob" aria-hidden="true" />
            <Ink as="div" fx="rise" className="bridge__tab">
              <TabPill>Who this is for</TabPill>
            </Ink>
            <Ink as="h2" fx="rise" delay={70} className="bridge__title">
              Built for the people who <em>keep everything running.</em>
            </Ink>
            <Ink as="p" fx="rise" delay={120} className="bridge__p">
              The paperwork that protects you was never written for you. Comp forms, benefit
              appeals, grievance procedures: every one has a deadline, a format, and a way to get it
              wrong.
            </Ink>
            <Ink as="p" fx="rise" delay={160} className="bridge__turn">
              Keeper is here to <em>get it right.</em>
            </Ink>
            <Ink as="p" fx="rise" delay={200} className="bridge__p hide-phone">
              Whatever your trade, whatever your local, whatever language you speak. You tell us
              what happened. We take it from there.
            </Ink>
          </div>
        </div>
      </section>

      {/* ── how it works ────────────────────────────────── */}
      <section className="section" id="how">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <TabPill>How it works</TabPill>
            <h2 className="section-head__title">Three steps. That&apos;s it.</h2>
          </Ink>
          <div className="how">
            <StepArc />
            <div className="how__cards">
              {[
                { n: "1", t: "Tell us what happened.", d: "In your own words. The injury, the denial letter, the write-up. Type it, say it, or send a photo of the paper." },
                { n: "2", t: "We draft and file.", d: "We ask a few questions, pull the deadlines and rules that apply, and write the claim, appeal, or grievance. You review it before it goes out." },
                { n: "3", t: "You get the paper trail.", d: "The filed document, the certified-mail receipt, and a plain-words plan for what comes next." },
              ].map((s, i) => (
                <Ink key={s.n} as="article" fx="rise" delay={i * 90} className={`step step--${i}`}>
                  <span className={`step__bubble step__bubble--${i % 2 === 0 ? "seafoam" : "current"}`}>
                    {s.n}
                  </span>
                  <h3 className="step__t">{s.t}</h3>
                  <p className="step__d">{s.d}</p>
                  {s.n === "3" && <CheckChip className="step__chip">Filed</CheckChip>}
                </Ink>
              ))}
            </div>
          </div>
          <Ink as="p" fx="rise" delay={90} className="how__support">
            And when a case needs a person, a real one steps in,{" "}
            <em className="accent-ocean">in your language.</em>
          </Ink>
        </div>
      </section>

      {/* ── the catalog ─────────────────────────────────── */}
      <section className="section" id="catalog">
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

          <div className="catalog">
            {CATALOG.map((o, i) => (
              <Ink
                as="div"
                fx="rise"
                delay={(i % 2) * 60}
                key={o.title}
                className="catalog__cell"
              >
                <details className="cat">
                  <summary className="cat__sum">
                    <span className={`category-chip category-chip--${groupTone(o.group)}`}>
                      {o.group}
                    </span>
                    <span className="cat__title">{o.title}</span>
                    <span className="cat__toggle" aria-hidden="true">
                      <span className="cat__toggle-icon" />
                    </span>
                  </summary>
                  <div className="cat__open">
                    <div className="cat__thread">
                      <div className="bubble bubble--ask">
                        <span className="bubble__who">You tell us</span>
                        <p className="bubble__text">{o.ask}</p>
                      </div>
                      <div className="bubble bubble--answer">
                        <span className="bubble__who">We hand you</span>
                        <p className="bubble__text">{o.deliver}</p>
                      </div>
                    </div>
                    <div className="cat__foot">
                      <a className="btn btn--accent btn--sm" href={LINKS.getStarted}>
                        <span className="btn__label">
                          Get this filed <span className="arrow" aria-hidden="true">→</span>
                        </span>
                      </a>
                      <CheckChip />
                    </div>
                  </div>
                </details>
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

      {/* ── support ─────────────────────────────────────── */}
      <section className="section" id="support">
        <div className="wrap">
          <div className="panel panel--current panel--ocorner support">
            <span className="blob" aria-hidden="true" />
            <span className="support__halo" aria-hidden="true" />
            <Ink as="div" fx="rise" className="support__tab">
              <TabPill>The human side</TabPill>
            </Ink>
            <Ink as="h2" fx="rise" delay={70} className="support__title">
              Help whenever you need it.
            </Ink>
            <Ink as="p" fx="rise" delay={120} className="support__p">
              A claim is stressful. A denial is worse. You shouldn&apos;t be doing this alone at
              midnight.
            </Ink>
            <Ink as="p" fx="rise" delay={160} className="support__p">
              Our support line is open around the clock, in ten languages, ready to take what
              happened in plain words. And when a case needs a person, a real one steps in and stays
              on it.
            </Ink>
            <Ink as="blockquote" fx="rise" delay={200} className="support__quote">
              You&apos;re never stuck. You&apos;re <em>never alone</em> with it.
            </Ink>
          </div>
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
