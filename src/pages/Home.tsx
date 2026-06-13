import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BASE_URL, datelineToday, scrollToId } from "../lib/nav";
import { OUTCOMES_TICKER } from "../lib/intake";
import { LINKS, goExternal } from "../lib/links";
import { Ink, RuleDraw, Teletype } from "../lib/motion";
import { Arrow, Btn, FootNotes, Kicker, PageFolio, Plate, Rotator } from "../components/primitives";
import { FlywheelCut } from "../components/Flywheel";

const HANDOVER_IMG = `${BASE_URL}final-handover.jpg`;

/* ──────────────────────────────────────────────────────────
   The wire — DELIVERED · LIVE bulletin column.
   ────────────────────────────────────────────────────────── */

function WireColumn() {
  return (
    <Ink as="aside" fx="rise" delay={520} className="wire">
      <div className="wire__head mono">
        <span className="wire__fleuron" aria-hidden="true">✦</span>
        THE WIRE · DELIVERED — LIVE
      </div>
      <div className="wire__body display">
        <Rotator items={OUTCOMES_TICKER} />
      </div>
      <div className="wire__meta mono">
        DELIVERED IN DAYS · SCOPE AGREED BEFORE START · WALLET-CAPPED
      </div>
    </Ink>
  );
}

/* ──────────────────────────────────────────────────────────
   Edition Nº 001 — The Front Page
   ────────────────────────────────────────────────────────── */

export function HomePage() {
  // The masthead hero "sets itself" on load — sequence driven by CSS delays,
  // armed once after mount so the choreography runs exactly once.
  const [setReady, setSetReady] = useState(false);
  const armed = useRef(false);
  useEffect(() => {
    if (armed.current) return;
    armed.current = true;
    const t = window.setTimeout(() => setSetReady(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className={`page-home${setReady ? " is-set" : ""}`}>
      {/* ── the front page sets itself ─────────────────── */}
      <section className="front">
        <div className="wrap">
          <div className="front__dateline mono">
            <Teletype text={`VOL. I · Nº 001 · ${datelineToday()} · A COMMONWEALTH COMPANY · PRICE: $14/MO¹`} startDelay={350} />
          </div>
          <RuleDraw className="front__rule" />

          <div className="front__grid">
            <div className="front__lead">
              <h1 className="front__h1 display">
                <span className="front__h1-line" style={{ "--d": "180ms" } as CSSProperties}>
                  Tell us what you
                </span>
                <span className="front__h1-line" style={{ "--d": "300ms" } as CSSProperties}>
                  want done.
                </span>
                <span className="front__h1-line front__h1-em" style={{ "--d": "460ms" } as CSSProperties}>
                  <em>We deliver it.</em>
                </span>
              </h1>

              <p className="front__lede lede-cap" style={{ "--d": "620ms" } as CSSProperties}>
                Outcomes and the tools to reach them, ready-made or built bespoke for you. Pick
                from the catalog, or tell us what you need and we'll scope it. Either way, you
                leave with the finished thing, not a login and good luck.
              </p>

              <p className="front__kicker mono" style={{ "--d": "760ms" } as CSSProperties}>
                NO TOKENS. NO SURPRISE BILLS. NO “FIGURE IT OUT YOURSELF.”
              </p>

              <div className="front__ctas" style={{ "--d": "860ms" } as CSSProperties}>
                <Btn variant="solid" size="lg" onClick={() => scrollToId("how")}>
                  See how it works
                </Btn>
                <Btn variant="link" onClick={goExternal(LINKS.commonwealth)}>
                  Read the Charter <Arrow />
                </Btn>
              </div>
            </div>

            <div className="front__col">
              <FlywheelCut />
              <WireColumn />
            </div>
          </div>

          <FootNotes
            notes={[["¹", <>One membership. Price and timeline agreed before any work begins. One cancel button — no meters, no overages, no retention loops.</>]]}
          />
        </div>
      </section>

      {/* ── §02: in one breath — pull-quote + plate ────── */}
      <section className="section sec-dim breath" id="how">
        <div className="wrap breath__grid">
          <div className="breath__copy">
            <Ink as="div" fx="rise">
              <Kicker folio="02">What we do, in one breath</Kicker>
            </Ink>
            <Ink as="blockquote" fx="rise" delay={100} className="pullquote">
              Most AI products hand you a tool and wish you luck. We hand you the{" "}
              <em>outcome</em>, and the tools that get you there, and a real human who makes
              sure it lands.
            </Ink>
          </div>
          <Plate cutline="PLATE I — OUTCOMES. DELIVERED." className="breath__plate" tilt={0.6} delay={150}>
            <img src={HANDOVER_IMG} alt="An outcome delivered: handing over a set of keys." loading="lazy" />
          </Plate>
        </div>
      </section>

      <PageFolio n="1" />
    </div>
  );
}
