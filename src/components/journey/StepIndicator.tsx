import { motion } from "framer-motion";

interface StepIndicatorProps {
  current: number; // 0-based
  total: number;
}

// A thin progress bar used under JourneyHeader. Deliberately not a dotted
// stepper (too fiddly at 360px with 8 steps) — a filling bar reads clearly
// at any step count without wrapping.
export function StepIndicator({ current, total }: StepIndicatorProps) {
  const pct = Math.min(100, Math.round(((current + 1) / total) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
      <motion.div
        className="h-full rounded-full bg-brand"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </div>
  );
}
