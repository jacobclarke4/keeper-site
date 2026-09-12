import { Ink } from "../lib/motion";

const BASE_URL = import.meta.env.BASE_URL;

/* ──────────────────────────────────────────────────────────
   The Keeper app's home, redrawn for the site from the app itself:
   the alert card and the small calendar in the rail, the red date band,
   and the case deck with its days-left pills, mail steppers, and red
   progress bars. Illustrative, not live data.
   ────────────────────────────────────────────────────────── */

const MAIL_STEPS = ["Sent", "On its way", "Delivered", "Signed for"] as const;

const CASES = [
  { date: "08/13/26", left: "4 days left", hot: true, title: "Grievances and contract deadlines", status: "On its way", what: "Your written grievance, Article 9", done: 2, pct: 50 },
  { date: "09/04/26", left: "6 days left", hot: true, title: "Workers' compensation, A to Z", status: "On its way", what: "Written notice of your injury", done: 2, pct: 50 },
  { date: "08/03/26", left: "19 days left", hot: false, title: "Unemployment insurance, Illinois", status: "Delivered", what: "Your appeal of the determination", done: 3, pct: 70 },
] as const;

const SIDE_CASES = [
  { name: "Grievances and contract deadlines", date: "08/13/26", pct: 50 },
  { name: "Workers' compensation, A to Z", date: "09/04/26", pct: 50 },
  { name: "Unemployment insurance, Illinois", date: "08/03/26", pct: 70 },
] as const;

/* September 2026 starts on a Tuesday. */
const CAL_LEAD = 2;
const CAL_DAYS = 30;
const CAL_TODAY = 12;
const CAL_DUE = [16, 18];

const I = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
const CalendarIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" {...I}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
const HouseIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" {...I}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
const LibraryIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" {...I}><path d="m16 6 4 14M12 6v14M8 8v12M4 4v16" /></svg>;
const MicOffIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" {...I}><path d="M2 2l20 20" /><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33M9 9v3a3 3 0 0 0 5.12 2.12" /><path d="M12 19v3" /></svg>;
const KeyboardIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" {...I}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" /></svg>;
const LifeBuoyIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" {...I}><circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24" /><circle cx="12" cy="12" r="4" /></svg>;

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The mail stepper: Sent, On its way, Delivered, Signed for. */
export function Stepper({ done, size = "md" }: { done: number; size?: "md" | "lg" }) {
  return (
    <ol className={`stepper stepper--${size}`} aria-label="Where the letter is">
      {MAIL_STEPS.map((s, i) => (
        <li key={s} className={`stepper__step${i < done ? " is-done" : ""}${i === done - 1 ? " is-here" : ""}`}>
          <span className="stepper__dot"><Check /></span>
          <span className="stepper__label">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export function AppShot() {
  return (
    <div className="shot" aria-label="Keeper on a laptop, example">
      <aside className="shot__rail">
        <div className="shot__brand">Keeper</div>
        <Ink as="div" fx="rise" delay={80} className="alert">
          <div className="alert__bar">
            <span>1 of 2</span>
            <span className="alert__nav" aria-hidden="true">‹ &nbsp; › &nbsp; ×</span>
          </div>
          <p className="alert__h">A letter came back</p>
          <span className="alert__more">Show more</span>
          <span className="alert__btn">Open your case</span>
        </Ink>
        <Ink as="div" fx="rise" delay={160} className="mcal">
          <div className="mcal__head">
            <span>September 2026</span>
            <span aria-hidden="true">‹ &nbsp; ›</span>
          </div>
          <div className="mcal__grid" aria-hidden="true">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={`${d}${i}`} className="mcal__dow">{d}</span>
            ))}
            {Array.from({ length: CAL_LEAD }, (_, i) => <span key={`lead${i}`} />)}
            {Array.from({ length: CAL_DAYS }, (_, i) => {
              const d = i + 1;
              return (
                <span key={d} className={`mcal__day${d === CAL_TODAY ? " is-today" : ""}${CAL_DUE.includes(d) ? " is-due" : ""}`}>
                  {d}
                </span>
              );
            })}
          </div>
        </Ink>
        <div className="shot__list">
          <p className="shot__caps">Your cases</p>
          {SIDE_CASES.map((c, i) => (
            <Ink key={c.name} as="div" fx="rise" delay={220 + i * 60} className="shot__row">
              <span className="shot__row-top">
                <span className="shot__row-name">{c.name}</span>
                <span className="shot__row-date">{c.date}</span>
              </span>
              <span className="pbar"><span className="pbar__fill" style={{ width: `${c.pct}%` }} /></span>
            </Ink>
          ))}
        </div>
      </aside>

      <main className="shot__main">
        <nav className="shot__nav" aria-hidden="true">
          <span className="shot__nav-item"><CalendarIcon />Calendar</span>
          <span className="shot__home"><HouseIcon /></span>
          <span className="shot__nav-item"><LibraryIcon />Library</span>
        </nav>
        <Ink as="div" fx="rise" className="dateband">
          <div className="dateband__day">
            <span className="dateband__dow">Saturday</span>
            <span className="dateband__date">September 12</span>
          </div>
          <div className="dateband__wx">
            <span className="dateband__temp">86°</span>
            <span className="dateband__wx-text">
              <b>Cloudy, Chicago</b>
              High 86°, low 63°.
            </span>
          </div>
        </Ink>
        <div className="shot__panel">
          <div className="shot__panel-head">
            <h3 className="shot__h">Your cases</h3>
            <span className="shot__toggle" aria-hidden="true"><b>Cases</b><span>Dates</span></span>
          </div>
          <div className="deck">
            {CASES.map((c, i) => (
              <Ink key={c.title} as="article" fx="rise" delay={120 + i * 90} className="ccard">
                <div className="ccard__top">
                  <span className="ccard__date">{c.date}</span>
                  <span className={`pill${c.hot ? " pill--hot" : ""}`}>{c.left}</span>
                </div>
                <h4 className="ccard__h">{c.title}</h4>
                <p className="ccard__status">
                  <b>{c.status}</b>
                  <span>{c.what}</span>
                </p>
                <Stepper done={c.done} />
                <span className="pbar"><span className="pbar__fill" style={{ width: `${c.pct}%` }} /></span>
                <span className="ccard__open">Open the case <span aria-hidden="true">→</span></span>
              </Ink>
            ))}
          </div>
        </div>
      </main>
      <div className="shot__capsule" aria-hidden="true">
        <span className="shot__ctl"><MicOffIcon /></span>
        <span className="pw shot__pw" style={{ ["--pal-a" as string]: "#f59e0b", ["--pal-grad" as string]: "linear-gradient(165deg, #f59e0b, #ef4444 62%, #f59e0b)" }}>
          <img src={`${BASE_URL}portraits/nora.webp`} alt="" width={40} height={40} draggable={false} />
        </span>
        <span className="shot__ctl shot__ctl--light"><KeyboardIcon /></span>
      </div>
      <div className="shot__net" aria-hidden="true">
        <span className="shot__net-icon"><LifeBuoyIcon /></span>
        <span className="shot__net-text"><b>Your safety net</b><span>2 of 13 done</span></span>
      </div>
    </div>
  );
}
