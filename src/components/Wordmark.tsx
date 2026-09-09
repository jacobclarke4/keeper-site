/* ──────────────────────────────────────────────────────────
   The typographic wordmark — the shared house identity.
   Per the brand guide, the identity IS the typeset name: an
   italic high-contrast serif with the dominant word large and
   a thin Current-blue rule beneath. One component, every
   Commonwealth company sets its own name in the same hand:

     Keeper  ·  Commonwealth  ·  The Maker Company

   Size is inherited from the parent's font-size; color follows
   the variant (light on paper, dark on navy).
   ────────────────────────────────────────────────────────── */

export type WordmarkProps = {
  /** Small leading word, e.g. "The". Omit for single-word marks. */
  lead?: string;
  /** The dominant word, e.g. "Outcome" / "Commonwealth". */
  strong: string;
  /** Small trailing word, e.g. "Company". Omit for single-word marks. */
  trail?: string;
  variant?: "light" | "dark";
  className?: string;
};

export function Wordmark({ lead, strong, trail, variant = "light", className = "" }: WordmarkProps) {
  return (
    <span className={`wordmark wordmark--${variant} ${className}`.trim()}>
      <span className="wordmark__lock">
        {lead && <span className="wordmark__lead">{lead}</span>}
        <span className="wordmark__strong">{strong}</span>
        {trail && <span className="wordmark__trail">{trail}</span>}
      </span>
    </span>
  );
}

/** This site's name, in one place so the masthead + colophon never drift. */
export const WORDMARK = { strong: "Keeper" } as const;
