import type { ReactNode } from "react";

/* ──────────────────────────────────────────────────────────
   Outcome data — the union member's catalog.
   One source of truth for the wire ticker, the catalog grid,
   the pricing card, and the FAQ.

   Keeper drafts, files, and tracks the paperwork that protects
   working people: workers' comp claims, ERISA benefit appeals,
   and grievances first; wages, leave, and safety behind them.
   ────────────────────────────────────────────────────────── */

/** The live "delivered" wire — short, plain, finished things. Also feeds the
 *  colophon ribbon, so keep the voice plain and steady. */
export const OUTCOMES_TICKER = [
  "A workers' comp claim, filed inside the deadline.",
  "A denied disability benefit, appealed under ERISA.",
  "A grievance written to the contract, ready for your steward.",
  "Unpaid overtime, reconciled and demanded in writing.",
  "A pension statement, checked line by line.",
  "An FMLA denial, answered with the statute.",
  "A health plan denial, appealed and sent certified.",
  "A write-up, answered before the meeting.",
  "Your contract, explained in plain words.",
  "The doctor's note and wage statement, gathered for your claim.",
];

/* ── the catalog ─────────────────────────────────────────── */

export type Outcome = {
  /** Short grouping label. Workers' comp, ERISA, and grievances lead. */
  group: string;
  /** The card title — what you'd ask for. */
  title: string;
  /** One line: what you tell us. */
  ask: string;
  /** One line: what we hand back. */
  deliver: string;
};

/** The filings members ask for most. Every one ends the same way: the
 *  document drafted, reviewed by you, filed, and in your hands with the
 *  deadline met. Add rows to grow it. */
export const CATALOG: Outcome[] = [
  {
    group: "Workers' comp",
    title: "File a workers' comp claim",
    ask: "Tell us what happened, where it hurts, and when you reported it.",
    deliver:
      "The claim form completed, the employer notice sent, and a checklist for your doctor's visit. All before the deadline.",
  },
  {
    group: "Workers' comp",
    title: "Fight a denied workers' comp claim",
    ask: "Send us the denial letter. A photo is fine.",
    deliver:
      "A plain-words read of why they denied it, the appeal drafted, and the hearing request filed.",
  },
  {
    group: "ERISA & benefits",
    title: "Appeal a denied pension or disability benefit",
    ask: "Send us the denial, and your plan documents if you have them.",
    deliver:
      "A written ERISA appeal citing your plan and the law, sent certified so the 180-day clock is on record.",
  },
  {
    group: "ERISA & benefits",
    title: "Get your plan documents and check your pension",
    ask: "Tell us who runs your plan.",
    deliver:
      "The written request for your Summary Plan Description and benefit statement, and a line-by-line check when they arrive.",
  },
  {
    group: "ERISA & benefits",
    title: "Appeal a health plan denial",
    ask: "Send us the denial and the bill.",
    deliver:
      "The internal appeal drafted and sent, and the external review requested if they say no again.",
  },
  {
    group: "Grievances",
    title: "File a grievance",
    ask: "Tell us what the company did and when. Share your contract if you can.",
    deliver:
      "A grievance written to the article and section it violates, timestamped, and ready for your steward and step one.",
  },
  {
    group: "Grievances",
    title: "Answer a write-up or discipline",
    ask: "Send us the write-up and tell us your side.",
    deliver:
      "Your written response, a just-cause checklist, and the questions to bring into the meeting.",
  },
  {
    group: "Grievances",
    title: "Prepare for a grievance meeting or arbitration",
    ask: "Tell us where the case stands and what you've got.",
    deliver:
      "A clean timeline, the evidence organized, and a one-page brief of the argument.",
  },
];

/** The rest of the shelf, named in one line under the catalog. */
export const ALSO = [
  "unpaid wages and overtime",
  "FMLA leave and denials",
  "unsafe job sites",
  "what your contract actually says",
];

/* ── pricing ─────────────────────────────────────────────── */

export type Tier = {
  name: string;
  price: string;
  per?: string;
  blurb: ReactNode;
  soon?: boolean;
};

export const TIERS: Tier[] = [
  {
    name: "Membership",
    price: "$14",
    per: "/mo",
    blurb: "Every claim, appeal, and grievance you need, drafted and filed. A real person when a case needs one. Plus your Wallet.",
  },
];

/* ── FAQ ─────────────────────────────────────────────────── */

export type Faq = { q: string; a: ReactNode };

export const FAQ: Faq[] = [
  {
    q: "Is this legal advice?",
    a: "No. Keeper drafts, files, and keeps track of the deadlines, and every document comes with the rule it relies on, so you can check it. When a case needs a licensed attorney, we say so and hand it off, under privilege.",
  },
  {
    q: "Does this replace my steward or my union?",
    a: "No. It arms them. Your grievance arrives written to the contract, with the timeline and evidence organized, so your steward starts at step one instead of at a blank page.",
  },
  {
    q: "Do I need to be good with technology?",
    a: "No. That's the whole point. If you can say what happened, you can use this. Type it, say it, or send a photo of the paper.",
  },
  {
    q: "What if I don't speak English well?",
    a: "Keeper works in ten languages, including Spanish, Chinese, Tagalog, Vietnamese, and Arabic. Tell us what happened, your way, and the questions and the answer come back in your language.",
  },
  {
    q: "What does $14 a month get me?",
    a: "As many claims, appeals, and grievances as you need. You tell us what happened, we draft and file, and you get the paper trail.",
  },
  {
    q: "Is a real person ever involved?",
    a: "Yes. Our support line is always open, and when a case needs a person, a real one steps in and stays on it. Anything that needs a licensed professional gets routed to one.",
  },
];
