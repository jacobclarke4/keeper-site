// Absolute URLs to the other Commonwealth sites. Each publication is its own
// repo/deploy, so cross-site navigation is a real hyperlink, not an in-app route.
// PLACEHOLDERS until domains are registered — swap these in one place.
export const LINKS = {
  commonwealth: "https://mycommonwealth.co/",
  maker: "https://maker.theoutcome.ai/", // TBD
  learning: "https://learning.theoutcome.ai/", // TBD
  audit: "https://audit.theoutcome.ai/", // TBD
  // Every "Get started" button points here: account creation → payment →
  // the Commonwealth welcome flow (built separately). PLACEHOLDER — swap in
  // the real flow URL in this one place.
  getStarted: "https://app.theoutcome.ai/get-started", // TBD
  // The "Log in" button → the app's login slug. Not wired to a live app yet —
  // swap the host when the app exists.
  login: "https://app.theoutcome.ai/login", // TBD
} as const;

/** Navigate the whole window to another Commonwealth site. */
export const goExternal = (url: string) => () => {
  window.location.href = url;
};
