import { useEffect, useState } from "react";
import { LINKS, goExternal } from "../lib/links";
import { OUTCOMES_TICKER, CATALOG, TIERS, FAQ } from "../lib/outcomes";
import { Ink, usePrefersReducedMotion } from "../lib/motion";
import { Arrow, Btn, CheckChip, CurrentLine, Eyebrow } from "../components/primitives";
import { scrollToId } from "../lib/nav";

/* ──────────────────────────────────────────────────────────
   The Outcome Company — The Current Editorial.
   The app's design language applied to the marketing story:
   a centered serif statement over the Current, a wash-ocean
   how-it-works band, the catalog in the app's tile styling,
   pricing high on the page, and everything else folded into
   Questions.
   ────────────────────────────────────────────────────────── */

/* The hero's delivered outcomes — three received notes, each finished. */
const DELIVERED = [
  "A weekend trip, planned to the dollar.",
  "A confusing bill, explained in plain words.",
  "The dreaded form, filled out and filed.",
];

const STEPS = [
  { k: "Ask", t: "Tell us what you need.", d: "In your own words. Type it or say it, the way you'd ask a friend who's good at this stuff." },
  { k: "Work", t: "We do the work.", d: "The looking-up, the figuring-out, the back-and-forth. All of it, on our side." },
  { k: "Done", t: "You get the finished thing.", d: "A real result you can use. Done, and handed to you." },
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

/* The delivered wire — three finished notes on calm neutral surfaces. */
function DeliveredWire() {
  return (
    <div className="wrap wire" aria-label="Recently delivered">
      <p className="wire__cap">
        <span className="wire__cap-dot" aria-hidden="true" />
        Delivered today
      </p>
      <div className="wire__notes">
        {DELIVERED.map((line, i) => (
          <Ink as="article" fx="none" delay={520 + i * 90} key={line} className="note">
            {i === 0 && (
              <span className="note__ticker">
                <FadeRotator items={OUTCOMES_TICKER.slice(3)} />
              </span>
            )}
            <p className="note__line">{line}</p>
            <CheckChip delay={700 + i * 90} className="note__chip">
              Done
            </CheckChip>
          </Ink>
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <div className="page-home">
      {/* ── hero — the statement over the Current ─────────── */}
      <section className="hero" id="top">
        <div className="wrap">
          <Ink as="p" fx="rise" delay={160} className="hero__eyebrow">
            <Eyebrow>Everyday outcomes · $14 a month</Eyebrow>
          </Ink>
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
          <Ink as="div" fx="rise" delay={440} className="hero__ctas">
            <Btn variant="accent" size="lg" href={LINKS.getStarted}>
              Get started <Arrow />
            </Btn>
            <Btn variant="link" onClick={() => scrollToId("catalog")}>
              See what we can do <Arrow />
            </Btn>
          </Ink>
          <Ink as="p" fx="rise" delay={500} className="hero__micro">
            Cancel anytime. We&apos;ll never charge you for anything you didn&apos;t say yes to.
          </Ink>
        </div>
        <CurrentLine className="hero__current" />
        <DeliveredWire />
      </section>

      {/* ── how it works — the wash-ocean band ────────────── */}
      <section className="section how-band" id="how">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <Eyebrow tone="deep">How it works</Eyebrow>
            <h2 className="section-head__title">Three steps. That&apos;s it.</h2>
          </Ink>
          <div className="how__cards">
            {STEPS.map((s, i) => (
              <Ink key={s.k} as="article" fx="rise" delay={i * 90} className="step">
                <span className="step__kicker">{s.k}</span>
                <h3 className="step__t">{s.t}</h3>
                <p className="step__d">{s.d}</p>
                {i === STEPS.length - 1 && <CheckChip className="step__chip">Done</CheckChip>}
              </Ink>
            ))}
          </div>
          <Ink as="p" fx="rise" delay={90} className="how__support">
            And if you ever get stuck, our support line is open whenever you need it,{" "}
            <em>with help in your language.</em>
          </Ink>
          <Ink as="div" fx="rise" delay={135} className="cta-row">
            <Btn variant="accent" href={LINKS.getStarted}>
              Get started <Arrow />
            </Btn>
          </Ink>
        </div>
      </section>

      {/* ── the catalog — the app's tiles, told not wired ─── */}
      <section className="section" id="catalog">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <Eyebrow>What we can do</Eyebrow>
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
              <Ink as="div" fx="rise" delay={(i % 3) * 60} key={o.title} className="catalog__cell">
                <details className="cat">
                  <summary className="cat__sum">
                    <span className="group-label">{o.group}</span>
                    <span className="cat__title">{o.title}</span>
                    <span className="cat__toggle" aria-hidden="true">
                      <span className="cat__toggle-icon" />
                    </span>
                  </summary>
                  <div className="cat__open">
                    <div className="cat__thread">
                      <div className="exchange">
                        <span className="exchange__who">You tell us</span>
                        <p className="exchange__text">{o.ask}</p>
                      </div>
                      <div className="exchange exchange--deliver">
                        <span className="exchange__who">We hand you</span>
                        <p className="exchange__text">{o.deliver}</p>
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

      {/* ── who it's for — the quiet editorial pause ──────── */}
      <section className="section" id="bridge">
        <div className="wrap">
          <div className="bridge">
            <Ink as="p" fx="rise">
              <Eyebrow>Who this is for</Eyebrow>
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
              care of it. We meet you exactly where you are, and we bring the good parts of this new
              technology to you, without the noise, the confusion, or the catch.
            </Ink>
          </div>
        </div>
      </section>

      {/* ── pricing ─────────────────────────────────────── */}
      <section className="section" id="pricing">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="section-head__title">
              Simple pricing. <em>No surprises.</em>
            </h2>
          </Ink>

          <Ink as="aside" fx="rise" className="panel panel--wash promise">
            <p className="promise__lead">
              We&apos;re just getting started, and so are <em>you.</em>
            </p>
            <p className="promise__body">
              You&apos;re one of our first members, which means you&apos;re getting in early. Prices
              may change as we grow, but here&apos;s our promise: we&apos;ll always tell you before
              anything changes, and you&apos;ll never be charged for something you didn&apos;t say
              yes to.
            </p>
            <p className="promise__foot">A beta promise · we tell you before anything changes</p>
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

          <Ink as="aside" fx="rise" className="panel heavy">
            <h3 className="heavy__h">
              Heavy jobs: only if you choose them, <em>only at cost.</em>
            </h3>
            <p className="heavy__p">
              Once in a while, a request takes a lot of computing power to finish. When that happens,
              we&apos;ll show you exactly what it costs <em>before</em> we start, and we&apos;ll
              never charge you more than 14% on top, just enough to keep the lights on. Nothing gets
              built and billed behind your back. You always say yes first.
            </p>
            <p className="heavy__note">
              During beta, we&apos;re covering these ourselves while we learn what they really cost.
            </p>
          </Ink>

          <Ink as="div" fx="rise" delay={90} className="cta-row">
            <Btn variant="accent" size="lg" href={LINKS.getStarted}>
              Get started: $14/mo<sup className="fn-ref">1</sup><Arrow />
            </Btn>
          </Ink>

          <Ink as="p" fx="rise" className="fineprint">
            <sup className="fn-ref">1</sup> One membership, $14/month. A few heavy requests may cost
            more to run, always shown and agreed before we begin. Cancel anytime. One button, no
            retention loops.
          </Ink>
        </div>
      </section>

      {/* ── questions (+ the human side) ───────────────────── */}
      <section className="section" id="faq">
        <div className="wrap">
          <Ink as="div" fx="rise" className="section-head">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="section-head__title">
              Good questions, <em>straight answers.</em>
            </h2>
          </Ink>
          <Ink as="div" fx="rise" className="faq-lead">
            <p className="faq-lead__p">
              Not everyone wants to hand everything to a machine, and you shouldn&apos;t have to.
              Our support line is open around the clock, in your language, and when something really
              needs a person, a real one steps in.
            </p>
            <p className="faq-lead__pull">
              You&apos;re never stuck. You&apos;re <em>never alone</em> with it.
            </p>
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
          <Ink as="div" fx="rise" className="faq__charter">
            <Btn variant="ghost" onClick={goExternal(`${LINKS.commonwealth}charter`)}>
              Read the Commonwealth Charter <Arrow />
            </Btn>
          </Ink>
        </div>
      </section>
    </div>
  );
}
