import { useEffect, useState } from "react";
import { LINKS, goExternal } from "../lib/links";
import { OUTCOMES_TICKER, CATALOG, TIERS, FAQ } from "../lib/outcomes";
import { Ink, useInView, usePrefersReducedMotion } from "../lib/motion";
import { Arrow, Btn, CheckChip, OMark, Seal, TabPill } from "../components/primitives";

/* ──────────────────────────────────────────────────────────
   The Outcome Company — Sunlit Stationery.
   One continuous sheet of warm morning paper, big rounded tinted
   panels floating with soft shadows, and a giant friendly $14.
   ────────────────────────────────────────────────────────── */

/* The hero's delivered outcomes — three received notes, each finished. */
const DELIVERED = [
  "A weekend trip, planned to the dollar.",
  "A confusing bill, explained in plain words.",
  "The dreaded form, filled out and filed.",
];

/* A gentle fade rotator (no crossfade machinery — one line at a time). */
function FadeRotator({ items, interval = 3000 }: { items: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced || items.length <= 1) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % items.length), interval);
    return () => window.clearInterval(id);
  }, [items.length, interval, reduced]);
  return (
    <span className="fade-rotator" key={i}>
      {items[i % items.length]}
    </span>
  );
}

/* The dotted current arc that links the three step bubbles, drawn on enter. */
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
          strokeDasharray="2 12"
          pathLength={1}
        />
      </svg>
    </div>
  );
}

/* The hero delivered stack — three overlapped received notes. */
function DeliveredStack() {
  return (
    <div className="hero__stack" aria-label="Recently delivered">
      <p className="hero__stack-cap">Today&apos;s wire · Delivered</p>
      <div className="hero__notes">
        {DELIVERED.map((line, i) => (
          <Ink
            as="article"
            fx="none"
            delay={640 + i * 90}
            key={line}
            className={`note note--${i}`}
          >
            {i === 0 && (
              <span className="note__ticker">
                <FadeRotator items={OUTCOMES_TICKER.slice(3)} />
              </span>
            )}
            <p className="note__line">{line}</p>
            <CheckChip delay={820 + i * 90} className="note__chip">
              Done
            </CheckChip>
          </Ink>
        ))}
      </div>
      <p className="hero__stack-foot">You ask · we do it · you get the finished thing</p>
    </div>
  );
}

