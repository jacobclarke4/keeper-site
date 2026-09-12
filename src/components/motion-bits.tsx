import { useEffect, useState, type ReactNode } from "react";
import { useInView, usePrefersReducedMotion } from "../lib/motion";

/* A number that counts up when it scrolls into view. Accepts "2.5M",
   "45%", "2 in 3", "$1,000": the first number counts, the rest stays. */
export function CountUp({ value, duration = 1400, className = "" }: { value: string; duration?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>();
  const m = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const prefix = m?.[1] ?? "", numText = m?.[2] ?? "0", suffix = m?.[3] ?? "";
  const target = parseFloat(numText.replace(/,/g, ""));
  const decimals = (numText.split(".")[1] ?? "").length;
  const grouped = numText.includes(",");
  const [n, setN] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced || !inView) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setN(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target, duration]);
  const shown = grouped ? Math.round(n).toLocaleString("en-US") : n.toFixed(decimals);
  return <span ref={ref} className={className}>{prefix}{shown}{suffix}</span>;
}

/* An endless marquee: the children are duplicated and slide forever;
   hover pauses it. `reverse` runs the other way. */
export function Marquee({ children, reverse = false, speed = 40, className = "" }: { children: ReactNode; reverse?: boolean; speed?: number; className?: string }) {
  return (
    <div className={`marquee${reverse ? " marquee--reverse" : ""} ${className}`.trim()} style={{ ["--speed" as string]: `${speed}s` }}>
      <div className="marquee__track">
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

/* An auto-advancing carousel: one slide at a time, a red progress bar,
   dots you can tap. Pauses on hover. */
export function Carousel({ slides, interval = 4200, className = "" }: { slides: ReactNode[]; interval?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setTimeout(() => { setTick((t) => t + 1); setI((v) => (v + 1) % slides.length); }, interval);
    return () => window.clearTimeout(id);
  }, [i, paused, reduced, interval, slides.length]);
  return (
    <div className={`carousel ${className}`.trim()} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="carousel__stage">
        {slides.map((s, j) => (
          <div key={j} className={`carousel__slide${j === i ? " is-on" : ""}`} aria-hidden={j !== i}>{s}</div>
        ))}
      </div>
      <div className="carousel__bar" aria-hidden="true">
        <span key={`${i}-${tick}`} className={`carousel__fill${paused || reduced ? " is-paused" : ""}`} style={{ ["--t" as string]: `${interval}ms` }} />
      </div>
      <div className="carousel__dots" role="tablist">
        {slides.map((_, j) => (
          <button key={j} type="button" role="tab" aria-selected={j === i} className={`carousel__dot${j === i ? " is-on" : ""}`} onClick={() => setI(j)} aria-label={`Slide ${j + 1}`} />
        ))}
      </div>
    </div>
  );
}
