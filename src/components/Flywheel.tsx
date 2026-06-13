import { Ink } from "../lib/motion";

/*
 * Fig. 1 — The Outcome Flywheel. Always turning.
 * The old 3D physics hero, reborn as a hairline line-engraving: same meaning
 * (a value engine that never stops), ~700KB lighter, perfect on phones.
 */

const SPOKES = 6;
const TICKS = 24;

export function FlywheelCut() {
  return (
    <Ink as="figure" fx="wash" delay={350} className="fly-cut">
      <div className="fly-cut__frame">
        <svg className="fly" viewBox="0 0 260 260" role="img" aria-label="Engraving of a flywheel, perpetually turning">
          {/* static bed: tick ring + register marks */}
          <g className="fly__bed" stroke="currentColor" fill="none">
            <circle cx="130" cy="130" r="124" strokeWidth="0.5" strokeDasharray="1 5" opacity="0.6" />
            {Array.from({ length: TICKS }).map((_, i) => {
              const a = (i * 2 * Math.PI) / TICKS;
              const x1 = 130 + Math.cos(a) * 114;
              const y1 = 130 + Math.sin(a) * 114;
              const x2 = 130 + Math.cos(a) * (i % 6 === 0 ? 106 : 110);
              const y2 = 130 + Math.sin(a) * (i % 6 === 0 ? 106 : 110);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 6 === 0 ? 1 : 0.5} />;
            })}
          </g>
          {/* the rotor */}
          <g className="fly__rotor" stroke="currentColor" fill="none">
            <circle cx="130" cy="130" r="100" strokeWidth="1.7" />
            <circle cx="130" cy="130" r="94" strokeWidth="0.6" />
            <circle cx="130" cy="130" r="78" strokeWidth="0.9" />
            <circle cx="130" cy="130" r="73" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.8" />
            {Array.from({ length: SPOKES }).map((_, i) => {
              const a = (i * 2 * Math.PI) / SPOKES;
              const c = Math.cos(a);
              const s = Math.sin(a);
              // each spoke is a doubled hairline, engraving-style
              const off = 2.6;
              const px = -s * off;
              const py = c * off;
              return (
                <g key={i}>
                  <line x1={130 + c * 17 + px} y1={130 + s * 17 + py} x2={130 + c * 76 + px} y2={130 + s * 76 + py} strokeWidth="0.9" />
                  <line x1={130 + c * 17 - px} y1={130 + s * 17 - py} x2={130 + c * 76 - px} y2={130 + s * 76 - py} strokeWidth="0.9" />
                </g>
              );
            })}
            {/* hub */}
            <circle cx="130" cy="130" r="15" strokeWidth="1.4" />
            <circle cx="130" cy="130" r="10.5" strokeWidth="0.6" />
            <circle cx="130" cy="130" r="3.2" strokeWidth="1.1" />
            {/* counterweight notch — gives the turn a visible beat */}
            <circle cx="130" cy="44" r="4.6" strokeWidth="1.1" />
          </g>
        </svg>
      </div>
      <figcaption className="fly-cut__cutline mono">
        FIG. 1 — THE OUTCOME FLYWHEEL. <em>ALWAYS TURNING.</em>
      </figcaption>
    </Ink>
  );
}
