import { useEffect, useState } from "react";
import { Ink, usePrefersReducedMotion } from "../lib/motion";

/* ──────────────────────────────────────────────────────────
   The assistant in action, on a phone: the member says what happened,
   the assistant answers, and the case appears in the deck with its
   letter on the way. The loop hands the member to the next assistant
   each pass. Drawn from the app's rebuild-ui branch; illustrative.
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
export function AssistantPhone() {
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
    <div className="hero__stack assistant" aria-label="Keeper on your phone, example">
      <Ink as="div" fx="none" delay={300} className="phone phone--tile">
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
