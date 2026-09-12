import { useEffect, useRef } from "react";
import { useInView, usePrefersReducedMotion } from "../lib/motion";

/* ──────────────────────────────────────────────────────────
   The ribbon: sixty thin lines that travel across the band as one
   bundle, fanning open, twisting shut, and fanning open again, in a
   slow loop. Paper-white at the left, Keeper red through the middle,
   deep red at the right. Drawn on a canvas; still under reduced motion.
   ────────────────────────────────────────────────────────── */

const LINES = 64;
const TAU = Math.PI * 2;

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  const cy = h * 0.55;
  const steps = 140;
  for (let i = 0; i < LINES; i++) {
    const u = i / (LINES - 1) - 0.5; // -0.5 .. 0.5 across the bundle
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const p = s / steps; // 0 .. 1 along the band
      const x = p * w;
      // the bundle's centre line: a long swell that drifts with time
      const spine = Math.sin(p * TAU * 0.9 - t * 0.35) * h * 0.16 + Math.sin(p * TAU * 0.35 + t * 0.2) * h * 0.08;
      // the bundle's width: it twists shut where the envelope crosses zero
      const env = Math.sin(p * TAU * 0.75 + t * 0.5 + 0.6);
      const width = env * h * 0.42;
      // each line rides its own place in the fan, with a little lag
      const y = cy + spine + u * width + Math.sin(p * TAU * 1.6 - t * 0.9 + u * 3) * h * 0.02 * (1 - Math.abs(u) * 1.4);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    // paper at the left, red through the middle, deep red at the right
    const g = ctx.createLinearGradient(0, 0, w, 0);
    const a = 0.22 + 0.5 * (1 - Math.abs(u) * 1.6);
    g.addColorStop(0, `rgba(245,240,235,${Math.max(0, a * 0.9)})`);
    g.addColorStop(0.42, `rgba(255,176,171,${Math.max(0, a)})`);
    g.addColorStop(0.62, `rgba(219,54,48,${Math.max(0, a)})`);
    g.addColorStop(1, `rgba(122,35,32,${Math.max(0, a * 0.7)})`);
    ctx.strokeStyle = g;
    ctx.stroke();
  }
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
    let w = 0, h = 0, dpr = 1;
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = host.clientWidth; h = host.clientHeight;
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h, reduced ? 1.2 : last / 1000);
    };
    let last = 0;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      last = now - start;
      draw(ctx, w, h, last / 1000);
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
    </div>
  );
}
