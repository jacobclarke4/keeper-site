import { createContext, useContext } from "react";

/* ──────────────────────────────────────────────────────────
   The assistants on the page, and which one is on stage. Until the
   reader picks one, the roster turns on its own and every example on
   the page follows it; once picked, that assistant stays everywhere.
   ────────────────────────────────────────────────────────── */

export type Assistant = { id: string; name: string; hello: string; colors: [string, string] };

export const ASSISTANTS: Assistant[] = [
  { id: "nora", name: "Nora", hello: "Tell me what happened, and I'll take it from there.", colors: ["#f59e0b", "#ef4444"] },
  { id: "frankie", name: "Frankie", hello: "Start anywhere. I'll ask what I need.", colors: ["#3b82f6", "#a855f7"] },
  { id: "ben", name: "Ben", hello: "Say it plainly. I'll write it properly.", colors: ["#10b981", "#22d3ee"] },
  { id: "charlie", name: "Charlie", hello: "Nothing is due today. What's going on?", colors: ["#ff3d8f", "#ffb020"] },
  { id: "vivian", name: "Vivian", hello: "I keep the dates. You keep going.", colors: ["#22c55e", "#a3e635"] },
];

export type AssistantState = { current: Assistant; index: number; chosen: boolean; choose: (id: string) => void };

export const AssistantContext = createContext<AssistantState>({ current: ASSISTANTS[0], index: 0, chosen: false, choose: () => {} });

export function useAssistant() {
  return useContext(AssistantContext);
}
