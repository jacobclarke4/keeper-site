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
const LOOP = 11; // seconds per pass
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

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, still: boolean) {
  ctx.clearRect(0, 0, w, h);
  const u = still ? 0.8 : (t % LOOP) / LOOP;
  const reach = still ? 1 : smooth(u / 0.66); // how far the strands have travelled
  const fade = still ? 1 : 1 - smooth((u - 0.93) / 0.07);
  const cy = h * 0.52;
  const railY = cy;
  const steps = 160;
  ctx.globalAlpha = fade;
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  // the strands
  for (let i = 0; i < LINES; i++) {
    const k = i / (LINES - 1) - 0.5;
    ctx.beginPath();
    let started = false;
    for (let s = 0; s <= steps; s++) {
      const p = s / steps;
      if (p > reach) break;
      const x = p * w;
      const wander = tangle(k, i, p, t, h);
      // after the twist the wander is squeezed to nothing
      const gather = p < TWIST ? 1 : 1 - smooth((p - TWIST) / 0.22);
      const y = cy + wander * gather + (p > TWIST ? (railY - cy) * (1 - gather) : 0);
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    }
    const a = 0.16 + 0.42 * (1 - Math.abs(k) * 1.3);
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, `rgba(245,240,235,${a * 0.85})`);
    g.addColorStop(TWIST - 0.08, `rgba(245,240,235,${a})`);
    g.addColorStop(TWIST + 0.12, `rgba(255,176,171,${a})`);
    g.addColorStop(TWIST + 0.3, `rgba(219,54,48,${Math.min(1, a * 1.4)})`);
    g.addColorStop(1, `rgba(219,54,48,${Math.min(1, a * 1.6)})`);
    ctx.strokeStyle = g;
    ctx.stroke();
  }
  // the rail itself, drawn over the gathered strands
  const railStart = (TWIST + 0.2) * w;
  const railEnd = Math.min(w, reach * w);
  if (railEnd > railStart) {
    ctx.beginPath();
    ctx.moveTo(railStart, railY);
    ctx.lineTo(railEnd, railY);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(219,54,48,.95)";
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  // the stations light along the rail as the strands arrive
  const x0 = (TWIST + 0.22) * w, x1 = w * 0.985;
  for (let i = 0; i < STATIONS; i++) {
    const x = x0 + (i / (STATIONS - 1)) * (x1 - x0);
    const on = still ? 1 : smooth((reach * w - x) / (w * 0.03));
    if (on <= 0) continue;
    ctx.beginPath();
    ctx.arc(x, railY, 5.5 * on, 0, TAU);
    ctx.fillStyle = `rgba(219,54,48,${on})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, railY, 5.5 * on, 0, TAU);
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(43,43,43,${on})`;
    ctx.stroke();
    ctx.lineWidth = 1;
    // a soft pulse on the newest station
    const ring = still ? 0 : 1 - smooth((reach * w - x) / (w * 0.12));
    if (ring > 0 && on >= 1) {
      ctx.beginPath();
      ctx.arc(x, railY, 6 + 16 * (1 - ring), 0, TAU);
      ctx.strokeStyle = `rgba(219,54,48,${ring * 0.6})`;
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
