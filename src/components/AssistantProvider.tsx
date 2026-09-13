import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ASSISTANTS, AssistantContext } from "../lib/assistant";
import { usePrefersReducedMotion } from "../lib/motion";

const HOLD = 2800;

export function AssistantProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(false);
  useEffect(() => {
    if (reduced || chosen) return;
    const t = window.setInterval(() => setIndex((n) => (n + 1) % ASSISTANTS.length), HOLD);
    return () => window.clearInterval(t);
  }, [reduced, chosen]);
  const value = useMemo(
    () => ({
      current: ASSISTANTS[index],
      index,
      chosen,
      choose: (id: string) => {
        const n = ASSISTANTS.findIndex((a) => a.id === id);
        if (n >= 0) { setIndex(n); setChosen(true); }
      },
    }),
    [index, chosen]
  );
  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}
