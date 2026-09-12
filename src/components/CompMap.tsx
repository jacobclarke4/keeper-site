import { useEffect, useState } from "react";
import { MAP } from "../lib/site";
import { useInView, usePrefersReducedMotion } from "../lib/motion";

/* ──────────────────────────────────────────────────────────
   The workers' comp map: 348 boxes, 78 decisions, 539 paths, drawn
   the way the app draws them (right-angle edges, arrow markers, a
   charcoal box for your own decisions, a red rule for a bad road, a
   red you-are-here mark). Then it consolidates: every box slides onto
   one straight line of seven stations, and the mark walks it.
   ────────────────────────────────────────────────────────── */

const W = 1000;
const H = 420;
const LINE_Y = 210;
const COLS = 14;
const ROWS = 5;

type Box = { id: number; x: number; y: number; w: number; h: number; kind: "step" | "decision" | "bad" | "mine" };
type Edge = { from: Box; to: Box; back?: boolean };

/* A seeded scatter so every visitor sees the same map. */
function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

function build(): { boxes: Box[]; edges: Edge[] } {
  const r = rng(7);
  const boxes: Box[] = [];
  const colX = (c: number) => 30 + c * ((W - 60) / (COLS - 1));
  const rowY = (row: number) => 34 + row * ((H - 68) / (ROWS - 1));
  let id = 0;
  for (let c = 0; c < COLS; c++) {
    const count = c === 0 || c === COLS - 1 ? 1 : 2 + Math.floor(r() * 3);
    const rows = new Set<number>();
    while (rows.size < count) rows.add(c === 0 || c === COLS - 1 ? 2 : Math.floor(r() * ROWS));
    for (const row of rows) {
      const k = r();
      const kind: Box["kind"] = c === 0 ? "mine" : k < 0.08 ? "mine" : k < 0.3 ? "decision" : k < 0.42 ? "bad" : "step";
      boxes.push({ id: id++, x: colX(c) - 24 + (r() - 0.5) * 12, y: rowY(row) - 11 + (r() - 0.5) * 10, w: 48, h: 22, kind });
    }
  }
  const byCol = (c: number) => boxes.filter((b) => Math.round((b.x + 24 - 30) / ((W - 60) / (COLS - 1))) === c);
  const edges: Edge[] = [];
  for (let c = 0; c < COLS - 1; c++) {
    const here = byCol(c), next = byCol(c + 1);
    for (const b of here) {
      const targets = next.filter(() => r() < 0.75);
      for (const t of targets.length ? targets : [next[0]]) edges.push({ from: b, to: t });
    }
    for (const t of next) if (!edges.some((e) => e.to === t)) edges.push({ from: here[Math.floor(r() * here.length)], to: t });
    if (c > 3 && r() < 0.35) edges.push({ from: next[0], to: byCol(c - 2)[0], back: true });
  }
  return { boxes, edges };
}

const { boxes: BOXES, edges: EDGES } = build();
const TOTAL_BOXES = BOXES.length;

/* Right-angle route between two boxes, like the app's edges. */
function route(e: Edge): string {
  const x1 = e.from.x + e.from.w, y1 = e.from.y + e.from.h / 2;
  const x2 = e.to.x, y2 = e.to.y + e.to.h / 2;
  if (e.back) {
    const lane = H - 6;
    return `M${e.from.x + e.from.w / 2},${e.from.y + e.from.h} V${lane} H${e.to.x + e.to.w / 2} V${e.to.y + e.to.h}`;
  }
  const mx = x1 + (x2 - x1) * 0.45;
  return `M${x1},${y1} H${mx} V${y2} H${x2}`;
}

const STATION_X = MAP.stations.map((_, i) => 60 + i * ((W - 120) / (MAP.stations.length - 1)));
/* The line each box slides to when the map consolidates: its nearest station. */
const target = (b: Box) => STATION_X.reduce((best, x) => (Math.abs(x - (b.x + b.w / 2)) < Math.abs(best - (b.x + b.w / 2)) ? x : best), STATION_X[0]);

