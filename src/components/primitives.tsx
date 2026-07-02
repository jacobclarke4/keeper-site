import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Ink, useInView, usePrefersReducedMotion } from "../lib/motion";
import { LINKS, goExternal } from "../lib/links";

/* ──────────────────────────────────────────────────────────
   Print primitives — every edition composes from these.
   ────────────────────────────────────────────────────────── */

/** Mono kicker with a leading hairline; optionally carries a § folio tag. */
export function Kicker({
  children,
  folio,
  onDark = false,
  center = false,
}: {
  children: ReactNode;
  folio?: string;
  onDark?: boolean;
  center?: boolean;
}) {
  return (
    <span className={`kicker${onDark ? " on-dark" : ""}${center ? " is-center" : ""}`}>
      {folio && <span className="kicker__folio">§ {folio}</span>}
      {children}
    </span>
  );
}

export function SectionHead({
  kicker,
  title,
  sub,
  onDark = false,
  align = "left",
}: {
  kicker?: string;
  title: ReactNode;
  sub?: ReactNode;
  onDark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <header className={`sec-head${onDark ? " on-dark" : ""} align-${align}`}>
      {kicker && (
        <Ink as="div" fx="rise">
          <Kicker onDark={onDark} center={align === "center"}>{kicker}</Kicker>
        </Ink>
      )}
      <Ink as="h2" fx="rise" delay={70} className="sec-head__title display">{title}</Ink>
      {sub && <Ink as="p" fx="rise" delay={140} className="sec-head__sub">{sub}</Ink>}
    </header>
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
  /** Open the link in a new tab. Default is same-tab (right for the sign-up flow). */
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

/** Trailing arrow that advances on button hover. */
export function Arrow() {
  return <span className="arrow" aria-hidden="true">→</span>;
}

/** A mono stamp that thunks down when scrolled into view. */
export function Stamp({
  children,
  delay = 0,
  tone = "ink",
  className = "",
  tilt = -2,
}: {
  children: ReactNode;
  delay?: number;
  tone?: "ink" | "ocean" | "current" | "seafoam" | "fine";
  className?: string;
  tilt?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={`stamp stamp--${tone}${inView ? " is-stamped" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms`, "--tilt": `${tilt}deg` } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** The chartered wax-seal medallion, engraved in hairlines. Stamps on enter. */
export function Seal({ size = 132, animate = true, className = "" }: { size?: number; animate?: boolean; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`seal${animate ? " seal--animate" : ""}${inView ? " is-stamped" : ""} ${className}`.trim()}
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

/** An abstract signature flourish that writes itself on enter. */
export function SignatureWrite({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`signature${inView ? " is-writing" : ""} ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 320 84" width="100%" preserveAspectRatio="xMidYMid meet">
        <path
          className="signature__path"
          pathLength={1}
          d="M14,56 C30,18 44,14 50,30 C56,46 40,66 32,62 C24,58 52,30 78,34 C96,37 88,58 76,58 C66,58 84,38 108,42 C126,45 118,60 132,52 C146,44 150,34 166,40 C180,45 172,58 188,50 C200,44 208,36 224,42 C238,47 240,56 258,46 C270,39 282,40 306,44"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          className="signature__under"
          pathLength={1}
          d="M40,72 C110,66 220,68 296,64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Index entry with leader dots running to a folio reference. */
export function LeaderRow({
  numeral,
  title,
  desc,
  cta,
  refMark,
  onClick,
  delay = 0,
}: {
  numeral: string;
  title: ReactNode;
  desc?: string;
  cta?: string;
  refMark: string;
  onClick?: () => void;
  delay?: number;
}) {
  return (
    <Ink
      as={onClick ? "button" : "div"}
      fx="rise"
      delay={delay}
      className={`leader${onClick ? " is-link" : ""}`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      <span className="leader__numeral">{numeral}</span>
      <span className="leader__body">
        <span className="leader__line">
          <span className="leader__title display">{title}</span>
          <span className="leader__dots" aria-hidden="true" />
          <span className="leader__ref mono">{refMark}</span>
        </span>
        {desc && <span className="leader__desc">{desc}</span>}
        {cta && (
          <span className="leader__cta">
            {cta} <Arrow />
          </span>
        )}
      </span>
    </Ink>
  );
}

/** Footnote apparatus at a section's foot. */
export function FootNotes({ notes, onDark = false }: { notes: Array<[string, ReactNode]>; onDark?: boolean }) {
  return (
    <Ink as="div" fx="rise" className={`footnotes${onDark ? " on-dark" : ""}`}>
      <RuleSpan />
      <ol>
        {notes.map(([mark, body]) => (
          <li key={mark}>
            <span className="footnotes__mark">{mark}</span>
            <span className="footnotes__body">{body}</span>
          </li>
        ))}
      </ol>
    </Ink>
  );
}

function RuleSpan() {
  return <span className="footnotes__rule" aria-hidden="true" />;
}

export function Sup({ children }: { children: ReactNode }) {
  return <sup className="fn-ref mono">{children}</sup>;
}

/** A bordered figure plate with an engraver's cutline. */
export function Plate({
  children,
  cutline,
  delay = 0,
  className = "",
  tilt = 0,
}: {
  children: ReactNode;
  cutline: string;
  delay?: number;
  className?: string;
  tilt?: number;
}) {
  return (
    <Ink as="figure" fx="wash" delay={delay} className={`plate ${className}`.trim()} style={tilt ? { rotate: `${tilt}deg` } : undefined}>
      <div className="plate__body">{children}</div>
      <figcaption className="plate__cutline mono">{cutline}</figcaption>
    </Ink>
  );
}

/** The page-foot folio ornament: — 2 — */
export function PageFolio({ n }: { n: string }) {
  return (
    <div className="page-folio mono" aria-hidden="true">
      — {n} —
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Shared composed pieces
   ────────────────────────────────────────────────────────── */

/** The $100/day guarantee plate — deliberately identical on Makers & Concierges. */
export function GuaranteePlate({
  role,
  ctaLabel,
  onCta,
}: {
  role: "Maker" | "Concierge";
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <Ink as="div" fx="rise" className="guarantee">
      <div className="guarantee__inner">
        <div className="guarantee__copy">
          <Kicker onDark>The floor we hold ourselves to</Kicker>
          <h3 className="display guarantee__h">
            Every {role} on the platform can earn at least <em>$100 a day</em>.<Sup>†</Sup>
          </h3>
          <p className="guarantee__foot mono">† A COMMONWEALTH GUARANTEE · WE CAP ACCEPTANCE AGAINST DEMAND SO THE FLOOR HOLDS · SEE “SUPPLY, ON PURPOSE”</p>
        </div>
        <div className="guarantee__side">
          <Seal size={108} />
          <Btn variant="ghost-dark" onClick={onCta}>
            {ctaLabel} <Arrow />
          </Btn>
        </div>
      </div>
    </Ink>
  );
}

/** Editor's-note box (paper-dim, Garamond lead). */
export function EditorNote({
  lead,
  children,
  foot,
}: {
  lead: ReactNode;
  children?: ReactNode;
  foot?: string;
}) {
  return (
    <Ink as="aside" fx="rise" className="editor-note">
      <span className="editor-note__head mono">Editor’s note</span>
      <p className="editor-note__lead">{lead}</p>
      {children}
      {foot && <p className="editor-note__foot mono">{foot}</p>}
    </Ink>
  );
}

/** Standfirst strap before the colophon (replaces FooterBumper). */
export function Standfirst({ line }: { line: ReactNode }) {
  return (
    <section className="standfirst">
      <div className="wrap standfirst__inner">
        <Ink as="p" fx="rise" className="standfirst__line display">{line}</Ink>
        <Btn variant="ghost" onClick={goExternal(LINKS.commonwealth)}>
          Read the Charter <Arrow />
        </Btn>
      </div>
    </section>
  );
}

/** Rotating wire bulletin (crossfading outcome items). */
export function Rotator({ items, interval = 2600 }: { items: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();
  const count = items.length;
  useEffect(() => {
    if (reduced || count <= 1) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [interval, count, reduced]);
  return (
    <span className="rotator" key={i}>
      {items[i % count]}
    </span>
  );
}
