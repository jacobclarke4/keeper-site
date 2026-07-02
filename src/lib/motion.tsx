/* eslint-disable react-refresh/only-export-components */
import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/* ──────────────────────────────────────────────────────────
   Ink & Letterpress — the site's one motion physics.
   Everything below renders its FINAL state when
   prefers-reduced-motion is set (end-state-first discipline).
   ────────────────────────────────────────────────────────── */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

type InViewOpts = { rootMargin?: string };

export function useInView<T extends HTMLElement>(opts?: InViewOpts) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const rootMargin = opts?.rootMargin ?? "0px 0px -8% 0px";
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // Intentional one-time reveal when IO is unavailable (SSR/old browsers).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }
    // Already in (or near) the viewport on mount — reveal without waiting.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.94 && rect.bottom > 0) {
       
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, inView };
}

/**
 * Ink — the universal in-view choreography wrapper.
 * fx: "rise" (type settles into the stick) · "wash" (ink washes top→down)
 *     · "rule" (hairline draws left→right) · "vrule" (top→bottom)
 *     · "none" (just exposes .is-in for custom CSS)
 */
export function Ink({
  children,
  fx = "rise",
  delay = 0,
  as = "div",
  className = "",
  style = {},
  ...rest
}: {
  children?: ReactNode;
  fx?: "rise" | "wash" | "rule" | "vrule" | "none";
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
} & Record<string, unknown>) {
  const { ref, inView } = useInView<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      ...rest,
      className: `ink ink--${fx}${inView ? " is-in" : ""}${className ? " " + className : ""}`,
      style: { "--d": `${delay}ms`, ...style } as CSSProperties,
    },
    children
  );
}

/** A hairline rule that draws itself when scrolled into view. */
export function RuleDraw({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return <Ink as="div" fx="rule" delay={delay} className={`rule-draw ${className}`.trim()} aria-hidden="true" />;
}

/** Mono text that teletypes in (capped speed; instant under reduced motion). */
export function Teletype({ text, className = "", startDelay = 0 }: { text: string; className?: string; startDelay?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    let t0 = 0;
    const total = Math.min(1100, 15 * text.length);
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0 - startDelay) / total);
      setN(Math.max(0, Math.round(k * text.length)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, reduced, startDelay]);
  // Under reduced motion (or before in-view) show the full string immediately.
  const shown = reduced ? text.length : n;
  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      {/* hidden remainder keeps layout from shifting while typing */}
      <span aria-hidden="true" style={{ visibility: "hidden" }}>{text.slice(shown)}</span>
    </span>
  );
}

/** Tabular numeral that counts up to its value when scrolled into view. */
export function useCountUp<T extends HTMLElement = HTMLElement>(target: number, opts?: { duration?: number; start?: number }) {
  const { ref, inView } = useInView<T>();
  const reduced = usePrefersReducedMotion();
  const [raw, setRaw] = useState(opts?.start ?? 0);
  const duration = opts?.duration ?? 900;
  const start = opts?.start ?? 0;
  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setRaw(Math.round(start + (target - start) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, start, reduced]);
  // Reduced motion snaps to the final value with no animation.
  const value = reduced ? target : raw;
  return { ref, value, inView };
}

/**
 * Progress (0..1) of an element's own scroll-through — used for the pinned
 * Charter oath. 0 when the element's top reaches the viewport top.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(1);
        return;
      }
      setProgress(Math.min(1, Math.max(0, -rect.top / total)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return { ref, progress };
}

/**
 * Scrollspy — reports the id of the section currently crossing the viewport
 * midband. The -45%/-45% rootMargin narrows the active zone to a horizontal
 * band through the middle, so exactly one section reads as active.
 */
export function useScrollSpy(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Deterministic placed-paper jitter — stable per index, no Math.random. */
export const paperTilt = (index: number): number => (((index * 7) % 5) - 2) * 0.4;