/* The loop: draw the tangle, hold, consolidate, walk the mark, hold, again. */
const T = { drawn: 2600, hold: 1400, line: 1500, walk: 2600, end: 9600 };

export function CompMap() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -10% 0px" });
  const [phase, setPhase] = useState<"draw" | "tangle" | "line" | "walk">(reduced ? "walk" : "draw");
  const [here, setHere] = useState(reduced ? 6 : 0);
  useEffect(() => {
    if (reduced || !inView) return;
    let timers: number[] = [];
    const run = () => {
      setPhase("draw"); setHere(0);
      timers = [
        window.setTimeout(() => setPhase("tangle"), T.drawn),
        window.setTimeout(() => setPhase("line"), T.drawn + T.hold),
        window.setTimeout(() => setPhase("walk"), T.drawn + T.hold + T.line),
        ...MAP.stations.map((_, i) => window.setTimeout(() => setHere(i), T.drawn + T.hold + T.line + 200 + i * (T.walk / MAP.stations.length))),
        window.setTimeout(run, T.end),
      ];
    };
    run();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduced, inView]);
  const consolidated = phase === "line" || phase === "walk";
  return (
    <div ref={ref} className={`cmap cmap--${phase}`} aria-label={`The workers' comp process: ${MAP.boxes} boxes and ${MAP.decisions} decisions, walked as seven stations.`}>
      <div className="cmap__count" aria-hidden="true">
        <span className={`cmap__n${consolidated ? "" : " is-on"}`}>{MAP.boxes} boxes · {MAP.decisions} decisions · {MAP.paths} paths</span>
        <span className={`cmap__n${consolidated ? " is-on" : ""}`}>{MAP.stations.length} stations. One line. You are here.</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H + 40}`} className="cmap__svg" aria-hidden="true">
        <defs>
          <marker id="cmap-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker>
        </defs>
        {/* the tangle */}
        <g className="cmap__edges">
          {EDGES.map((e, i) => (
            <path key={i} d={route(e)} className={`cmap__edge${e.back ? " cmap__edge--back" : ""}`} style={{ ["--i" as string]: i }} markerEnd="url(#cmap-arrow)" />
          ))}
        </g>
        <g className="cmap__boxes">
          {BOXES.map((b) => (
            <g key={b.id} className={`cmap__box cmap__box--${b.kind}`} style={{ ["--i" as string]: b.id, ["--dx" as string]: `${target(b) - (b.x + b.w / 2)}px`, ["--dy" as string]: `${LINE_Y - (b.y + b.h / 2)}px` }}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" />
              {b.kind === "bad" && <rect x={b.x} y={b.y} width="2.5" height={b.h} rx="1" className="cmap__rule" />}
            </g>
          ))}
        </g>
        {/* the line */}
        <g className="cmap__line">
          <line x1={STATION_X[0]} y1={LINE_Y} x2={STATION_X[STATION_X.length - 1]} y2={LINE_Y} className="cmap__rail" pathLength={1} />
          {MAP.stations.map((s, i) => (
            <g key={s} className={`cmap__station${i < here ? " is-done" : ""}${i === here ? " is-here" : ""}`} style={{ ["--i" as string]: i }}>
              <circle cx={STATION_X[i]} cy={LINE_Y} r="9" className="cmap__dot" />
              <text x={STATION_X[i]} y={LINE_Y + (i % 2 ? -26 : 34)} textAnchor="middle" className="cmap__label">{s}</text>
            </g>
          ))}
          <circle cx={STATION_X[here]} cy={LINE_Y} r="7" className="cmap__here" />
        </g>
      </svg>
      <p className="cmap__foot">
        {TOTAL_BOXES < MAP.boxes ? `Drawn here at one box in ${Math.round(MAP.boxes / TOTAL_BOXES)}. ` : ""}
        Every box on the real map is a step the app walks you through, one at a time, in the lane where it happens.
      </p>
    </div>
  );
}
