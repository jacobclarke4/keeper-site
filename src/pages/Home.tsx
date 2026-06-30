import { datelineToday } from "../lib/nav";
import { LINKS, goExternal } from "../lib/links";
import { OUTCOMES_TICKER, CATALOG, TIERS, FAQ } from "../lib/outcomes";
import { Ink, RuleDraw, Teletype, useInView } from "../lib/motion";
import {
  Arrow,
  Btn,
  EditorNote,
  FootNotes,
  Kicker,
  PageFolio,
  Rotator,
  Seal,
  SectionHead,
  Stamp,
  Sup,
} from "../components/primitives";

/* ──────────────────────────────────────────────────────────
   The hero's companion column — a live "delivered" dispatch so
   the hero is full and balanced (never a blank panel).
   ────────────────────────────────────────────────────────── */

const DELIVERED: Array<[string, string]> = [
  ["A weekend trip", "planned to the dollar"],
  ["A confusing bill", "explained in plain words"],
  ["The dreaded form", "filled out and filed"],
];

function DispatchPanel() {
  return (
    <Ink as="aside" fx="wash" delay={420} className="dispatchcard">
      <div className="dispatchcard__head mono">
        <span className="dispatchcard__fleuron" aria-hidden="true">✦</span>
        TODAY&apos;S WIRE · DELIVERED
      </div>
      <div className="dispatchcard__wire">
        {/* skip the first 3 — they're the pinned DONE rows below, so the wire never repeats them */}
        <Rotator items={OUTCOMES_TICKER.slice(3)} />
      </div>
      <ul className="dispatchcard__rows">
        {DELIVERED.map(([what, how], i) => (
          <li className="dispatchcard__row" key={what}>
            <span className="dispatchcard__what">
              {what}, <em>{how}</em>.
            </span>
            <Stamp tone="ocean" delay={700 + i * 120} tilt={i % 2 === 0 ? -2.5 : 1.5}>
              DONE
            </Stamp>
          </li>
        ))}
      </ul>
      <div className="dispatchcard__foot mono">
        YOU ASK · WE DO IT · YOU GET THE FINISHED THING
      </div>
    </Ink>
  );
}

