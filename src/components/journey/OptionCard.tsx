import { motion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onSelect: () => void;
}

// The single selectable-card primitive every ChoiceGrid is built from —
// symptoms, urgency, dates, time slots all use this same component so a
// selection always looks and feels the same across journeys.
export function OptionCard({ label, description, icon: Icon, selected, onSelect }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={[
        "flex min-h-[64px] w-full flex-col items-start justify-center gap-1 rounded-tile border-2 p-4 text-left transition-colors",
        selected ? "border-brand bg-brand-tint shadow-soft" : "border-line bg-card hover:border-brand/40",
      ].join(" ")}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                selected ? "bg-brand text-white" : "bg-ink/5 text-ink-2",
              ].join(" ")}
            >
              <Icon size={18} />
            </span>
          )}
          <span className={["font-semibold", selected ? "text-brand-dark" : "text-ink"].join(" ")}>{label}</span>
        </div>
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white"
          >
            <Check size={12} />
          </motion.span>
        )}
      </div>
      {description && <p className="text-body-sm text-ink-2">{description}</p>}
    </motion.button>
  );
}
