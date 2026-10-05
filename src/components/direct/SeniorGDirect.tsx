import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BellRing, ChevronRight, MessageSquare, Phone, PhoneCall, ShieldAlert } from "lucide-react";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { useStore } from "@/store/StoreContext";

// SeniorG Direct: the human connection to SeniorG. Its identity is the BELL —
// always a marigold disc with an ink bell, so it never reads as the ordinary
// notifications control (which uses an inbox, not a bell). Every "talk to /
// call / chat with / get help from SeniorG" entry point uses these pieces.

export const DIRECT_NAME = "SeniorG Direct";
export const DIRECT_TAGLINE = "Connect with SeniorG anytime";

interface MarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  pulse?: boolean; // gentle "a person is there" ripple — for hero moments only
  className?: string;
}

const MARK_SIZES = {
  sm: { box: "h-7 w-7", icon: 15 },
  md: { box: "h-10 w-10", icon: 20 },
  lg: { box: "h-14 w-14", icon: 28 },
  xl: { box: "h-24 w-24", icon: 46 },
} as const;

export function DirectMark({ size = "md", pulse, className = "" }: MarkProps) {
  const reduce = useReducedMotion();
  const s = MARK_SIZES[size];
  return (
    <span className={["relative inline-flex shrink-0 items-center justify-center", s.box, className].join(" ")} aria-hidden="true">
      {pulse && !reduce && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-accent/40"
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-accent/30"
            initial={{ scale: 1, opacity: 0.45 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 1.3 }}
          />
        </>
      )}
      <span className={["relative flex items-center justify-center rounded-full bg-accent text-ink shadow-soft ring-2 ring-white/70", s.box].join(" ")}>
        {/* Always ringing gently: human help is always available (still under reduced motion). */}
        <BellRing size={s.icon} strokeWidth={2} className="sg-bell-ring" />
      </span>
    </span>
  );
}

type Variant = "pill" | "header" | "tile" | "panel" | "sidebar" | "rail";

interface DirectButtonProps {
  variant: Variant;
  label?: string;
  sublabel?: string;
  onClick?: () => void;
  className?: string;
}

// One entry point, several surfaces. By default it opens the in-app
// SeniorG Direct sheet (the existing Help / Assisted Desk sheet).
export function DirectButton({ variant, label, sublabel, onClick, className = "" }: DirectButtonProps) {
  const { dispatch } = useStore();
  const open = onClick ?? (() => dispatch({ type: "TOGGLE_HELP_SHEET", open: true }));

  if (variant === "header") {
    // Top bar: compact on phones ("Help"), named on wider screens.
    return (
      <button
        onClick={open}
        className={["flex h-11 items-center gap-2 rounded-pill bg-brand-tint pl-1.5 pr-4 font-semibold text-brand-dark hover:bg-brand-soft", className].join(" ")}
        aria-label={`${DIRECT_NAME} — talk to SeniorG`}
      >
        <DirectMark size="sm" />
        <span className="text-body-sm">
          <span className="sm:hidden">{label ?? "Help"}</span>
          <span className="hidden sm:inline">{DIRECT_NAME}</span>
        </span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        onClick={open}
        className={["flex h-11 shrink-0 items-center gap-2 rounded-pill bg-brand-tint pl-1.5 pr-4 text-body-sm font-semibold text-brand-dark hover:bg-brand-soft", className].join(" ")}
      >
        <DirectMark size="sm" />
        {label ?? "Need help?"}
      </button>
    );
  }

  if (variant === "tile") {
    return (
      <button
        onClick={open}
        className={["flex aspect-square flex-col rounded-card bg-brand-deep p-3.5 text-left text-white shadow-soft transition hover:shadow-lift", className].join(" ")}
      >
        <DirectMark size="md" />
        <span className="mt-auto font-serif text-subhead leading-tight">{label ?? DIRECT_NAME}</span>
        <span className="mt-1 text-meta text-white/80">{sublabel ?? DIRECT_TAGLINE}</span>
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={open}
        className={["flex min-h-[52px] items-center gap-3 rounded-pill bg-brand-deep pl-2 pr-4 text-left text-white hover:bg-brand-dark", className].join(" ")}
      >
        <DirectMark size="sm" />
        <span className="leading-tight">
          <span className="block text-body-sm font-semibold">{label ?? DIRECT_NAME}</span>
          <span className="block text-tag text-white/75">{DIRECT_TAGLINE}</span>
        </span>
      </button>
    );
  }

  if (variant === "rail") {
    return (
      <section className={["rounded-card bg-brand-deep p-5 text-white", className].join(" ")}>
        <h2 className="flex items-center gap-2.5 text-subhead text-white">
          <DirectMark size="sm" /> {DIRECT_NAME}
        </h2>
        <p className="mt-1 text-body-sm font-semibold text-accent">{DIRECT_TAGLINE}</p>
        <p className="mt-2 text-body-sm text-white/80">{sublabel ?? "Call or chat with a person, request a call-back, or hand over anything you'd rather not do."}</p>
        <p className="mt-1 text-meta text-white/60">Call or chat with a person at SeniorG anytime (demo).</p>
        <button onClick={open} className="mt-4 min-h-[44px] w-full rounded-pill bg-white text-body-sm font-semibold text-brand-deep hover:bg-brand-tint">
          {label ?? "Talk to SeniorG"}
        </button>
      </section>
    );
  }

  // panel: a full-width row inside records and journeys
  return (
    <button
      onClick={open}
      className={["flex w-full items-center gap-3 rounded-card border border-card-border bg-card p-4 text-left shadow-soft hover:bg-sand", className].join(" ")}
    >
      <DirectMark size="md" />
      <span className="flex-1">
        <span className="block font-semibold text-ink">{label ?? "Need help?"}</span>
        <span className="block text-body-sm text-ink-2">{sublabel ?? `${DIRECT_NAME} — ${DIRECT_TAGLINE.toLowerCase()}.`}</span>
      </span>
      <ChevronRight size={20} className="shrink-0 text-ink-3" />
    </button>
  );
}

