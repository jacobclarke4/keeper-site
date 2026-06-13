import { scrollToId, type NavFn } from "../lib/nav";
import { Ink } from "../lib/motion";
import { Btn, EditorNote, GuaranteePlate, PageFolio, Plate, SectionHead, Stamp } from "../components/primitives";

/** The warmest object on the site: a phone memo, routed. */
function MemoSlip() {
  return (
    <Plate cutline="PLATE — A MESSAGE, ROUTED." className="memo-plate" tilt={0.8} delay={300}>
      <div className="memo">
        <div className="memo__head mono">WHILE YOU WERE OUT</div>
        <div className="memo__rows mono">
          <div className="memo__row">
            <span className="memo__label">FROM:</span>
            <span className="memo__value">A USER</span>
          </div>
          <div className="memo__row">
            <span className="memo__label">NEEDS:</span>
            <span className="memo__value">A YEAR-END TAX PACKAGE</span>
          </div>
          <div className="memo__row">
            <span className="memo__label">ROUTED:</span>
            <span className="memo__value">CONCIERGE → MAKER → DELIVERED</span>
          </div>
        </div>
        <Stamp tone="ocean" delay={900} tilt={-3} className="memo__stamp">
          HANDLED
        </Stamp>
      </div>
    </Plate>
  );
}

export function ConciergesPage({ nav }: { nav: NavFn }) {
  return (
    <div className="page-concierges">
      {/* ── section front + memo plate ──────────────────── */}
      <section className="edition-front edition-front--split">
        <div className="wrap edition-front__grid">
          <div>
            <Ink as="div" fx="rise">
              <span className="kicker">For guides · The human desk</span>
            </Ink>
            <Ink as="h1" fx="rise" delay={90} className="edition-front__h1 display">
              Be the human <em>who makes it land.</em>
            </Ink>
            <Ink as="p" fx="rise" delay={180} className="edition-front__lede lede-cap">
              A Concierge is the person a User can call. You scope what they need, route them to
              the right tool or outcome, walk them through it, and when the thing they want
              doesn't exist yet, you help bring it into being. You're the difference between a
              platform and a partner.
            </Ink>
            <Ink as="div" fx="rise" delay={270} className="edition-front__ctas">
              <Btn variant="solid" size="lg" onClick={() => nav("concierge-apply")}>
                Join the Concierge waitlist
              </Btn>
              <Btn variant="ghost" size="lg" onClick={() => scrollToId("role")}>
                What a Concierge does
              </Btn>
            </Ink>
          </div>
          <MemoSlip />
        </div>
      </section>

      {/* ── the role — two-article spread ───────────────── */}
      <section className="section sec-dim" id="role">
        <div className="wrap">
          <SectionHead
            folio="01"
            kicker="The role"
            title={<>Two jobs, <em>one goal.</em></>}
            sub="Every User can reach a Concierge by call or message. From there, your work splits two ways, and both end in the same place: the outcome, delivered."
          />
          <div className="spread">
            <Ink as="article" fx="rise" className="spread__col">
              <span className="spread__tag mono">ROUTE AND GUIDE</span>
              <h3 className="spread__h display">Most of the time, the tool or outcome already exists.</h3>
              <p className="spread__d">
                You find the right one, point the User to it, and walk them through using it so
                they actually get the result, not just the link.
              </p>
            </Ink>
            <Ink as="article" fx="rise" delay={120} className="spread__col spread__col--boxed">
              <span className="spread__tag mono">SCOPE THE BESPOKE</span>
              <h3 className="spread__h display">When what they need doesn't exist yet, you scope a custom build.</h3>
              <p className="spread__d">
                What "done" looks like, what it'll take, and the timeline, handed off cleanly so
                the right Maker can build it.
              </p>
            </Ink>
          </div>
        </div>
      </section>

      {/* ── getting in — apply sequence ─────────────────── */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            folio="02"
            kicker="Getting in"
            title={<>A real role you <em>apply for.</em></>}
            sub="Concierge is a position, not a perk, and we bring people on deliberately."
          />
          <div className="steps steps--3">
            {[
              { n: "I", t: "You apply.", d: "For now, that means joining the waitlist, full applications open soon." },
              { n: "II", t: "We check your foundation.", d: "Required testing, certification, and your AIQ result tell us you're ready to guide others." },
              { n: "III", t: "We accept in cohorts.", d: "As more Users join the platform, we bring on new cohorts of Concierges to match, so there's always enough work for everyone we accept." },
            ].map((s, i) => (
              <Ink key={s.n} as="div" fx="rise" delay={i * 90} className="steps__item">
                <span className="steps__n display">{s.n}</span>
                <h4 className="steps__t">{s.t}</h4>
                <p className="steps__d">{s.d}</p>
              </Ink>
            ))}
          </div>
          <Ink as="div" fx="rise" delay={200} className="section__cta-row">
            <Btn variant="solid" onClick={() => nav("concierge-apply")}>
              Join the Concierge waitlist
            </Btn>
          </Ink>
        </div>
      </section>

      {/* ── the economics — editor's note + honest stub ─── */}
      <section className="section sec-dim">
        <div className="wrap">
          <SectionHead
            folio="03"
            kicker="The economics"
            title={<>Paid for <em>showing up for people.</em></>}
          />
          <EditorNote
            lead={<em>The more people you genuinely help, the more you earn.</em>}
            foot="EXACT STRUCTURE PUBLISHED IN FULL BEFORE COHORTS OPEN."
          >
            <p className="editor-note__body">
              Concierges are paid based on the interactions they have with Users. We're
              finalizing the exact pay structure and will publish it in full before cohorts
              open.
            </p>
            <div className="stub" aria-hidden="true">
              {["PER-INTERACTION RATE", "MONTHLY FLOOR", "COHORT BONUS"].map((label) => (
                <div key={label} className="stub__row">
                  <span className="stub__label mono">{label}</span>
                  <span className="stub__bar" />
                </div>
              ))}
            </div>
          </EditorNote>
        </div>
      </section>

      {/* ── supply, on purpose + the floor ──────────────── */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            folio="04"
            kicker="Supply, on purpose"
            title={<>We cap how many Concierges we let in. <em>On purpose.</em></>}
            sub="We limit the number of Concierges accepted onto the platform against the number of Users, so there's always enough demand to go around. Fewer Concierges who can build a living here beats a crowded queue where no one can."
          />
          <GuaranteePlate role="Concierge" ctaLabel="Join the Concierge waitlist" onCta={() => nav("concierge-apply")} />
        </div>
      </section>

      <PageFolio n="3" />
    </div>
  );
}
