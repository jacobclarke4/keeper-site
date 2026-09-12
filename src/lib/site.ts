/* ──────────────────────────────────────────────────────────
   Site data for the Keeper microsite: the challenge, the mission,
   the process figures, the scripts, the services, the
   states. Figures and services come from the Keeper app (the rebuild
   branch of the-outcome-company-app); the statistics are cited.
   ────────────────────────────────────────────────────────── */

export const STATS = [
  {
    n: "2.5M",
    label: "workplace injuries reported in one year",
    source: "U.S. Bureau of Labor Statistics, 2024",
    href: "https://www.bls.gov/opub/ted/2026/2-5-million-workplace-injuries-and-illnesses-in-private-industry-in-2024-down-3-1-percent-from-2023.htm",
  },
  {
    n: "45%",
    label: "of injured workers never file a claim",
    source: "RAND Corporation; U.S. Department of Labor",
    href: "https://www.dol.gov/sites/dolgov/files/OASP/files/WorkersCompensationSystemReport.pdf",
  },
  {
    n: "2 in 3",
    label: "denied claims are paid within a year anyway",
    source: "Lockton Analytics, 273,000 claims",
    href: "https://riskandinsurance.com/70-percent-denied-comp-claims-converted-and-paid/",
  },
] as const;

export const MISSION =
  "Keeper has every deadline and every paper in your claim, from the day you're hurt to the last check. You do the errands. We do the paperwork. Nothing slips.";

/* The workers' comp map, by the app's own count. */
export const MAP = {
  boxes: 348,
  decisions: 78,
  paths: 539,
  stations: [
    "Hurt at work",
    "Employer told, in writing",
    "First medical record",
    "The requests go out",
    "The carrier decides",
    "Filed with the state",
    "Paid right, to the end",
  ],
} as const;

/* Populated scripts: what to say, and to whom. Verbatim from the app. */
export const SCRIPTS = [
  { say: "This happened at work today. Please put that in my chart.", to: "the first doctor who treats you" },
  { say: "I reasonably believe this interview could lead to discipline, and I am requesting my union representative before it continues.", to: "the boss who calls you in" },
  { say: "Under Section 8(a) of the Illinois Workers' Compensation Act, this is my first choice of physician.", to: "the adjuster" },
] as const;

export const GUARANTEE = {
  amount: "$1,000",
  line: "Do every required step on Keeper and, if your claim is wrongly denied anyway, Keeper pays you $1,000.",
  fine: "Terms not final. The required steps are marked in the app as you go.",
};

/* Every service, specifically named, as the app names them. */
export const SERVICES = [
  { name: "Workers' compensation, A to Z", line: "From the day you're hurt to a claim paid at the right rate, and if they say no, to a record ready for the hearing." },
  { name: "ERISA health plan denial", line: "Your health plan said no: the appeal, the outside review, and the court." },
  { name: "ERISA disability denial", line: "Short or long-term disability under your plan: the 180-day appeal, done right." },
  { name: "ERISA pension denial", line: "A pension benefit denied or miscalculated: the plan documents, the appeal, the record." },
  { name: "ERISA life insurance denial", line: "A life benefit under the plan, refused: the appeal and what follows." },
  { name: "Grievances and contract deadlines", line: "Discipline and discharge. Pay, overtime, and hours. Seniority, layoff, and promotion. Harassment and discrimination. Safety and working conditions." },
  { name: "Unemployment, Illinois", line: "Lost your job: from the day it ends to a claim that is paid." },
  { name: "Unemployment, Indiana", line: "The Indiana claim, its clocks, and the appeal if they say no." },
  { name: "Get your medical records", line: "Your chart, pulled from your patient portal into your case." },
  { name: "Get your pay and personnel file", line: "The records letter to your employer, sent certified." },
  { name: "Get your plan documents", line: "The Summary Plan Description and your claim file, requested in writing." },
  { name: "Add the paper you already have", line: "Photograph it; we file it where it belongs." },
  { name: "Certified mail with proof of delivery", line: "Proof of delivery, and proof of what was in the envelope." },
  { name: "Make your will", line: "Drafted, witnessed, and notarized." },
  { name: "Set up a power of attorney", line: "For property, with the signing steps laid out." },
  { name: "Prepare for the lawyer", line: "When the answer is a lawyer, you leave prepared." },
] as const;

export const STATES = [
  { name: "Illinois", days: 45, rule: "Tell your employer, in writing", cite: "820 ILCS 305/6(c)", note: "Notice within 45 days. Every clock verified." },
  { name: "Indiana", days: 30, rule: "Tell your employer, in writing", cite: "IC 22-3-3-1", note: "Notice within 30 days. Every clock verified." },
] as const;
