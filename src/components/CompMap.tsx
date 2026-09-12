import { useEffect, useRef, useState } from "react";
import { MAP } from "../lib/site";
import { useInView, usePrefersReducedMotion } from "../lib/motion";

/* ──────────────────────────────────────────────────────────
   The workers' comp map, loosely after the app's own: boxes on a
   grid, right-angle edges with arrow markers, charcoal for your own
   decisions, a red rule for a bad road. One red road threads through
   the tangle: the road the app walks you down. Then the tangle
   consolidates onto one straight line of seven stations, and the red
   mark walks it.
   ────────────────────────────────────────────────────────── */

const W = 1000;
const H = 470;
const LINE_Y = 240;
const COLS = 9;
const ROWS = 4;
const BW = 66;
const BH = 30;

type Box = { id: number; col: number; row: number; x: number; y: number; kind: "step" | "decision" | "bad" | "mine"; road: boolean };
type Edge = { from: Box; to: Box; back?: boolean; road: boolean };

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

const colX = (c: number) => 40 + c * ((W - 80 - BW) / (COLS - 1));
const rowY = (row: number) => 40 + row * ((H - 80 - BH) / (ROWS - 1));

function build(): { boxes: Box[]; edges: Edge[]; road: Box[] } {
  const r = rng(11);
  const boxes: Box[] = [];
  let id = 0;
  // the road: one box per column, wandering between rows
  const roadRow: number[] = [];
  let row = 1;
  for (let c = 0; c < COLS; c++) {
    if (c > 0) { const step = r(); row = Math.max(0, Math.min(ROWS - 1, row + (step < 0.3 ? -1 : step < 0.6 ? 1 : 0))); }
    roadRow.push(row);
  }
  for (let c = 0; c < COLS; c++) {
    const rows = new Set<number>([roadRow[c]]);
    const count = c === 0 || c === COLS - 1 ? 1 : 2 + (r() < 0.5 ? 1 : 0);
    while (rows.size < count) rows.add(Math.floor(r() * ROWS));
    for (const row of [...rows].sort()) {
      const onRoad = row === roadRow[c];
      const k = r();
      const kind: Box["kind"] = c === 0 ? "mine" : onRoad && (c === 3 || c === 6) ? "mine" : !onRoad && k < 0.3 ? "bad" : k < 0.55 ? "decision" : "step";
      boxes.push({ id: id++, col: c, row, x: colX(c), y: rowY(row) + (r() - 0.5) * 8, kind, road: onRoad });
    }
  }
  const byCol = (c: number) => boxes.filter((b) => b.col === c);
  const edges: Edge[] = [];
  for (let c = 0; c < COLS - 1; c++) {
    const here = byCol(c), next = byCol(c + 1);
    for (const b of here) {
      for (const t of next) {
        const isRoad = b.road && t.road;
        if (isRoad || r() < 0.5) edges.push({ from: b, to: t, road: isRoad });
      }
    }
    for (const t of next) if (!edges.some((e) => e.to === t)) edges.push({ from: here[0], to: t, road: false });
    if (c >= 3 && c <= 6 && r() < 0.5) { const from = next.find((b) => !b.road) ?? next[0]; edges.push({ from, to: byCol(c - 2)[0], back: true, road: false }); }
  }
  return { boxes, edges, road: boxes.filter((b) => b.road) };
}

const { boxes: BOXES, edges: EDGES, road: ROAD } = build();

function route(e: Edge): string {
  const x1 = e.from.x + BW, y1 = e.from.y + BH / 2;
  const x2 = e.to.x, y2 = e.to.y + BH / 2;
  if (e.back) {
    const lane = H - 10;
    return `M${e.from.x + BW / 2},${e.from.y + BH} V${lane} H${e.to.x + BW / 2} V${e.to.y + BH}`;
  }
  const mx = x1 + (x2 - x1) * 0.5;
  return `M${x1},${y1} H${mx} V${y2} H${x2}`;
}

/* The red road, as one path through the road boxes' centres. */
const ROAD_PATH = ROAD.map((b, i) => `${i === 0 ? "M" : "L"}${b.x + BW / 2},${b.y + BH / 2}`).join(" ");

const STATION_X = MAP.stations.map((_, i) => 60 + i * ((W - 120) / (MAP.stations.length - 1)));
const target = (b: Box) => STATION_X.reduce((best, x) => (Math.abs(x - (b.x + BW / 2)) < Math.abs(best - (b.x + BW / 2)) ? x : best), STATION_X[0]);

/* The loop, in ms: the tangle draws, the road threads it, a hold, the
   consolidation, the stations one by one, the walk, a hold, a fade to
   nothing, a silent reset, and again. */
const T = { tangle: 2400, road: 2500, hold: 5400, line: 6600, stations: 8200, walk: 10600, out: 15200, reset: 16000, end: 16150 };
const STATION_STAGGER = 300;
const WALK_STEP = 560;

