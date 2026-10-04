import { AlertTriangle, Clock, CalendarClock, Headset, CheckCircle2, type LucideIcon } from "lucide-react";
import type { Reminder } from "@/types/entities";
import { reminderUrgency, type ReminderTone } from "@/lib/reminderUrgency";

const ICON_BY_TONE: Record<ReminderTone, LucideIcon> = {
  critical: AlertTriangle,
  warning: Clock,
  neutral: CalendarClock,
  info: Headset,
  success: CheckCircle2,
};

const CLASSES_BY_TONE: Record<ReminderTone, string> = {
  critical: "bg-critical-tint text-critical",
  warning: "bg-needs-tint text-needs",
  neutral: "bg-sand text-ink-2",
  info: "bg-handling-tint text-handling",
  success: "bg-success-tint text-success",
};

// Alarm-style, icon + words (never colour alone) status for a reminder —
// the Reminder equivalent of StatusBadge for requests.
export function ReminderStatusBadge({ reminder }: { reminder: Reminder }) {
  const { tone, label } = reminderUrgency(reminder);
  const Icon = ICON_BY_TONE[tone];

  return (
    <span
      className={["inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-tag font-semibold", CLASSES_BY_TONE[tone]].join(" ")}
    >
      <Icon size={14} />
      {label}
    </span>
  );
}
