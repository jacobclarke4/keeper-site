import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { APPLY_FORMS, postIntake, type ApplyKind } from "../lib/intake";
import { recordDate, type NavFn } from "../lib/nav";
import { LINKS, goExternal } from "../lib/links";
import { Arrow, Btn, Cap, Stamp } from "./primitives";

const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';

/* ──────────────────────────────────────────────────────────
   Modal shell — overlay, escape, scroll-lock, focus management.
   Moves focus in on open, traps Tab, restores focus on close.
   ────────────────────────────────────────────────────────── */

function ModalShell({
  onClose,
  children,
  className = "",
  labelledBy,
}: {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const restoreTo = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    // Move focus into the dialog (first field, else the card itself).
    const card = cardRef.current;
    const first = card?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? card)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !card) return;
      // trap focus within the card
      const items = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.__lenis?.start();
      restoreTo?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal" onClick={onClose}>
      <div
        ref={cardRef}
        className={`slip ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <button className="slip__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Coming Soon notice (Blueprints).
   ────────────────────────────────────────────────────────── */

export function ComingSoonModal({ onClose, nav }: { onClose: () => void; nav: NavFn }) {
  return (
    <ModalShell onClose={onClose} className="slip--notice" labelledBy="slip-title">
      <span className="slip__head mono">NOTICE · IN THE WORKS</span>
      <h3 className="display slip__h" id="slip-title">
        Coming <em>Soon</em>.
      </h3>
      <p className="slip__intro">
        Blueprints are still being finalized. Join the waitlist and we'll let you know when they drop.
      </p>
      <div className="slip__ctas">
        <Btn
          variant="accent"
          onClick={() => {
            onClose();
            nav("waitlist");
          }}
        >
          Join Waitlist
        </Btn>
        <Btn variant="ghost" onClick={onClose}>
          Close
        </Btn>
      </div>
    </ModalShell>
  );
}

/* ──────────────────────────────────────────────────────────
   Apply modal — one intake slip, three role-specific forms
   (waitlist · maker · concierge). Never leaves the page.
   ────────────────────────────────────────────────────────── */

export function ApplyModal({ kind, onClose }: { kind: ApplyKind; onClose: () => void }) {
  const cfg = APPLY_FORMS[kind];
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<string | null>(null);
  const [attended, setAttended] = useState(false);

  const fail = (field: string, msg: string) => {
    setInvalid(field);
    setError(msg);
    // land the screen reader + keyboard user on the offending field
    requestAnimationFrame(() => document.getElementById(`apply-${field}`)?.focus());
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!firstName.trim()) return fail("firstName", "Please fill in your first name.");
    if (!lastName.trim()) return fail("lastName", "Please fill in your last name.");
    if (!email.trim()) return fail("email", "Please fill in your email.");
    const missing = cfg.fields.find((f) => !f.optional && !(extra[f.name] ?? "").trim());
    if (missing) return fail(missing.name, `Please fill in "${missing.label}".`);
    setStatus("submitting");
    setError(null);
    setInvalid(null);
    const result = await postIntake({
      formType: cfg.formType,
      firstName,
      lastName,
      email,
      ...extra,
    });
    if (result.ok) setStatus("success");
    else {
      setStatus("error");
      setError(result.error);
    }
  }

  if (status === "success") {
    return (
      <ModalShell onClose={onClose} className="slip--form" labelledBy="slip-title">
        <div className="slip__success">
          <Stamp tone="ocean" className="slip__stamp" tilt={-4}>
            {cfg.successStamp} · {recordDate()}
          </Stamp>
          <h3 className="display slip__h" id="slip-title">{cfg.successHeading}</h3>
          <p className="slip__intro">{cfg.successBody}</p>
          <div className="slip__ctas">
            <Btn
              variant="accent"
              onClick={() => {
                onClose();
                goExternal(LINKS.commonwealth)();
              }}
            >
              Read the Charter
            </Btn>
            <Btn variant="ghost" onClick={onClose}>
              Close
            </Btn>
          </div>
        </div>
      </ModalShell>
    );
  }

  const errId = "apply-error";

  return (
    <ModalShell onClose={onClose} className={`slip--form${attended ? " is-attended" : ""}`} labelledBy="slip-title">
      <span className="slip__head mono">
        {cfg.slipTitle}
        <span className="slip__no">Nº ____</span>
      </span>
      <h3 className="display slip__h" id="slip-title">{cfg.heading}</h3>
      <p className="slip__intro">{cfg.intro}</p>

      <form onSubmit={submit} className="sheet-form" noValidate onFocusCapture={() => setAttended(true)}>
        <div className="sheet-form__row">
          <label className="sheet-form__field">
            <Cap required>FIRST NAME</Cap>
            <input id="apply-firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required aria-required="true" aria-invalid={invalid === "firstName" || undefined} aria-describedby={invalid === "firstName" ? errId : undefined} />
          </label>
          <label className="sheet-form__field">
            <Cap required>LAST NAME</Cap>
            <input id="apply-lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required aria-required="true" aria-invalid={invalid === "lastName" || undefined} aria-describedby={invalid === "lastName" ? errId : undefined} />
          </label>
        </div>
        <label className="sheet-form__field">
          <Cap required>EMAIL</Cap>
          <input id="apply-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required aria-required="true" aria-invalid={invalid === "email" || undefined} aria-describedby={invalid === "email" ? errId : undefined} />
        </label>
        {cfg.fields.map((f) => {
          const bad = invalid === f.name;
          const common = {
            id: `apply-${f.name}`,
            name: f.name,
            value: extra[f.name] ?? "",
            placeholder: f.placeholder,
            "aria-required": !f.optional || undefined,
            "aria-invalid": bad || undefined,
            "aria-describedby": bad ? errId : undefined,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setExtra((v) => ({ ...v, [f.name]: e.target.value })),
          };
          return (
            <label key={f.name} className="sheet-form__field">
              <Cap required={!f.optional} optional={f.optional}>{f.label}</Cap>
              {f.textarea ? <textarea rows={3} {...common} /> : <input {...common} />}
            </label>
          );
        })}

        {error && (
          <div id={errId} className="sheet-form__error mono" role="alert">
            {error}
          </div>
        )}

        <Btn variant="accent" size="lg" type="submit" disabled={status === "submitting"} className="sheet-form__submit">
          {status === "submitting" ? "Filing…" : cfg.submitLabel} <Arrow />
        </Btn>

        <p className="sheet-form__disclaimer mono">{cfg.disclaimer}</p>
      </form>
    </ModalShell>
  );
}