/* The Wallet hard-cap meter: fills, then stops dead at the CAP tick. */
function CapMeter() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -15% 0px" });
  return (
    <div ref={ref} className={`capmeter${inView ? " is-filled" : ""}`}>
      <div className="capmeter__labels mono">
        <span>THIS MONTH&apos;S SPEND</span>
        <span className="capmeter__cap-label">YOUR BALANCE · THE ONLY LIMIT</span>
      </div>
      <div className="capmeter__track">
        <span className="capmeter__fill" />
        <span className="capmeter__tick" aria-hidden="true" />
        <span className="capmeter__beyond" aria-hidden="true" />
      </div>
      <div className="capmeter__foot mono">
        <span>NOTHING RUNS PAST YOUR BALANCE. NOTHING.</span>
        <span>NO CREDIT · NO HIDDEN FEES · NO METERS</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   The Outcome Company — the front page, read top to bottom.
   ────────────────────────────────────────────────────────── */

export function HomePage() {
  return (
    <div className="page-home">
      {/* ── §00 hero ───────────────────────────────────── */}
      <section className="hero" id="top">
        <div className="wrap hero__grid">
          <div className="hero__lead">
            <div className="hero__dateline mono">
              <Teletype text={`A COMMONWEALTH COMPANY · ${datelineToday()} · $14/MO`} startDelay={300} />
            </div>
            <RuleDraw className="hero__rule" />

            <Ink as="h1" fx="rise" delay={120} className="hero__h1 display">
              Tell us what you need done. <em>Consider it handled.</em>
            </Ink>

            <Ink as="p" fx="rise" delay={240} className="hero__lede">
              Planning the trip. Making sense of a confusing bill. Filling out the form you&apos;ve
              been dreading.
            </Ink>

            <Ink as="p" fx="rise" delay={320} className="hero__say">
              You ask, we do it, and hand you the finished thing. <strong>No apps to learn. No
              tech to figure out.</strong>
            </Ink>

            <Ink as="div" fx="rise" delay={420} className="hero__price">
              <span className="hero__price-amt display">$14</span>
              <span className="hero__price-per">a month</span>
            </Ink>

            <Ink as="div" fx="rise" delay={500} className="hero__ctas">
              <Btn variant="solid" size="lg" href={LINKS.getStarted}>
                Get started <Arrow />
              </Btn>
            </Ink>

            <Ink as="p" fx="rise" delay={580} className="hero__micro">
              Cancel anytime. We&apos;ll never charge you for anything you didn&apos;t say yes to.
            </Ink>
          </div>

          <DispatchPanel />
        </div>
      </section>

      {/* ── §01 the bridge ─────────────────────────────── */}
      <section className="section sec-dim" id="bridge">
        <div className="wrap">
          <SectionHead
            folio="01"
            kicker="Who this is for"
            title={<>Finally, technology built for you, <em>not against you.</em></>}
          />
          <div className="bridge">
            <Ink as="p" fx="rise" className="bridge__lede lede-cap">
              For a long time, the best new tools were never made with you in mind. Or worse, they
              were made to take advantage of you.
            </Ink>
            <Ink as="p" fx="rise" delay={80} className="bridge__turn display">
              We&apos;re here to <em>change that.</em>
            </Ink>
            <Ink as="p" fx="rise" delay={140} className="bridge__p">
              It doesn&apos;t matter where you&apos;re starting from, how old you are, what language
              you speak, or how much you know about any of this. You tell us what you need. We take
              care of it.
            </Ink>
            <Ink as="p" fx="rise" delay={200} className="bridge__p">
              That&apos;s the whole idea. We meet you exactly where you are, and we bring the good
              parts of this new technology to you, without the noise, the confusion, or the catch.
            </Ink>
          </div>
        </div>
      </section>

      {/* ── §02 how it works ───────────────────────────── */}
      <section className="section" id="how">
        <div className="wrap">
          <SectionHead folio="02" kicker="How it works" title="Three steps. That's it." />
          <div className="steps steps--3">
            <RuleDraw className="steps__spine" />
            {[
              { n: "1", t: "Tell us what you need.", d: "In your own words. Type it or say it, the way you'd ask a friend who's good at this stuff." },
              { n: "2", t: "We do the work.", d: "The looking-up, the figuring-out, the back-and-forth. All of it, on our side." },
              { n: "3", t: "You get the finished thing.", d: "A real result you can use. Done, and handed to you." },
            ].map((s, i) => (
              <Ink key={s.n} as="div" fx="rise" delay={i * 90} className="steps__item">
                <span className="steps__n display">{s.n}</span>
                <h3 className="steps__t">{s.t}</h3>
                <p className="steps__d">{s.d}</p>
              </Ink>
            ))}
          </div>
          <Ink as="p" fx="rise" delay={120} className="how__support">
            And if you ever get stuck, our support line is open whenever you need it, <em>with help
            in your language.</em>
          </Ink>
          <Ink as="div" fx="rise" delay={180} className="section__cta-row">
            <Btn variant="solid" href={LINKS.getStarted}>
              Get started <Arrow />
            </Btn>
          </Ink>
        </div>
      </section>

      {/* ── §03 the catalog ────────────────────────────── */}
      <section className="section sec-dim" id="catalog">
        <div className="wrap">
          <SectionHead
            folio="03"
            kicker="What we can do"
            title={<>Real things, <em>done for you.</em></>}
            sub="An outcome is just that: a real, finished result. Not a tool you have to learn. Not a tab you have to keep open. The actual thing you wanted, done. Here are some of the things people ask us for. Open any one to see exactly how it works."
          />
          <div className="catalog">
            {CATALOG.map((o, i) => (
              <Ink as="div" fx="rise" delay={(i % 2) * 70} key={o.title}>
                <details className="cat">
                  <summary className="cat__sum">
                    <span className="cat__group mono">{o.group}</span>
                    <span className="cat__title display">{o.title}</span>
                    <span className="cat__more mono">See how it works <span className="cat__chev" aria-hidden="true">→</span></span>
                  </summary>
                  <div className="cat__detail">
                    <p className="cat__line"><span className="cat__k mono">YOU TELL US</span> {o.ask}</p>
                    <p className="cat__line"><span className="cat__k mono">WE HAND YOU</span> {o.deliver}</p>
                    <a className="btn btn--link cat__cta" href={LINKS.getStarted}>
                      <span className="btn__label">Get this done <span className="arrow" aria-hidden="true">→</span></span>
                    </a>
                  </div>
                </details>
              </Ink>
            ))}
          </div>
          <Ink as="div" fx="rise" className="catalog__foot">
            <p className="catalog__count display">
              Over <em>100 things</em> we can do for you today, and more every week.
            </p>
            <Btn variant="ghost" href={LINKS.getStarted}>
              Browse what we can do <Arrow />
            </Btn>
          </Ink>
        </div>
      </section>

      {/* ── §04 pricing ────────────────────────────────── */}
      <section className="section" id="pricing">
        <div className="wrap">
          <SectionHead folio="04" kicker="Pricing" title={<>Simple pricing. <em>No surprises.</em></>} />

          <EditorNote
            lead={<>We&apos;re just getting started, and so are <em>you.</em></>}
            foot="A BETA PROMISE · WE TELL YOU BEFORE ANYTHING CHANGES"
          >
            <p className="editor-note__body">
              You&apos;re one of our first members, which means you&apos;re getting in early. Prices
              may change as we grow, but here&apos;s our promise: we&apos;ll always tell you before
              anything changes, and you&apos;ll never be charged for something you didn&apos;t say
              yes to.
            </p>
          </EditorNote>

          <div className="plans">
            {TIERS.map((t, i) => (
              <Ink as="div" fx="rise" delay={i * 100} key={t.name} className={`plan${t.soon ? " plan--soon" : ""}`}>
                <span className="plan__tag mono">{t.name}</span>
                <span className="plan__price display">
                  {t.price}{t.per && <span className="plan__per mono">{t.per}</span>}
                </span>
                <p className="plan__blurb">{t.blurb}</p>
                {!t.soon && (
                  <a className="btn btn--ghost btn--sm plan__cta" href={LINKS.getStarted}>
                    <span className="btn__label">Get started <span className="arrow" aria-hidden="true">→</span></span>
                  </a>
                )}
              </Ink>
            ))}
          </div>

          <Ink as="aside" fx="rise" className="heavy">
            <h3 className="heavy__h display">
              Heavy jobs: only if you choose them, <em>only at cost.</em>
            </h3>
            <p className="heavy__p">
              Once in a while, a request takes a lot of computing power to finish. When that happens,
              we&apos;ll show you exactly what it costs <em>before</em> we start, and we&apos;ll
              never charge you more than 14% on top, just enough to keep the lights on. Nothing gets
              built and billed behind your back. You always say yes first.
            </p>
            <p className="heavy__note mono">
              DURING BETA, WE&apos;RE COVERING THESE OURSELVES WHILE WE LEARN WHAT THEY REALLY COST.
            </p>
          </Ink>

          <Ink as="div" fx="rise" delay={120} className="section__cta-row">
            <Btn variant="solid" href={LINKS.getStarted}>
              Get started: $14/mo<Sup>¹</Sup> <Arrow />
            </Btn>
          </Ink>

          <FootNotes
            notes={[["¹", <>One membership, $14/month. A few heavy requests may cost more to run, always shown and agreed before we begin. Cancel anytime. One button, no retention loops.</>]]}
          />
        </div>
      </section>

      {/* ── §05 support ────────────────────────────────── */}
      <section className="section sec-dim" id="support">
        <div className="wrap">
          <SectionHead folio="05" kicker="The human side" title="Help whenever you need it." />
          <div className="support">
            <Ink as="p" fx="rise" className="support__p">
              Not everyone wants to hand everything to a machine, and you shouldn&apos;t have to.
            </Ink>
            <Ink as="p" fx="rise" delay={80} className="support__p">
              That&apos;s why there&apos;s always a way to reach someone. Our support line is open
              around the clock, in your language, ready to take your request in plain words and get
              it done. And when something really needs a person, a real one steps in.
            </Ink>
            <Ink as="blockquote" fx="rise" delay={140} className="pullquote support__quote">
              You&apos;re never stuck. You&apos;re <em>never alone</em> with it.
            </Ink>
          </div>
        </div>
      </section>

      {/* ── §06 the wallet ─────────────────────────────── */}
      <section className="section sec-navy" id="wallet">
        <div className="wrap">
          <SectionHead
            onDark
            folio="06"
            kicker="The Wallet"
            title={<>Your money <em>stays yours.</em></>}
            sub="Everything you spend comes from your own balance: money you've put in, nothing more. There's no credit, no hidden fees, and no way for a bill to quietly grow while you're not looking. You'll always know what something costs before it happens. Always."
          />
          <CapMeter />
        </div>
      </section>

      {/* ── §07 part of something bigger ───────────────── */}
      <section className="section commonwealth" id="commonwealth">
        <div className="wrap commonwealth__inner">
          <div className="commonwealth__copy">
            <Kicker onDark>Part of something bigger</Kicker>
            <Ink as="h2" fx="rise" delay={70} className="commonwealth__h display">
              One part of <em>Commonwealth.</em>
            </Ink>
            <Ink as="p" fx="rise" delay={140} className="commonwealth__p">
              The Outcome Company is one part of Commonwealth, a community built on a simple
              promise: bring everyone into this new world together, and leave no one behind.
            </Ink>
            <Ink as="p" fx="rise" delay={200} className="commonwealth__p">
              Half of every dollar of profit goes back to the community. And that promise can never
              be sold or taken away. It&apos;s written down, and it&apos;s binding.
            </Ink>
            <Ink as="div" fx="rise" delay={260} className="commonwealth__cta">
              <Btn variant="ghost-dark" onClick={goExternal(`${LINKS.commonwealth}charter`)}>
                Read the Charter <Arrow />
              </Btn>
            </Ink>
          </div>
          <div className="commonwealth__seal">
            <Seal size={160} />
          </div>
        </div>
      </section>

      {/* ── §08 FAQ ────────────────────────────────────── */}
      <section className="section" id="faq">
        <div className="wrap">
          <SectionHead folio="07" kicker="Questions" title="Good questions, straight answers." />
          <div className="faq">
            {FAQ.map((f) => (
              <details className="faq__item" key={f.q}>
                <summary className="faq__q">
                  <span className="faq__q-text">{f.q}</span>
                  <span className="faq__sign" aria-hidden="true" />
                </summary>
                <div className="faq__a">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <PageFolio n="1" />
    </div>
  );
}
