// Absolute URLs to the other Commonwealth sites. Each publication is its own
// repo/deploy, so cross-site navigation is a real hyperlink, not an in-app route.
// PLACEHOLDERS until domains are registered — swap these in one place.
export const LINKS = {
  commonwealth: "https://commonwealth.theoutcome.ai/", // TBD
  maker: "https://maker.theoutcome.ai/", // TBD
  learning: "https://learning.theoutcome.ai/", // TBD
  audit: "https://audit.theoutcome.ai/", // TBD
} as const;

/** Navigate the whole window to another Commonwealth site. */
export const goExternal = (url: string) => () => {
  window.location.href = url;
};