// For people who aren't members yet (landing, onboarding): call or chat only.
// Everything is simulated — no call is placed and no message is sent.
const PROSPECT_OPTIONS = [
  { id: "call", label: "Call SeniorG", icon: Phone, info: "Demo: a SeniorG coordinator would answer and talk you through joining. No real call is placed in this prototype." },
  { id: "callback", label: "Request a call-back", icon: PhoneCall, info: "Demo: call-back requested. Someone from SeniorG would call you back within 30 minutes, any time of day." },
  { id: "chat", label: "Chat with SeniorG", icon: MessageSquare, info: "Demo: chat is simulated here. A person — not a bot — would reply, any time of day." },
  { id: "safety", label: "Is this call really SeniorG?", icon: ShieldAlert, info: "SeniorG never asks for your password, OTP or UPI PIN. If anyone does, hang up and call someone you trust." },
];

export function DirectProspectSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [info, setInfo] = useState<string | null>(null);
  const close = () => {
    setInfo(null);
    onClose();
  };
  return (
    <Sheet open={open} onClose={close} title={DIRECT_NAME} subtitle={`${DIRECT_TAGLINE} — call or chat with a person.`}>
      <p className="mb-5 flex items-center gap-3 rounded-tile bg-brand-tint px-4 py-3 text-body-sm text-brand-dark">
        <DirectMark size="sm" /> A person is available now · anytime, 24 hours (demo)
      </p>
      {info ? (
        <div className="space-y-4">
          <div className="rounded-card bg-infotint p-4 text-body-sm text-ink">{info}</div>
          <Button variant="secondary" fullWidth onClick={() => setInfo(null)}>
            Back
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {PROSPECT_OPTIONS.map(({ id, label, icon: Icon, info: text }) => (
            <li key={id}>
              <button
                onClick={() => setInfo(text)}
                className="flex min-h-[60px] w-full items-center gap-3 rounded-tile border border-line px-4 py-3 text-left font-semibold text-ink transition hover:bg-sand"
              >
                <Icon size={20} className="text-brand" />
                <span className="flex-1">{label}</span>
                <ChevronRight size={18} className="text-ink-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