type Phase = "draw" | "road" | "hold" | "line" | "stations" | "walk" | "out" | "reset";

export function CompMap({ mode = "loop" }: { mode?: "loop" | "static" }) {
  const reduced = usePrefersReducedMotion() || mode === "static";
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -10% 0px" });
  const [phase, setPhase] = useState<Phase>(mode === "static" ? "hold" : reduced ? "walk" : "draw");
  const [here, setHere] = useState(reduced && mode !== "static" ? 6 : 0);
  const motion = useRef<SVGAnimateMotionElement | null>(null);
  useEffect(() => {
    if (phase === "road") motion.current?.beginElement();
  }, [phase]);
  useEffect(() => {
    if (reduced || !inView) return;
    let timers: number[] = [];
    const run = () => {
      setPhase("draw"); setHere(0);
      timers = [
        window.setTimeout(() => setPhase("road"), T.tangle),
        window.setTimeout(() => setPhase("hold"), T.road + 2400),
        window.setTimeout(() => setPhase("line"), T.hold),
        window.setTimeout(() => setPhase("stations"), T.line),
        window.setTimeout(() => setPhase("walk"), T.walk - 200),
        ...MAP.stations.map((_, i) => window.setTimeout(() => setHere(i), T.walk + i * WALK_STEP)),
        window.setTimeout(() => setPhase("out"), T.out),
        window.setTimeout(() => setPhase("reset"), T.reset),
        window.setTimeout(run, T.end),
      ];
    };
    run();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduced, inView]);
  const consolidated = phase === "line" || phase === "stations" || phase === "walk" || phase === "out";
  return (
    <div ref={ref} className={`cmap cmap--${phase}`} aria-label={`The workers' comp process: ${MAP.boxes} boxes and ${MAP.decisions} decisions, walked as seven stations.`}>
      <div className="cmap__count" aria-hidden="true">
        <span className={`cmap__n${consolidated ? "" : " is-on"}`}>{MAP.boxes} boxes · {MAP.decisions} decisions · {MAP.paths} paths. <b>Your road is red.</b></span>
        <span className={`cmap__n${consolidated ? " is-on" : ""}`}>{MAP.stations.length} stations. One line. <b>You are here.</b></span>
      </div>
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="cmap__svg" aria-hidden="true">
        <defs>
          <marker id="cmap-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker>
        </defs>
        <g className="cmap__edges">
          {EDGES.map((e, i) => (
            <path key={i} d={route(e)} className={`cmap__edge${e.back ? " cmap__edge--back" : ""}${e.road ? " cmap__edge--road" : ""}`} style={{ ["--c" as string]: e.from.col }} markerEnd={e.road ? undefined : "url(#cmap-arrow)"} />
          ))}
        </g>
        <path d={ROAD_PATH} className="cmap__road" pathLength={1} />
        <g className="cmap__boxes">
          {BOXES.map((b) => (
            <g key={b.id} className={`cmap__box cmap__box--${b.kind}${b.road ? " cmap__box--road" : ""}`} style={{ ["--c" as string]: b.col, ["--dx" as string]: `${target(b) - (b.x + BW / 2)}px`, ["--dy" as string]: `${LINE_Y - (b.y + BH / 2)}px` }}>
              <rect x={b.x} y={b.y} width={BW} height={BH} rx="6" />
              {b.kind === "bad" && <rect x={b.x} y={b.y} width="3" height={BH} rx="1.5" className="cmap__rule" />}
            </g>
          ))}
        </g>
        {/* the mark rides the road through the tangle, then walks the line */}
        <circle r="9" className="cmap__you">
          <animateMotion ref={motion} dur="2.4s" begin="indefinite" fill="freeze" path={ROAD_PATH} calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
        </circle>
        <g className="cmap__line">
          <line x1={STATION_X[0]} y1={LINE_Y} x2={STATION_X[STATION_X.length - 1]} y2={LINE_Y} className="cmap__rail" pathLength={1} />
          <line x1={STATION_X[0]} y1={LINE_Y} x2={STATION_X[Math.max(here, 0)]} y2={LINE_Y} className="cmap__rail cmap__rail--done" />
          {MAP.stations.map((s, i) => (
            <g key={s} className={`cmap__station${i < here ? " is-done" : ""}${i === here && phase === "walk" ? " is-here" : ""}`} style={{ ["--i" as string]: i, ["--st" as string]: `${i * STATION_STAGGER}ms` }}>
              <circle cx={STATION_X[i]} cy={LINE_Y} r="10" className="cmap__dot" />
              <text x={STATION_X[i]} y={LINE_Y + (i % 2 ? -28 : 38)} textAnchor="middle" className="cmap__label">{s}</text>
            </g>
          ))}
          <circle cx={STATION_X[here]} cy={LINE_Y} r="9" className="cmap__here" />
          <circle cx={STATION_X[here]} cy={LINE_Y} r="9" className="cmap__here-ring" />
        </g>
      </svg>
    </div>
  );
}
