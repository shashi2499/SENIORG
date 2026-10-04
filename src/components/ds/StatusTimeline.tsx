import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import type { ServiceRequest } from "@/types/entities";
import { currentStepIndex, stepTime, timelineFor } from "@/lib/timelines";
import { formatShortDateTime } from "@/lib/date";

interface StatusTimelineProps {
  request: ServiceRequest;
  currentDetail?: React.ReactNode; // what's happening now, shown under the current step
  compact?: boolean; // a single progress line for cards
  onAccent?: boolean; // compact bar sitting on a marigold surface
}

const PROBLEM = new Set(["NO_PROVIDER_FOUND", "REMATCHING", "DISPUTED"]);

// A journey-specific story of the request, not a generic seven-dot stepper.
export function StatusTimeline({ request, currentDetail, compact, onAccent }: StatusTimelineProps) {
  const steps = timelineFor(request);
  const closed = request.status === "CLOSED" || request.status === "RESOLVED";
  const current = closed ? steps.length : currentStepIndex(steps, request.status);
  const problem = PROBLEM.has(request.status);

  if (compact) {
    const pct = Math.round((Math.min(current, steps.length - 1) / (steps.length - 1)) * 100);
    return (
      <div className="flex items-center gap-3" aria-label={`Step ${Math.min(current + 1, steps.length)} of ${steps.length}`}>
        <div className={["h-1.5 flex-1 overflow-hidden rounded-pill", onAccent ? "bg-ink/15" : "bg-white/20"].join(" ")}>
          <motion.div
            className={["h-full rounded-pill", onAccent ? "bg-ink" : "bg-accent"].join(" ")}
            initial={false}
            animate={{ width: `${closed ? 100 : Math.max(pct, 6)}%` }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          />
        </div>
        <span className="tabular shrink-0 text-meta opacity-80">
          {Math.min(current + 1, steps.length)}/{steps.length}
        </span>
      </div>
    );
  }

  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const at = done || active ? stepTime(request, step) : undefined;
        const last = i === steps.length - 1;
        return (
          <li key={step.key} className="relative flex gap-4 pb-1">
            <div className="flex w-7 flex-col items-center">
              <motion.span
                initial={false}
                animate={{ scale: active ? 1 : 0.92 }}
                className={[
                  "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-brand text-white" : active ? (problem ? "bg-accent text-ink" : "bg-brand-deep text-white") : "border-2 border-line bg-card",
                ].join(" ")}
              >
                {done ? <Check size={15} strokeWidth={3} /> : active ? problem ? <AlertTriangle size={14} /> : <span className="h-2.5 w-2.5 rounded-full bg-accent" /> : null}
                {active && !problem && (
                  <motion.span
                    className="absolute inset-0 rounded-full ring-4 ring-brand/20"
                    animate={{ opacity: [0.9, 0.3, 0.9] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.span>
              {!last && <span className={["mt-1 w-0.5 flex-1", done ? "bg-brand" : "bg-line"].join(" ")} style={{ minHeight: 20 }} />}
            </div>
            <div className={["min-w-0 flex-1", last ? "pb-0" : "pb-5"].join(" ")}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={["text-body", active ? "font-semibold text-ink" : done ? "text-ink" : "text-ink-3"].join(" ")}>{step.label}</p>
                {at && <p className="tabular text-meta text-ink-3">{formatShortDateTime(at)}</p>}
              </div>
              {active && currentDetail && <div className="mt-1.5 text-body-sm text-ink-2">{currentDetail}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
