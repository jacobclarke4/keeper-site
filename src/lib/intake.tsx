import type { ReactNode } from "react";

// All intake flows post to the same Formspree endpoint with a formType
// discriminator — wiring preserved exactly from the original site.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqaevwn";

export async function postIntake(
  payload: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => null)) as { errors?: Array<{ message?: string }> } | null;
    return { ok: false, error: data?.errors?.[0]?.message ?? "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export type ApplyKind = "waitlist" | "maker" | "concierge";

export type ApplyField = {
  name: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  optional?: boolean;
};

export type ApplyConfig = {
  formType: string;
  slipTitle: string;
  heading: ReactNode;
  intro: string;
  submitLabel: string;
  successStamp: string;
  successHeading: ReactNode;
  successBody: string;
  disclaimer: string;
  fields: ApplyField[];
};

export const APPLY_FORMS: Record<ApplyKind, ApplyConfig> = {
  waitlist: {
    formType: "waitlist",
    slipTitle: "WAITLIST · INTAKE SLIP",
    heading: <>Be first <em>through the door.</em></>,
    intro: "Tell us a little about what you're trying to do. When we open early access for your outcome area, you'll be the first to know.",
    submitLabel: "File my slip",
    successStamp: "FILED",
    successHeading: <>You're <em>in</em>.</>,
    successBody: "We'll email you when early access opens for the outcomes you're after. No spam, no list sharing.",
    disclaimer: "We'll only email you about early access, and only to this address. No spam, no list sharing.",
    fields: [
      { name: "desiredOutcomes", label: "Outcomes you're after", placeholder: "e.g., hired team, launched store, tax package…", textarea: true, optional: true },
    ],
  },
  maker: {
    formType: "maker",
    slipTitle: "MAKER · APPLICATION SLIP",
    heading: <>Build the outcomes. <em>Get paid to.</em></>,
    intro: "Makers build every tool and outcome on the platform, bid on real projects, and get paid through transparent escrow. Tell us what you build.",
    submitLabel: "File application",
    successStamp: "RECEIVED",
    successHeading: <>You're in the <em>pool</em>.</>,
    successBody: "We bring Makers on in cohorts. We'll email you about next steps, onboarding to Maker OS, and your first projects on Giga Board.",
    disclaimer: "Shared only with our Maker team. We'll reach out about onboarding.",
    fields: [
      { name: "skills", label: "What do you build?", placeholder: "e.g., AI agents, web apps, automations, data pipelines…", textarea: true },
      { name: "portfolio", label: "Portfolio or GitHub", placeholder: "github.com/you, a site, a repo…", optional: true },
    ],
  },
  concierge: {
    formType: "concierge",
    slipTitle: "CONCIERGE · WAITLIST SLIP",
    heading: <>Be the human <em>who makes it land.</em></>,
    intro: "Concierges scope what people need, route them to the right outcome, and make sure it actually arrives. Tell us a bit about you.",
    submitLabel: "File my slip",
    successStamp: "FILED",
    successHeading: <>We'll be <em>in touch</em>.</>,
    successBody: "We bring Concierges on in cohorts as Users join. We'll email you when applications open, along with the AIQ and certification steps at The Learning Company.",
    disclaimer: "Shared only with our Concierge team. We'll reach out when cohorts open.",
    fields: [
      { name: "experience", label: "How do you help people today?", placeholder: "Support, teaching, account management, community… anywhere you guide people.", textarea: true },
      { name: "languages", label: "Languages you speak", placeholder: "e.g., English, Spanish…", optional: true },
    ],
  },
};

export const OUTCOMES_TICKER = [
  "A qualified sales pipeline with 30 booked calls.",
  "A launched Shopify store with your first sales.",
  "A ghostwritten book manuscript.",
  "A 12-week body-composition plan.",
  "A year-end tax package.",
  "A hired engineering team.",
  "A production-ready website.",
  "A complete SOC 2 evidence package.",
  "A regulated-industry compliance review.",
  "A quarterly financial close, reconciled.",
];
