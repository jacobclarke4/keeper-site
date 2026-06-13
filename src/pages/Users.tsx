import { type CSSProperties } from "react";
import type { NavFn } from "../lib/nav";
import { Ink, RuleDraw, useInView } from "../lib/motion";
import { Arrow, Btn, FootNotes, PageFolio, SectionHead, Stamp, Sup } from "../components/primitives";

// Premium-basket pricing — single source of truth.
const BASKETS = [
  { count: 3, price: 10 },
  { count: 5, price: 15 },
  { count: 10, price: 20 },
] as const;

const MEMBERSHIP_ITEMS: Array<[string, string]> = [
  ["Every free tool and outcome", "Plus one premium outcome each month, included."],
  ["Your Concierge", "A real person to call or message whenever you're stuck or starting something new."],
  ["Bespoke requests", "Need something that doesn't exist? Submit the form or tell your Concierge. One-day response, guaranteed. Price and timeline are always resolved before any work begins."],
  ["The Outcome Wallet", "One place to pay, track, and stay protected."],
  ["Every in-person event", "Included with membership."],
];

/** The membership bill prints itself, row by row, ending on the total. */
function MembershipBill() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -12% 0px" });
  return (
    <div ref={ref} className={`bill${inView ? " is-printing" : ""}`}>
      <div className="bill__masthead mono">
        <span>MEMBERSHIP — ITEMIZED</span>
        <span className="tabnum">$14.00 / MO</span>
      </div>
      {MEMBERSHIP_ITEMS.map(([t, d], i) => (
        <div key={t} className="bill__row" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
          <div className="bill__item">
            <h4 className="bill__t display">{t}</h4>
            <p className="bill__d">{d}</p>
          </div>
          <Stamp tone="ocean" delay={140 + i * 90} tilt={i % 2 === 0 ? -2.5 : 1.5} className="bill__stamp">
            INCLUDED
          </Stamp>
        </div>
      ))}
      <div className="bill__total" style={{ "--d": `${MEMBERSHIP_ITEMS.length * 90 + 80}ms` } as CSSProperties}>
        <span className="bill__total-label mono">TOTAL — EVERYTHING ABOVE</span>
        <span className="bill__total-dots" aria-hidden="true" />
        <span className="bill__total-amt display tabnum">$14.00<span className="bill__total-per mono"> / MO</span></span>
      </div>
    </div>
  );
}

/** The Wallet hard-cap meter: fills, then stops dead at the CAP tick. */
function CapMeter() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -15% 0px" });
  return (
    <div ref={ref} className={`capmeter${inView ? " is-filled" : ""}`}>
      <div className="capmeter__labels mono">
        <span>THIS MONTH'S SPEND</span>
        <span className="capmeter__cap-label">HARD CAP — SET BY YOU</span>
      </div>
      <div className="capmeter__track">
        <span className="capmeter__fill" />
        <span className="capmeter__tick" aria-hidden="true" />
        <span className="capmeter__beyond" aria-hidden="true" />
      </div>
      <div className="capmeter__foot mono">
        <span>NOTHING RUNS PAST THE CAP. NOTHING.</span>
        <span>METERS RUNNING IN THE BACKGROUND — NONE</span>
      </div>
    </div>
  );
}

