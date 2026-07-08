// The Outcome Company is a single page, read top to bottom. Navigation is
// in-page: the masthead links jump to section anchors, every "Get started"
// is a real hyperlink to the sign-up flow.

export const BASE_URL = import.meta.env.BASE_URL;

/** The masthead's primary nav — each jumps to a section id on the page. */
export const NAV_SECTIONS = [
  { id: "how", label: "How it works" },
  { id: "catalog", label: "What we can do" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "Questions" },
] as const;

/** Every real section on the page — the mobile-sheet index + scrollspy
 *  source. Wallet and Commonwealth live inside Questions now. */
export const ALL_SECTIONS = [
  { id: "how", label: "How it works" },
  { id: "catalog", label: "What we can do" },
  { id: "bridge", label: "Who it's for" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "Questions" },
] as const;

/** Stable id list for the scrollspy observer. */
export const SECTION_IDS = ALL_SECTIONS.map((s) => s.id);

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

/** Back to the top of the page (the masthead brand click). */
export const scrollTop = () => {
  if (typeof window === "undefined") return;
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: false });
  else window.scrollTo({ top: 0, behavior: "smooth" });
};

