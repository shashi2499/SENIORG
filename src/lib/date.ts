import { DEMO_TODAY } from "@/data/seed";

export function demoToday(): Date {
  return new Date(DEMO_TODAY);
}

export function daysUntil(isoDate: string): number {
  const target = new Date(isoDate).getTime();
  const today = demoToday().getTime();
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export function formatLongDate(isoDate: string): string {
  return new Date(isDateOnly(isoDate) ? isoDate + "T00:00:00" : isoDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// "2026-11-30" is a calendar date, not an instant: never show a clock time for it.
export function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatShortDateTime(iso: string): string {
  if (isDateOnly(iso)) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface DateOption {
  iso: string; // YYYY-MM-DD
  label: string; // "Today", "Tomorrow", or "Thu, 8 Oct"
}

// Next N selectable days for a booking wizard's date step, anchored to the
// fixed demo date rather than the real device clock.
export function upcomingDateOptions(count = 5): DateOption[] {
  const options: DateOption[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(demoToday());
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label =
      i === 0
        ? "Today"
        : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    options.push({ iso, label });
  }
  return options;
}
