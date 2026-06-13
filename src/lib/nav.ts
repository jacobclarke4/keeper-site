// Edition metadata — every page is an "edition" of the broadsheet.
// The router gives each page a real URL path under the Vite base; deep links
// and refreshes work because the deploy ships a 404.html copy of index.html.

export const BASE_URL = import.meta.env.BASE_URL;

export const PAGES = [
  { id: "home", label: "Home" },
  { id: "users", label: "Membership" },
  { id: "concierges", label: "Concierges" },
] as const;

export type PageId = (typeof PAGES)[number]["id"];

// "waitlist" / "*-apply" are NOT routed pages — they open the intake-slip modal
// in place. The nav function accepts them so every CTA just works.
export type NavTarget = PageId | "waitlist" | "maker-apply" | "concierge-apply";
export type NavFn = (p: NavTarget) => void;

export const PAGE_TITLES: Record<PageId, string> = {
  home: "The Outcome Company",
  users: "Membership, The Outcome Company",
  concierges: "Concierges, The Outcome Company",
};

// Running-head label + folio numeral per edition, and the Garamond subtitle
// shown in the mobile CONTENTS index.
export const EDITIONS: Record<PageId, { head: string; folio: string; subtitle: string }> = {
  home: { head: "THE FRONT PAGE", folio: "01", subtitle: "the front page" },
  users: { head: "MEMBERSHIP", folio: "02", subtitle: "get it done" },
  concierges: { head: "FOR CONCIERGES", folio: "03", subtitle: "the human desk" },
};

export const pageToPath = (p: PageId): string => (p === "home" ? BASE_URL : `${BASE_URL}${p}`);

export const pageFromPath = (): PageId => {
  if (typeof window === "undefined") return "home";
  let path = window.location.pathname;
  if (path.startsWith(BASE_URL)) path = path.slice(BASE_URL.length);
  path = path.replace(/^\/+|\/+$/g, "");
  return path && path in PAGE_TITLES ? (path as PageId) : "home";
};

declare global {
  interface Window {
    __lenis?: { scrollTo: (t: HTMLElement | number, o?: Record<string, unknown>) => void; stop: () => void; start: () => void };
  }
}

/** Smooth-scroll to an in-page section by id — routed through Lenis when active. */
export const scrollToId = (id: string) => {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -84 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Fire a Google Analytics virtual page_view for SPA navigations. */
export function trackPageView(path: string, title: string) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", "page_view", { page_path: path, page_title: title });
}

const MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
const DAYS = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

/** Today, typeset like a dateline: "WEDNESDAY, JUNE 11, 2026". */
export function datelineToday(): string {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Short record date: "JUNE 11, 2026". */
export function recordDate(): string {
  const d = new Date();
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
