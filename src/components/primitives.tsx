import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../lib/motion";

/* ──────────────────────────────────────────────────────────
   Sunlit Stationery primitives.
   Warm, rounded, human. Pills, chips, buttons, and the seal.
   ────────────────────────────────────────────────────────── */

export function Btn({
  children,
  variant = "solid",
  size = "md",
  onClick,
  className = "",
  href,
  newTab = false,
  type,
  disabled,
}: {
  children: ReactNode;
  variant?: "solid" | "accent" | "ghost" | "ghost-dark" | "link";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  href?: string;
  newTab?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();
  if (href) {
    const ext = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a className={cls} href={href} {...ext}>
        <span className="btn__label">{children}</span>
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick} type={type ?? "button"} disabled={disabled}>
      <span className="btn__label">{children}</span>
    </button>
  );
}

/** Trailing arrow that slides on button hover. */
export function Arrow() {
  return <span className="arrow" aria-hidden="true">→</span>;
}

/** A small seafoam sentence-case label — the warm replacement for every
 *  mono all-caps kicker. */
export function TabPill({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return <span className={`tab-pill${onDark ? " tab-pill--dark" : ""}`}>{children}</span>;
}

/** The brand's recurring smile: a plump seafoam pill whose checkmark
 *  springs in when it enters view. The DONE-stamp re-expression. Always
 *  paired with a visually-hidden "Done" and shown pre-checked under
 *  reduced motion. */
export function CheckChip({
  children,
  delay = 0,
  className = "",
}: {
  children?: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={`check-chip${inView ? " is-checked" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      <span className="check-chip__mark" aria-hidden="true">
        <svg viewBox="0 0 16 16" focusable="false">
          <path
            d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="visually-hidden">Done. </span>
      {children && <span className="check-chip__label">{children}</span>}
    </span>
  );
}

/** The chartered member seal — the O engraved in hairlines, gently glowing.
 *  Used large behind Commonwealth and small in the footer credo. */
export function Seal({
  size = 160,
  animate = true,
  className = "",
}: {
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`seal${animate ? " seal--animate" : ""}${inView ? " is-in" : ""} ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 132 132" width={size} height={size}>
        <circle cx="66" cy="66" r="63" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="66" cy="66" r="59" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="66" cy="66" r="40" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="66" cy="66" r="47" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3.2" opacity="0.85" />
        <path id="seal-ring" d="M 66,66 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" fill="none" />
        <text className="seal__ring" fontSize="8.4" letterSpacing="2.6">
          <textPath href="#seal-ring" startOffset="0">
            A COMMONWEALTH COMPANY · NEVER SOLD ·
          </textPath>
        </text>
        <text className="seal__mono" x="66" y="78" textAnchor="middle" fontSize="40">K</text>
        <path d="M 46,90 h 40" stroke="currentColor" strokeWidth="0.8" />
        <path d="M 52,42 h 28" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
