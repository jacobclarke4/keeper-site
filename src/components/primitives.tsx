import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../lib/motion";

/* ──────────────────────────────────────────────────────────
   Sunlit Stationery primitives.
   Warm, rounded, human. Every device is sliced from the brand's
   calligraphic O (reused verbatim from public/toc-icon.svg — the
   exact same path data, never redrawn).
   ────────────────────────────────────────────────────────── */

/** The calligraphic O, reused verbatim from toc-icon.svg (cls-2 path).
 *  Rendered at any size / colour / opacity: the sunrise, the footer
 *  watermark, and the geometry every panel is cut from. */
const O_PATH =
  "M270.95,157.72c0,43.97-21.98,84.79-49.46,112.27-28.66,28.26-61.63,38.86-87.15,38.86-21.2,0-46.71-11.38-61.63-31.8-13.35-17.67-19.24-37.69-19.24-65.95,0-35.72,14.92-74.98,38.08-102.46,26.69-32.58,62.02-51.43,96.96-51.43,49.07,0,82.44,43.97,82.44,100.5ZM122.96,110.22c-20.02,27.09-38.86,81.65-38.86,126.41,0,48.68,20.81,63.6,45.15,63.6,20.81,0,43.18-8.24,66.74-37.69,23.16-29.05,44.75-88.72,44.75-127.19,0-32.58-8.24-70.66-46.72-70.66-26.3,0-49.46,15.7-71.05,45.54Z";

export function OMark({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={`omark ${className}`.trim()}
      viewBox="0 0 395.84 395.84"
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d={O_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

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
        <text className="seal__mono" x="66" y="74" textAnchor="middle" fontSize="40">O</text>
        <text className="seal__co" x="86" y="82" textAnchor="middle" fontSize="14">Co.</text>
        <path d="M 46,90 h 40" stroke="currentColor" strokeWidth="0.8" />
        <path d="M 52,42 h 28" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