/* Money & bills → current tint; everything else alternates on first sight,
   for warm within-palette variety across the catalog groups. */
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
        <div className="hero__sun" aria-hidden="true">
          <OMark className="hero__o" />
        </div>
        <div className="wrap hero__grid">
          <div className="hero__lead">
            <Ink as="h1" fx="rise" delay={220} className="hero__h1">
              Tell us what you need done. <em>Consider it handled.</em>
            </Ink>

            <Ink as="p" fx="rise" delay={300} className="hero__lede">
              Planning the trip. Making sense of a confusing bill. Filling out the form you&apos;ve
              been dreading.
            </Ink>

            <Ink as="p" fx="rise" delay={360} className="hero__say">
              You ask, we do it, and hand you the finished thing.{" "}
              <strong>No apps to learn. No tech to figure out.</strong>
            </Ink>

            <Ink as="div" fx="none" delay={440} className="hero__medallion">
              <span className="medallion">
                <span className="medallion__amt">$14</span>
                <span className="medallion__per">a month</span>
              </span>
            </Ink>

            <Ink as="div" fx="rise" delay={540} className="hero__ctas">
              <Btn variant="accent" size="lg" href={LINKS.getStarted}>
                Get started <Arrow />
              </Btn>
            </Ink>

            <Ink as="p" fx="rise" delay={600} className="hero__micro">
              Cancel anytime. We&apos;ll never charge you for anything you didn&apos;t say yes to.
            </Ink>
          </div>

          <DeliveredStack />
        </div>
      </section>

      {/* ── the bridge ──────────────────────────────────── */}
      <section className="section" id="bridge">
        <div className="wrap">
          <div className="panel panel--seafoam panel--ocorner bridge">
            <span className="blob" aria-hidden="true" />
            <OMark className="bridge__dot bridge__dot--1" />
            <OMark className="bridge__dot bridge__dot--2" />
            <Ink as="div" fx="rise" className="bridge__tab">
              <TabPill>Who this is for</TabPill>
            </Ink>
            <Ink as="h2" fx="rise" delay={70} className="bridge__title">
              Finally, technology built for you, <em>not against you.</em>
            </Ink>
            <Ink as="p" fx="rise" delay={120} className="bridge__p">
              For a long time, the best new tools were never made with you in mind. Or worse, they
              were made to take advantage of you.
            </Ink>
            <Ink as="p" fx="rise" delay={160} className="bridge__turn">
              We&apos;re here to <em>change that.</em>
            </Ink>
            <Ink as="p" fx="rise" delay={200} className="bridge__p">
              It doesn&apos;t matter where you&apos;re starting from, how old you are, what language
              you speak, or how much you know about any of this. You tell us what you need. We take
              care of it.
            </Ink>
            <Ink as="p" fx="rise" delay={240} className="bridge__p">
              That&apos;s the whole idea. We meet you exactly where you are, and we bring the good
              parts of this new technology to you, without the noise, the confusion, or the catch.
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
                { n: "1", t: "Tell us what you need.", d: "In your own words. Type it or say it, the way you'd ask a friend who's good at this stuff." },
                { n: "2", t: "We do the work.", d: "The looking-up, the figuring-out, the back-and-forth. All of it, on our side." },
                { n: "3", t: "You get the finished thing.", d: "A real result you can use. Done, and handed to you." },
              ].map((s, i) => (
                <Ink key={s.n} as="article" fx="rise" delay={i * 90} className={`step step--${i}`}>
                  <span className={`step__bubble step__bubble--${i % 2 === 0 ? "seafoam" : "current"}`}>
                    {s.n}
                  </span>
                  <h3 className="step__t">{s.t}</h3>
                  <p className="step__d">{s.d}</p>
                  {s.n === "3" && <CheckChip className="step__chip">Done</CheckChip>}
                </Ink>
              ))}
            </div>
          </div>
          <Ink as="p" fx="rise" delay={90} className="how__support">
            And if you ever get stuck, our support line is open whenever you need it,{" "}
            <em className="accent-ocean">with help in your language.</em>
          </Ink>
          <Ink as="div" fx="rise" delay={135} className="cta-row">
            <Btn variant="accent" href={LINKS.getStarted}>
              Get started <Arrow />
            </Btn>
          </Ink>
        </div>
      </section>

      {/* ── the catalog ─────────────────────────────────── */}
      <section className="section" id="catalog">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <TabPill>What we can do</TabPill>
            <h2 className="section-head__title">
              Real things, <em>done for you.</em>
            </h2>
            <p className="section-head__sub">
              An outcome is just that: a real, finished result. Not a tool you have to learn. Not a
              tab you have to keep open. The actual thing you wanted, done. Here are some of the
              things people ask us for. Open any one to see exactly how it works.
            </p>
          </Ink>

          <div className="catalog">
            {CATALOG.map((o, i) => (
              <Ink
                as="div"
                fx="rise"
                delay={(i % 2) * 60}
                key={o.title}
                className={`catalog__cell${i === 0 ? " catalog__cell--feature" : ""}`}
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
                          Get this done <span className="arrow" aria-hidden="true">→</span>
                        </span>
                      </a>
                      <CheckChip />
                    </div>
                  </div>
                </details>
              </Ink>
            ))}
          </div>

          <Ink as="div" fx="rise" className="catalog__foot">
            <p className="catalog__count">
              Over <em>100 things</em> we can do for you today, and more every week.
            </p>
            <Btn variant="ghost" href={LINKS.getStarted}>
              Browse what we can do <Arrow />
            </Btn>
          </Ink>
        </div>
      </section>

      {/* ── pricing ─────────────────────────────────────── */}
      <section className="section" id="pricing">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <TabPill>Pricing</TabPill>
            <h2 className="section-head__title">
              Simple pricing. <em>No surprises.</em>
            </h2>
          </Ink>

          <Ink as="aside" fx="rise" className="panel panel--seafoam promise">
            <span className="blob" aria-hidden="true" />
            <p className="promise__lead">
              We&apos;re just getting started, and so are <em>you.</em>
            </p>
            <p className="promise__body">
              You&apos;re one of our first members, which means you&apos;re getting in early. Prices
              may change as we grow, but here&apos;s our promise: we&apos;ll always tell you before
              anything changes, and you&apos;ll never be charged for something you didn&apos;t say
              yes to.
            </p>
            <p className="promise__foot">
              <span className="chip-note">A beta promise</span> We tell you before anything changes.
            </p>
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

          <Ink as="aside" fx="rise" className="panel panel--current heavy">
            <span className="blob" aria-hidden="true" />
            <h3 className="heavy__h">
              Heavy jobs: only if you choose them, <em>only at cost.</em>
            </h3>
            <p className="heavy__p">
              Once in a while, a request takes a lot of computing power to finish. When that happens,
              we&apos;ll show you exactly what it costs <em className="accent-ocean">before</em> we
              start, and we&apos;ll never charge you more than 14% on top, just enough to keep the
              lights on. Nothing gets built and billed behind your back. You always say yes first.
            </p>
            <p className="heavy__note">
              During beta, we&apos;re covering these ourselves while we learn what they really cost.
            </p>
          </Ink>

          <Ink as="div" fx="rise" delay={90} className="cta-row">
            <Btn variant="accent" size="lg" href={LINKS.getStarted}>
              Get started: $14/mo<sup className="fn-ref">¹</sup> <Arrow />
            </Btn>
          </Ink>

          <Ink as="p" fx="rise" className="fineprint">
            <sup className="fn-ref">¹</sup> One membership, $14/month. A few heavy requests may cost
            more to run, always shown and agreed before we begin. Cancel anytime. One button, no
            retention loops.
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
              Not everyone wants to hand everything to a machine, and you shouldn&apos;t have to.
            </Ink>
            <Ink as="p" fx="rise" delay={160} className="support__p">
              That&apos;s why there&apos;s always a way to reach someone. Our support line is open
              around the clock, in your language, ready to take your request in plain words and get
              it done. And when something really needs a person, a real one steps in.
            </Ink>
            <Ink as="blockquote" fx="rise" delay={200} className="support__quote">
              <span className="support__bubble" aria-hidden="true">
                <OMark className="support__bubble-o" />
              </span>
              You&apos;re never stuck. You&apos;re <em>never alone</em> with it.
            </Ink>
          </div>
        </div>
      </section>

      {/* ── the wallet ──────────────────────────────────── */}
      <section className="section" id="wallet">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <TabPill>The Wallet</TabPill>
            <h2 className="section-head__title">
              Your money <em>stays yours.</em>
            </h2>
            <p className="section-head__sub">
              Everything you spend comes from your own balance: money you&apos;ve put in, nothing
              more. There&apos;s no credit, no hidden fees, and no way for a bill to quietly grow
              while you&apos;re not looking. You&apos;ll always know what something costs before it
              happens. Always.
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
                The Outcome Company is one part of Commonwealth, a community built on a simple
                promise: bring everyone into this new world together, and leave no one behind.
              </Ink>
              <Ink as="p" fx="rise" delay={160} className="commonwealth__p">
                Half of every dollar of profit goes back to the community. And that promise can never
                be sold or taken away. It&apos;s written down, and it&apos;s binding.
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
          <Ink as="div" fx="rise" className="section-head">
            <TabPill>Questions</TabPill>
            <h2 className="section-head__title">
              Good questions, <em>straight answers.</em>
            </h2>
          </Ink>
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
