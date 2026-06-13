import { useEffect, useState } from "react";
import Lenis from "lenis";
import {
  BASE_URL,
  PAGE_TITLES,
  pageFromPath,
  pageToPath,
  trackPageView,
  type NavFn,
  type PageId,
} from "./lib/nav";
import type { ApplyKind } from "./lib/intake";
import { Masthead } from "./components/Masthead";
import { Colophon } from "./components/Colophon";
import { ApplyModal } from "./components/modals";
import { HomePage } from "./pages/Home";
import { UsersPage } from "./pages/Users";
import { ConciergesPage } from "./pages/Concierges";

export default function App() {
  const [page, setPage] = useState<PageId>(() => pageFromPath());
  const [applyModal, setApplyModal] = useState<ApplyKind | null>(null);

  // Weighted smooth scroll — the document scrolls like heavy stock.
  // Fully disabled under prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09 });
    window.__lenis = lenis as unknown as Window["__lenis"];
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const nav: NavFn = (p) => {
    if (p === "waitlist" || p === "maker-apply" || p === "concierge-apply") {
      const kind: ApplyKind = p === "maker-apply" ? "maker" : p === "concierge-apply" ? "concierge" : "waitlist";
      setApplyModal(kind);
      trackPageView(`${BASE_URL}apply/${kind}`, "Apply, The Outcome Company");
      return;
    }
    const path = pageToPath(p);
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    setPage(p);
    toTop();
    trackPageView(path, PAGE_TITLES[p]);
  };

  // Keep the rendered edition in sync with the URL (deep links, back/forward).
  useEffect(() => {
    const applyPath = () => {
      setPage(pageFromPath());
      toTop();
    };
    window.addEventListener("popstate", applyPath);
    return () => window.removeEventListener("popstate", applyPath);
  }, []);

  useEffect(() => {
    document.title = PAGE_TITLES[page] || "The Outcome Company";
  }, [page]);

  const Page =
    page === "users" ? <UsersPage nav={nav} /> :
    page === "concierges" ? <ConciergesPage nav={nav} /> :
    <HomePage />;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Masthead page={page} nav={nav} />
      {/* key on page → the incoming edition draws in fresh */}
      <main key={page} id="main" tabIndex={-1} className="edition">
        {Page}
      </main>
      <Colophon nav={nav} />
      {applyModal && <ApplyModal kind={applyModal} onClose={() => setApplyModal(null)} />}
    </>
  );
}
