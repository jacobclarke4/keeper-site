import type { ReactNode } from "react";

/* ──────────────────────────────────────────────────────────
   Outcome data — the everyday, human catalog.
   One source of truth for the wire ticker, the catalog grid,
   the pricing card, and the FAQ.
   ────────────────────────────────────────────────────────── */

/** The live "delivered" wire — short, plain, finished things. Also feeds the
 *  colophon ribbon, so keep the voice everyday and warm. */
export const OUTCOMES_TICKER = [
  "A weekend trip, planned to the dollar.",
  "That confusing bill, explained in plain words.",
  "The form you've been dreading: filled out and filed.",
  "A month of dinners, planned and shopped for.",
  "A warranty claim, sorted and sent.",
  "The best phone plan: found, and switched to.",
  "A birthday party, handled start to finish.",
  "Your subscriptions, trimmed and tidied.",
  "A heartfelt letter: written, the way you meant it.",
  "A pile of paperwork, sorted and organized.",
];

/* ── the catalog ─────────────────────────────────────────── */

export type Outcome = {
  /** Short, soft grouping label. Intentionally informal — these will shift
   *  after beta feedback, so nothing here is a hard taxonomy. */
  group: string;
  /** The card title — what you'd ask for. */
  title: string;
  /** One line: what you tell us. */
  ask: string;
  /** One line: what we hand back. */
  deliver: string;
};

/** A representative slice of the catalog. The live product carries 100+,
 *  grouped into categories that move with beta feedback — this is the
 *  on-brand, data-driven shape they all share. Add rows to grow it. */
export const CATALOG: Outcome[] = [
  {
    group: "Trips & plans",
    title: "Plan a weekend trip on a budget",
    ask: "Tell us where you'd like to go and what you can spend.",
    deliver: "A day-by-day plan, places to stay, and what it'll cost. Ready to go.",
  },
  {
    group: "Money & bills",
    title: "Make sense of a confusing bill",
    ask: "Send us the bill that doesn't add up.",
    deliver: "A plain-words breakdown of every line, and what, if anything, to do next.",
  },
  {
    group: "Money & bills",
    title: "Lower a bill you're already paying",
    ask: "Tell us which bill feels too high.",
    deliver: "The cheaper options we found, and the switch made for you.",
  },
  {
    group: "Paperwork",
    title: "Fill out the form you've been dreading",
    ask: "Tell us which form, and answer a few simple questions.",
    deliver: "The form, filled out correctly and ready to send.",
  },
  {
    group: "Paperwork",
    title: "Sort and organize your important documents",
    ask: "Hand us the pile: digital or photos of paper.",
    deliver: "Everything named, sorted, and easy to find when you need it.",
  },
  {
    group: "Home & life",
    title: "Plan a month of dinners",
    ask: "Tell us who you're feeding and what you like.",
    deliver: "Four weeks of meals and one tidy grocery list.",
  },
  {
    group: "Home & life",
    title: "Get quotes for a home repair",
    ask: "Tell us what's broken and where you live.",
    deliver: "Real quotes, a fair price range, and a checklist of what to ask.",
  },
  {
    group: "Home & life",
    title: "Plan a birthday party",
    ask: "Tell us who it's for and your budget.",
    deliver: "A plan, a shopping list, and a simple timeline for the day.",
  },
  {
    group: "Writing",
    title: "Write a heartfelt letter or speech",
    ask: "Tell us the occasion and what's in your heart.",
    deliver: "Words that sound like you, ready to read or send.",
  },
  {
    group: "Decisions",
    title: "Compare two big choices",
    ask: "Tell us the two options you're weighing.",
    deliver: "A clear, honest side-by-side. And a straight recommendation.",
  },
  {
    group: "Tech, handled",
    title: "Find the right phone or internet plan",
    ask: "Tell us what you use and what you pay now.",
    deliver: "The best plan for you, and the switch done for you.",
  },
  {
    group: "Tech, handled",
    title: "Set up a new device the right way",
    ask: "Tell us what you just got.",
    deliver: "Step-by-step help, or we walk you through it on the phone.",
  },
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
    name: "Base",
    price: "$14",
    per: "/mo",
    blurb: "Everyday outcomes, as many as you need. Plus your Wallet.",
  },
  {
    name: "Premium",
    price: "$39",
    per: "/mo",
    blurb:
      "Everything in Base, plus a generous personal concierge, and a real person on call for the moments that need one.",
  },
  {
    name: "Apps",
    price: "Coming soon",
    blurb:
      "Full apps built for the things you do most. We'll let you know the moment they're ready.",
    soon: true,
  },
];

/* ── FAQ ─────────────────────────────────────────────────── */

export type Faq = { q: string; a: ReactNode };

export const FAQ: Faq[] = [
  {
    q: "Do I need to be good with technology?",
    a: "No. That's the whole point. If you can ask a question, you can use this.",
  },
  {
    q: "What if I don't speak English well?",
    a: "Our support line works in your language. Tell us what you need, your way.",
  },
  {
    q: "What does $14 a month get me?",
    a: "As many everyday outcomes as you need. You ask, we do them, you get the finished result.",
  },
  {
    q: "Will I get charged extra without knowing?",
    a: "Never. A few heavy requests may cost more to run, but we'll always show you the price and wait for your yes before we begin. If you don't accept, you don't pay.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime. No hoops.",
  },
  {
    q: "Is a real person ever involved?",
    a: "Yes. Our support line is always open, and on Premium, a real person is on call for anything that needs one.",
  },
  {
    q: "How does the Wallet work?",
    a: "Everything you spend comes from your own balance: money you've put in, nothing more. There's no credit, no hidden fees, and no way for a bill to quietly grow while you're not looking. You'll always know what something costs before it happens.",
  },
  {
    q: "What is Commonwealth?",
    a: "The Outcome Company is one part of Commonwealth, a community built on a simple promise: bring everyone into this new world together, and leave no one behind. Half of every dollar of profit goes back to the community — and that promise can never be sold or taken away. It's written down, and it's binding.",
  },
];
