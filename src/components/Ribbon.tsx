import { useEffect, useRef } from "react";
import { MAP } from "../lib/site";
import { useInView, usePrefersReducedMotion } from "../lib/motion";

/* ──────────────────────────────────────────────────────────
   The ribbon: many roads into one line. On the left, sixty-four
   strands wander wide and cross each other, paper-white: every road a
   claim can take. At the twist Keeper takes over, and from there the
   strands gather into one straight red rail with seven stations
   lighting along it, left to right. It draws itself, holds, and draws
   again. Still under reduced motion.
   ────────────────────────────────────────────────────────── */

const LINES = 64;
const TAU = Math.PI * 2;
const TWIST = 0.5; // where Keeper takes over
const STATIONS = MAP.stations.length;

const smooth = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };

/* a per-strand wander through the tangle: three sines with fixed phases */
function tangle(k: number, i: number, p: number, t: number, h: number) {
  const a = i * 0.61803;
  const s1 = Math.sin(p * TAU * 1.1 + a * 7 + t * 0.35);
  const s2 = Math.sin(p * TAU * 0.6 + a * 13 - t * 0.22);
  const s3 = Math.sin(p * TAU * 2.2 + a * 3 + t * 0.5);
  return k * h * 0.8 * (0.55 + 0.45 * s2) + s1 * h * 0.18 + s3 * h * 0.05;
}

const LOOP = 10.5; // seconds per pass
const DRAW = 3.4; // seconds a strand takes to cross
const STAGGER = 2.2; // the spread of start times
const hash = (i: number) => ((i * 2654435761) >>> 0) / 4294967296;

function strandPoint(k: number, i: number, p: number, t: number, h: number, cy: number) {
  const wander = tangle(k, i, p, t, h);
  const gather = p < TWIST ? 1 : 1 - smooth((p - TWIST) / 0.22);
  return cy + wander * gather;
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, still: boolean) {
  ctx.clearRect(0, 0, w, h);
  const cy = h * 0.52;
  const steps = 150;
  const u = still ? 99 : t % LOOP;
  // the pass fades out at its end, then begins again
  const fade = still ? 1 : 1 - smooth((u - (LOOP - 1.2)) / 0.7);
  ctx.globalAlpha = fade;
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  let furthest = still ? 1 : 0;
  for (let i = 0; i < LINES; i++) {
    const k = i / (LINES - 1) - 0.5;
    // every strand sets out on its own moment and at its own pace
    const delay = hash(i) * STAGGER;
    const speed = 0.85 + hash(i + 97) * 0.3;
    const reach = still ? 1 : smooth((u - delay) / (DRAW / speed));
    if (reach <= 0) continue;
    furthest = Math.max(furthest, reach);
    ctx.beginPath();
    const last = Math.min(steps, Math.ceil(reach * steps));
    for (let s = 0; s <= last; s++) {
      const p = Math.min(reach, s / steps);
      const x = p * w;
      const y = strandPoint(k, i, p, still ? 0 : t, h, cy);
      if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    const a = 0.14 + 0.36 * (1 - Math.abs(k) * 1.3);
    const g = ctx.createLinearGradient(0, 0, w, 0);
    const stop = (q: number, c: string) => g.addColorStop(Math.min(1, Math.max(0, q)), c);
    stop(0, `rgba(245,240,235,${a * 0.8})`);
    stop(TWIST - 0.08, `rgba(245,240,235,${a})`);
    stop(TWIST + 0.12, `rgba(255,176,171,${a})`);
    stop(TWIST + 0.3, `rgba(219,54,48,${Math.min(1, a * 1.4)})`);
    stop(1, `rgba(219,54,48,${Math.min(1, a * 1.6)})`);
    ctx.strokeStyle = g;
    ctx.stroke();
    // a soft head: the last stretch of the strand brightens then thins out
    if (!still && reach < 1) {
      const lo = Math.max(0, reach - 0.07);
      ctx.beginPath();
      const s0 = Math.floor(lo * steps);
      for (let s = s0; s <= last; s++) {
        const p = Math.min(reach, s / steps);
        const y = strandPoint(k, i, p, t, h, cy);
        if (s === s0) ctx.moveTo(p * w, y); else ctx.lineTo(p * w, y);
      }
      const gl = ctx.createLinearGradient(lo * w, 0, reach * w, 0);
      const bright = reach < TWIST ? "255,255,255" : "255,205,200";
      gl.addColorStop(0, `rgba(${bright},0)`);
      gl.addColorStop(0.7, `rgba(${bright},${0.7 * (1 - Math.abs(k) * 1.2)})`);
      gl.addColorStop(1, `rgba(${bright},0)`);
      ctx.strokeStyle = gl;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }
  // the rail forms as the strands arrive, and the stations light in turn
  const railFrom = TWIST + 0.2;
  if (furthest > railFrom) {
    ctx.beginPath();
    ctx.moveTo(railFrom * w, cy);
    ctx.lineTo(Math.min(1, furthest) * w, cy);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(219,54,48,.95)";
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  const x0 = (TWIST + 0.22), x1 = 0.985;
  for (let i = 0; i < STATIONS; i++) {
    const p = x0 + (i / (STATIONS - 1)) * (x1 - x0);
    const on = still ? 1 : smooth((furthest - p) / 0.04);
    if (on <= 0) continue;
    const x = p * w;
    ctx.beginPath();
    ctx.arc(x, cy, 5.5 * on, 0, TAU);
    ctx.fillStyle = `rgba(219,54,48,${on})`;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(43,43,43,${on})`;
    ctx.stroke();
    ctx.lineWidth = 1;
    const d = furthest - p;
    if (!still && d > 0 && d < 0.14) {
      const ring = 1 - d / 0.14;
      ctx.beginPath();
      ctx.arc(x, cy, 6 + 18 * (1 - ring), 0, TAU);
      ctx.strokeStyle = `rgba(219,54,48,${ring * 0.7})`;
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

export function Ribbon() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px 0px 0px" });

  useEffect(() => {
    const el = canvas.current;
    const host = ref.current;
    if (!el || !host) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, last = 0, raf = 0;
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = host.clientWidth; h = host.clientHeight;
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h, last / 1000, reduced);
    };
    const start = performance.now();
    const tick = (now: number) => {
      last = now - start;
      draw(ctx, w, h, last / 1000, false);
      raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(size);
    ro.observe(host);
    size();
    if (!reduced && inView) raf = requestAnimationFrame(tick);
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, inView, ref]);

  return (
    <div ref={ref} className="ribbon" aria-hidden="true">
      <canvas ref={canvas} className="ribbon__canvas" />
      <div className="ribbon__tags">
        <span className="ribbon__tag">{MAP.paths} roads</span>
        <span className="ribbon__tag is-on">One line, seven stations</span>
      </div>
    </div>
  );
}
