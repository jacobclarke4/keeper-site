import { useEffect } from "react";
import Lenis from "lenis";
import { Masthead } from "./components/Masthead";
import { Colophon } from "./components/Colophon";
import { HomePage } from "./pages/Home";

export default function App() {
  // Weighted smooth scroll — the document scrolls like heavy stock.
  // Fully disabled under prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12 });
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

  useEffect(() => {
    document.title = "The Outcome Company";
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Masthead />
      <main id="main" tabIndex={-1} className="edition">
        <HomePage />
      </main>
      <Colophon />
    </>
  );
}
