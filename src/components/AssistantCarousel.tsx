import { ASSISTANTS, useAssistant, type Assistant } from "../lib/assistant";

/* ──────────────────────────────────────────────────────────
   The assistants, in a carousel that turns on its own until the reader
   picks one. The pick is shared: the home, the calendar, and the phone
   all switch to that assistant.
   ────────────────────────────────────────────────────────── */

const BASE_URL = import.meta.env.BASE_URL;

export function Face({ a, size }: { a: Assistant; size: number }) {
  const [c1, c2] = a.colors;
  return (
    <span className="pw" style={{ width: size, height: size, ["--pal-a" as string]: c1, ["--pal-grad" as string]: `linear-gradient(165deg, ${c1}, ${c2} 62%, ${c1})` }}>
      <img src={`${BASE_URL}portraits/${a.id}.webp`} alt="" width={size} height={size} draggable={false} loading="lazy" />
    </span>
  );
}

export function AssistantCarousel() {
  const { index, chosen, choose, current } = useAssistant();
  return (
    <div className="roster" aria-label="Keeper's assistants">
      <div className="roster__stage">
        {ASSISTANTS.map((x, n) => (
          <div key={x.id} className={`roster__slide${n === index ? " is-on" : ""}`} aria-hidden={n !== index}>
            <Face a={x} size={128} />
            <span className="roster__name">{x.name}</span>
            <p className="roster__hello">{x.hello}</p>
          </div>
        ))}
      </div>
      <ol className="roster__strip" aria-label="Choose your assistant">
        {ASSISTANTS.map((x, n) => (
          <li key={x.id}>
            <button type="button" className={`roster__dot${n === index ? " is-on" : ""}`} onClick={() => choose(x.id)} aria-pressed={chosen && n === index} aria-label={x.name}>
              <Face a={x} size={40} />
            </button>
          </li>
        ))}
      </ol>
      <p className="roster__count">{chosen ? `${current.name} is your assistant. Look around the page.` : "Pick one, and the whole page follows."}</p>
    </div>
  );
}
