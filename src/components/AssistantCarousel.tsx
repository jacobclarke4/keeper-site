import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../lib/motion";

/* ──────────────────────────────────────────────────────────
   The assistants: one for every language Keeper speaks. Portraits from
   the assistant headshots, each on its own analogous gradient, in a
   carousel that turns on its own. The strip beneath shows the whole
   roster, with the one on stage ringed in red.
   ────────────────────────────────────────────────────────── */

const BASE_URL = import.meta.env.BASE_URL;

type Assistant = { id: string; name: string; language: string; hello: string; colors: [string, string] };

const ASSISTANTS: Assistant[] = [
  { id: "nora", name: "Nora", language: "English", hello: "Tell me what happened.", colors: ["#f59e0b", "#ef4444"] },
  { id: "sofia", name: "Sofía", language: "Spanish", hello: "Cuéntame qué pasó.", colors: ["#f97316", "#e11d48"] },
  { id: "lin", name: "Lin", language: "Chinese", hello: "告诉我发生了什么。", colors: ["#ec4899", "#8b5cf6"] },
  { id: "carmen", name: "Carmen", language: "Tagalog", hello: "Sabihin mo kung ano ang nangyari.", colors: ["#10b981", "#22d3ee"] },
  { id: "mai", name: "Mai", language: "Vietnamese", hello: "Hãy kể cho tôi chuyện gì đã xảy ra.", colors: ["#0ea5e9", "#6366f1"] },
  { id: "layla", name: "Layla", language: "Arabic", hello: "أخبرني بما حدث.", colors: ["#a855f7", "#3b82f6"] },
  { id: "hanna", name: "Hanna", language: "Polish", hello: "Opowiedz mi, co się stało.", colors: ["#22c55e", "#a3e635"] },
  { id: "anna", name: "Anna", language: "Russian", hello: "Расскажите, что случилось.", colors: ["#ef4444", "#f59e0b"] },
  { id: "jiwoo", name: "Jiwoo", language: "Korean", hello: "무슨 일이 있었는지 말해 주세요.", colors: ["#6366f1", "#ec4899"] },
  { id: "hana", name: "Hana", language: "Japanese", hello: "何があったか教えてください。", colors: ["#ff3d8f", "#ffb020"] },
  { id: "camille", name: "Camille", language: "French", hello: "Racontez-moi ce qui s'est passé.", colors: ["#3b82f6", "#a855f7"] },
];

const HOLD = 2600;

function Face({ a, size }: { a: Assistant; size: number }) {
  const [c1, c2] = a.colors;
  return (
    <span className="pw" style={{ width: size, height: size, ["--pal-a" as string]: c1, ["--pal-grad" as string]: `linear-gradient(165deg, ${c1}, ${c2} 62%, ${c1})` }}>
      <img src={`${BASE_URL}portraits/${a.id}.webp`} alt="" width={size} height={size} draggable={false} loading="lazy" />
    </span>
  );
}

export function AssistantCarousel() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % ASSISTANTS.length), HOLD);
    return () => window.clearInterval(t);
  }, [reduced]);
  const a = ASSISTANTS[i];
  return (
    <div className="roster" aria-label={`Keeper's assistants, one for each of ${ASSISTANTS.length} languages`}>
      <div className="roster__stage">
        {ASSISTANTS.map((x, n) => (
          <div key={x.id} className={`roster__slide${n === i ? " is-on" : ""}`} aria-hidden={n !== i}>
            <Face a={x} size={128} />
            <div className="roster__who">
              <span className="roster__name">{x.name}</span>
              <span className="roster__lang">{x.language}</span>
            </div>
            <p className="roster__hello">{x.hello}</p>
          </div>
        ))}
      </div>
      <ol className="roster__strip" aria-hidden="true">
        {ASSISTANTS.map((x, n) => (
          <li key={x.id} className={`roster__dot${n === i ? " is-on" : ""}`} onClick={() => setI(n)}>
            <Face a={x} size={36} />
          </li>
        ))}
      </ol>
      <p className="roster__count">{ASSISTANTS.length} languages. {a.language} today.</p>
    </div>
  );
}
