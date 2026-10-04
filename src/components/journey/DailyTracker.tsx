import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { DayEntry } from "@/types/entities";

// The household rhythm of a multi-day plan: one cell per day.
export function DailyTracker({ days }: { days: DayEntry[] }) {
  const nextIndex = days.findIndex((d) => d.status === "SCHEDULED");
  return (
    <ol className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {days.map((day, i) => {
        const done = day.status === "DONE";
        const isNext = i === nextIndex;
        const d = new Date(day.date + "T00:00:00");
        return (
          <li
            key={day.date}
            className={[
              "flex flex-col items-start gap-1 rounded-tile p-3",
              done ? "bg-success-tint" : isNext ? "bg-brand text-white" : "bg-sand",
            ].join(" ")}
          >
            <span className={["text-tag font-semibold", done ? "text-success" : isNext ? "text-white/80" : "text-ink-3"].join(" ")}>
              Day {i + 1}
            </span>
            <span className={["tabular text-body-sm font-semibold", isNext ? "text-white" : "text-ink"].join(" ")}>
              {d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })}
            </span>
            <span className={["inline-flex items-center gap-1 text-tag", done ? "text-success" : isNext ? "text-white" : "text-ink-3"].join(" ")}>
              {done ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1">
                  <Check size={14} strokeWidth={3} /> Done
                </motion.span>
              ) : isNext ? (
                "Next"
              ) : (
                "Planned"
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
