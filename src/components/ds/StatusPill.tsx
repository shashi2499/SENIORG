import {
  AlertCircle,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Headset,
  Hourglass,
  Navigation,
  type LucideIcon,
} from "lucide-react";
import { TONE_STYLE, type Tone } from "@/lib/presentation";

const ICON: Record<Tone, LucideIcon> = {
  needs: AlertCircle,
  handling: Headset,
  active: Navigation,
  scheduled: CalendarCheck,
  waiting: Hourglass,
  done: CheckCircle2,
  closed: CheckCircle2,
  problem: AlertTriangle,
};

// Status is always an icon AND words — never colour alone.
export function StatusPill({ tone, label, size = "md" }: { tone: Tone; label: string; size?: "sm" | "md" }) {
  const Icon = ICON[tone];
  return (
    <span
      className={[
        "inline-flex max-w-full items-center gap-1.5 rounded-pill font-semibold",
        size === "sm" ? "px-2.5 py-0.5 text-tag" : "px-3 py-1 text-body-sm",
        TONE_STYLE[tone].pill,
      ].join(" ")}
    >
      <Icon size={size === "sm" ? 14 : 16} className="shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function ToneIcon({ tone, size = 20, className = "" }: { tone: Tone; size?: number; className?: string }) {
  const Icon = ICON[tone];
  return <Icon size={size} className={[TONE_STYLE[tone].text, className].join(" ")} aria-hidden="true" />;
}
