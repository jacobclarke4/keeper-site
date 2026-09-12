import { useEffect, useRef, useState, type ReactNode } from "react";
import { Stepper } from "./AppShot";

/* ──────────────────────────────────────────────────────────
   Three of the Keeper app's pages, redrawn from the app itself for
   the site (the rebuild-ui branch): the workers' comp walk with its
   process map, the case preview with every letter's stepper and
   tracking number (on a phone), and the calendar page. Fixtures are
   the app's own sample member. Illustrative, not live.
   ────────────────────────────────────────────────────────── */

/** Scales a fixed-width drawing down to the width it is given, so a page
 *  drawn at its natural size fits inside a tile with nothing cut off. */
export function Fit({ width, children }: { width: number; children: ReactNode }) {
  const host = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = host.current, box = inner.current;
    if (!el || !box) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(1, el.clientWidth / width);
      setScale(s);
      setHeight(box.offsetHeight * s);
    });
    ro.observe(el);
    ro.observe(box);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={host} className="fit" style={{ height }}>
      <div ref={inner} className="fit__inner" style={{ width, transform: `scale(${scale})` }}>{children}</div>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function Chevron({ dir }: { dir: "l" | "r" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === "l" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /><path d="M14 15.5l-2 1v-3" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8l9 6 9-6" /><rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  );
}

/* ── B. the workers' comp walk, with the process map ────── */

const GRID = { w: 124, h: 82, cg: 44, rg: 10 };
type Node = { id: string; col: number; row: number; label: string; kind?: "step" | "decision" | "mine" | "bridge"; badge?: string };
const NODES: Node[] = [
  { id: "incident", col: 0, row: 1, label: "An incident occurred" },
  { id: "kind", col: 1, row: 1, label: "One accident, or a condition that built up?", kind: "decision" },
  { id: "call", col: 2, row: 0, label: "Call 911 first, and do what the call-taker says" },
  { id: "recurring", col: 2, row: 2, label: "Pin the day it became a work injury" },
  { id: "dispatch", col: 3, row: 0, label: "What the call-taker tells you", kind: "decision" },
  { id: "notice", col: 3, row: 2, label: "Your employer is told, in writing", kind: "mine", badge: "Certified mail" },
];
const EDGES: [string, string][] = [["incident", "kind"], ["kind", "call"], ["kind", "recurring"], ["call", "dispatch"], ["recurring", "notice"]];
const INSET = 16; // room for the "you are here" disc on the first box
const nx = (c: number) => INSET + c * (GRID.w + GRID.cg);
const ny = (r: number) => r * (GRID.h + GRID.rg);
function edge(a: Node, b: Node) {
  const x1 = nx(a.col) + GRID.w, y1 = ny(a.row) + GRID.h / 2;
  const x2 = nx(b.col), y2 = ny(b.row) + GRID.h / 2;
  const mx = x1 + (x2 - x1) / 2;
  return `M${x1},${y1} H${mx} V${y2} H${x2}`;
}

export const COMP_W = INSET + 4 * GRID.w + 3 * GRID.cg;

export function CompTile() {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const cols = 4, rows = 3;
  const W = nx(cols - 1) + GRID.w, H = ny(rows - 1) + GRID.h + 4;
  return (
    <div className="walkpage" aria-label="The workers' compensation page, example">
      <h4 className="walkpage__h">Workers&apos; compensation, A to Z</h4>
      <p className="walkpage__lede">Hurt at work: from the injury to the paid claim</p>
      <span className="walkpage__btn">I was hurt at work <Arrow /></span>
      <ul className="walkpage__nav" aria-hidden="true">
        {["Overview", "Steps", "What to bring", "Costs"].map((s) => <li key={s}>{s}</li>)}
      </ul>
      <div className="walkpage__acts" aria-hidden="true">
        <span className="is-on">Build your proof</span><span>File, and answer what they do</span><span>Get paid right, to the end</span>
      </div>
      <div className="pmap" aria-hidden="true">
        <div className="pmap__band pmap__band--act" style={{ left: nx(0), width: nx(3) + GRID.w - nx(0) }}>Build your proof</div>
        <div className="pmap__band pmap__band--window" style={{ left: nx(0), width: nx(2) + GRID.w - nx(0) }}>The day you are hurt</div>
        <div className="pmap__band pmap__band--window" style={{ left: nx(3), width: GRID.w }}>The day after</div>
        <div className="pmap__field" style={{ width: W, height: H }}>
          <svg className="pmap__edges" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <defs>
              <marker id="pmap-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker>
            </defs>
            {EDGES.map(([a, b]) => <path key={a + b} d={edge(byId[a], byId[b])} fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#pmap-arrow)" />)}
          </svg>
          {NODES.map((n) => (
            <div key={n.id} className={`pmap__node pmap__node--${n.kind ?? "step"}`} style={{ left: nx(n.col), top: ny(n.row), width: GRID.w, height: GRID.h }}>
              <span className="pmap__label">{n.label}</span>
              {n.badge && <span className="pmap__badge"><MailIcon />{n.badge}</span>}
              {n.id === "incident" && <span className="pmap__you" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── C. the case preview, on a phone: every letter, tracked ── */

const LETTERS = [
  { title: "Request for your personnel file", step: "Your personnel file, requested in writing", head: "Signed for · Sep 7, 2026", done: 4, tracking: "9407111899223197428001" },
  { title: "Your written grievance, Article 9", step: "Filed, with proof of the date", head: "On its way · sent Sep 10, 2026", done: 2, tracking: "9407111899223197428002" },
];

export function TrackingPhone() {
  return (
    <div className="phone phone--tile" aria-label="A case on your phone, with every letter tracked, example">
      <div className="phone__screen app">
        <div className="phone__island" aria-hidden="true" />
        <div className="phone__status" aria-hidden="true"><span>9:41</span><span className="phone__signal" /></div>
        <div className="preview">
          <div className="preview__head">
            <div>
              <h4 className="preview__h">Grievances and contract deadlines</h4>
              <p className="preview__sub">Started Aug 13, 2026</p>
            </div>
            <span className="preview__close" aria-hidden="true">×</span>
          </div>
          <section className="preview__card">
            <div className="preview__row">
              <p className="preview__clock">Step 3 written grievance</p>
              <span className="pill pill--hot">4 days left</span>
            </div>
            <p className="preview__line">Due Sep 16, 2026</p>
            <p className="preview__line">From Your agreement, Article 9</p>
            <p className="preview__step"><b>Step 3 of 6</b> · The written grievance</p>
            <span className="pbar"><span className="pbar__fill is-set" style={{ width: "50%" }} /></span>
          </section>
          <h5 className="preview__caps">What you have sent</h5>
          {LETTERS.map((l) => (
            <section key={l.tracking} className="preview__card">
              <p className="preview__clock">{l.title}</p>
              <p className="preview__line">Sent for: {l.step}</p>
              <p className="preview__stop">{l.head}</p>
              <Stepper done={l.done} />
              <p className="preview__tracking">Tracking {l.tracking}</p>
            </section>
          ))}
        </div>
        <div className="preview__foot" aria-hidden="true"><span className="preview__btn">Continue <Arrow /></span></div>
      </div>
    </div>
  );
}

/* ── D. the calendar page ───────────────────────────────── */

const LEAD = 2; // September 2026 starts on a Tuesday
const DAYS = 30;
const TODAY = 12;
const DUE = [16, 18];
const DATES = [
  { day: 16, dow: "Wed", title: "Step 3 written grievance", left: "4 days left", from: "Your agreement, Article 9" },
  { day: 18, dow: "Fri", title: "Week one paperwork", left: "6 days left", from: "820 ILCS 305/6(c)" },
];

export function CalendarTile() {
  const cells: (number | null)[] = [...Array.from({ length: LEAD }, () => null), ...Array.from({ length: DAYS }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return (
    <div className="month" aria-label="The calendar page, example">
      <div className="month__band">
        <h4 className="month__h">September 2026</h4>
        <span className="month__nav" aria-hidden="true"><Chevron dir="l" /><Chevron dir="r" /></span>
      </div>
      <div className="month__body">
        <div className="month__grid" aria-hidden="true">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <span key={d} className="month__dow">{d}</span>)}
          {cells.map((d, i) => (
            <span key={i} className={`month__cell${d === null ? " month__cell--blank" : ""}`}>
              {d !== null && <span className={`month__day${d === TODAY ? " is-today" : ""}${DUE.includes(d) ? " is-due" : ""}`}>{d}</span>}
            </span>
          ))}
        </div>
        <ul className="month__side">
          {DATES.map((e) => (
            <li key={e.day} className="calrow">
              <div className="calrow__date"><span className="calrow__n">{e.day}</span><span className="calrow__dow">{e.dow}</span></div>
              <div className="calrow__body">
                <div className="calrow__top">
                  <p className="calrow__title">{e.title}</p>
                  <span className="pill pill--hot">{e.left}</span>
                </div>
                <span className="calrow__chip"><ClockIcon />A deadline</span>
                <p className="calrow__from">From {e.from}</p>
                <span className="calrow__btn">Open this case <Arrow /></span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