export function UsersPage({ nav }: { nav: NavFn }) {
  return (
    <div className="page-users">
      {/* ── section front ──────────────────────────────── */}
      <section className="edition-front">
        <div className="wrap">
          <Ink as="div" fx="rise">
            <span className="kicker">For individuals &amp; businesses</span>
          </Ink>
          <Ink as="h1" fx="rise" delay={90} className="edition-front__h1 display">
            Your outcomes, <em>handled.</em>
          </Ink>
          <Ink as="p" fx="rise" delay={180} className="edition-front__lede lede-cap">
            One membership. Every free tool and outcome we make, a premium outcome each month,
            and a real Concierge on call. Run the platform yourself, or hand it to us, whatever
            gets it done.
          </Ink>
          <Ink as="div" fx="rise" delay={270} className="edition-front__ctas">
            <Btn variant="solid" size="lg" onClick={() => nav("waitlist")}>
              Get started — $14/mo<Sup>¹</Sup>
            </Btn>
          </Ink>
        </div>
      </section>

      {/* ── two ways in — split spread ───────────────────── */}
      <section className="section sec-dim">
        <div className="wrap">
          <SectionHead
            folio="01"
            kicker="Two ways in"
            title={<>Drive it yourself, or <em>let us drive.</em></>}
          />
          <div className="spread">
            <Ink as="article" fx="rise" className="spread__col">
              <span className="spread__tag mono">SELF-SERVE</span>
              <h3 className="spread__h display">
                Browse the catalog, search the tools, and use our chat interface to get where
                you're going.
              </h3>
              <p className="spread__d">Everything's built to run without a manual.</p>
            </Ink>
            <Ink as="article" fx="rise" delay={120} className="spread__col spread__col--boxed">
              <span className="spread__tag mono">CONCIERGE</span>
              <h3 className="spread__h display">
                Call or message your Concierge, and they'll walk you through it.
              </h3>
              <p className="spread__d">
                They'll point you to the right existing tool or outcome, or, if the thing you
                need doesn't exist yet, scope a bespoke build with you. Your call, every time.
              </p>
            </Ink>
          </div>
        </div>
      </section>

      {/* ── the itemized bill ───────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            folio="02"
            kicker="Membership"
            title={<>Everything below, for <em>$14 a month.</em></>}
          />
          <MembershipBill />
        </div>
      </section>

      {/* ── rate card ───────────────────────────────────── */}
      <section className="section sec-dim">
        <div className="wrap">
          <SectionHead
            folio="03"
            kicker="Go further · Rate card"
            title={<>Need more than one? <em>Buy a basket.</em></>}
            sub="Stock up on premium outcomes and tools at a better rate. Mix and match however you like."
          />
          <div className="ratecard">
            {BASKETS.map((b, i) => (
              <Ink key={b.count} as="button" fx="rise" delay={i * 100} className="ratecard__tier" onClick={() => nav("waitlist")} type="button">
                <span className="ratecard__tag mono">BASKET Nº {String(i + 1).padStart(2, "0")}</span>
                <span className="ratecard__price display tabnum">
                  {b.count} <span className="ratecard__for">for</span> ${b.price}
                </span>
                <span className="ratecard__d">{b.count} premium outcomes and tools, mix and match.</span>
                <span className="ratecard__cta mono">RESERVE → </span>
              </Ink>
            ))}
          </div>
        </div>
      </section>

      {/* ── the wallet — navy double-entry ledger ───────── */}
      <section className="section sec-navy">
        <div className="wrap">
          <SectionHead
            onDark
            folio="04"
            kicker="Built into every membership"
            title={<>One ledger. <em>Zero surprise bills.</em></>}
            sub="The Wallet is how you pay and how the work gets paid for, with hard caps, full visibility, and no meters running in the background. We're building it into something more, too: a virtual card for the APIs and services you sign up for, that we'll monitor, help you budget for, and recommend smarter options for as you grow."
          />
          <div className="ledger">
            <Ink as="div" fx="rise" className="ledger__col">
              <h4 className="ledger__h mono">WHAT IT DOES TODAY</h4>
              <ul>
                {[
                  "Hard spending caps and runaway-bill circuit breakers.",
                  "Full visibility, with no meters running in the background.",
                  "One place to pay, track, and stay protected.",
                ].map((t) => (
                  <li key={t}>
                    <span className="ledger__tick" aria-hidden="true">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Ink>
            <Ink as="div" fx="rise" delay={120} className="ledger__col">
              <h4 className="ledger__h mono">WHERE IT'S GOING</h4>
              <ul>
                {[
                  "A virtual card so your real card never touches a third-party vendor.",
                  "Subscription and API monitoring, we watch what you're paying for and flag what you don't need.",
                  "Budgeting help and recommendations as your needs change.",
                ].map((t) => (
                  <li key={t}>
                    <span className="ledger__tick ledger__tick--soon" aria-hidden="true">▸</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Ink>
          </div>
          <CapMeter />
        </div>
      </section>

      {/* ── five steps ──────────────────────────────────── */}
      <section className="section sec-dim">
        <div className="wrap">
          <SectionHead folio="05" kicker="How it works" title="From ask to done, in five steps." />
          <div className="steps">
            <RuleDraw className="steps__spine" />
            {[
              { n: "I", t: "You choose it.", d: "Pick from the catalog, or tell us what you need." },
              { n: "II", t: "We scope it.", d: "Self-serve, or your Concierge walks through what \"done\" means, and what it costs, before anything starts." },
              { n: "III", t: "We build it.", d: "Existing tool, existing outcome, or a bespoke build produced inside an agreed timeline." },
              { n: "IV", t: "We hand it over.", d: "Finished, explained, and yours to keep." },
              { n: "V", t: "You stay in control.", d: "One price, one Wallet, one cancel button. No meters, no overages, no retention loops." },
            ].map((s, i) => (
              <Ink key={s.n} as="div" fx="rise" delay={i * 90} className="steps__item">
                <span className="steps__n display">{s.n}</span>
                <h4 className="steps__t">{s.t}</h4>
                <p className="steps__d">{s.d}</p>
              </Ink>
            ))}
          </div>
          <Ink as="div" fx="rise" delay={200} className="section__cta-row">
            <Btn variant="solid" onClick={() => nav("waitlist")}>
              Get started — $14/mo <Arrow />
            </Btn>
          </Ink>
          <FootNotes
            notes={[["¹", <>One membership, $14/month. Price and timeline are always resolved before any work begins. Cancel anytime — one button, no retention loops.</>]]}
          />
        </div>
      </section>

      <PageFolio n="2" />
    </div>
  );
}
