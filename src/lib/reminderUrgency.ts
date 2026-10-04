import type { Reminder, ReminderStatus } from "@/types/entities";
import { daysUntil } from "./date";

export type ReminderTone = "critical" | "warning" | "neutral" | "info" | "success";

export interface ReminderUrgency {
  tone: ReminderTone;
  label: string;
}

// Alarm-style wording for a reminder: the GROUPING a reminder belongs to
// (Needs attention / In progress / Upcoming / Completed) always comes from
// the stored ReminderStatus — this only turns that status, plus the due
// date, into the plain-language label shown next to it.
export function reminderUrgency(reminder: Reminder): ReminderUrgency {
  const days = daysUntil(reminder.dueDate);

  switch (reminder.status) {
    case "DONE":
      return { tone: "success", label: "Completed" };
    case "ASSISTED":
      return { tone: "info", label: "SeniorG desk is helping" };
    case "IN_PROGRESS_SELF":
      return { tone: "info", label: "You're doing this yourself" };
    case "SNOOZED":
      return { tone: "neutral", label: "Snoozed" };
    case "OVERDUE":
      return { tone: "critical", label: days < 0 ? `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}` : "Overdue" };
    case "DUE_SOON":
    case "EXPLAINED":
      if (days <= 0) return { tone: "warning", label: "Due today" };
      return { tone: "warning", label: `Due in ${days} day${days === 1 ? "" : "s"}` };
    case "UPCOMING":
    default:
      if (days < 0) return { tone: "critical", label: `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}` };
      if (days === 0) return { tone: "warning", label: "Due today" };
      return { tone: "neutral", label: `Due in ${days} day${days === 1 ? "" : "s"}` };
  }
}

export type ReminderSection = "attention" | "inProgress" | "upcoming" | "completed";

const ATTENTION_STATUSES = new Set<ReminderStatus>(["OVERDUE", "DUE_SOON", "EXPLAINED"]);
const IN_PROGRESS_STATUSES = new Set<ReminderStatus>(["IN_PROGRESS_SELF", "ASSISTED"]);

export function reminderSection(reminder: Reminder): ReminderSection {
  if (reminder.status === "DONE") return "completed";
  if (IN_PROGRESS_STATUSES.has(reminder.status)) return "inProgress";
  if (ATTENTION_STATUSES.has(reminder.status)) return "attention";
  return "upcoming";
}
