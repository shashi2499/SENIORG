import { motion } from "framer-motion";
import { Check, ShieldCheck, Star } from "lucide-react";
import type { Provider } from "@/types/entities";

interface ProviderCardProps {
  provider: Provider;
  platformName?: string;
  whyMatched?: string;
  selected: boolean;
  onSelect: () => void;
}

// The "three-name card" the design brief calls for: SeniorG (platform),
// the delivering business, and the visiting professional — each with a
// one-line responsibility. Reused by every booking journey.
export function ProviderCard({
  provider,
  platformName = "SeniorG",
  whyMatched,
  selected,
  onSelect,
}: ProviderCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      className={[
        "w-full rounded-card border p-4 text-left transition-colors",
        selected ? "border-brand bg-brand-tint shadow-soft" : "border-line bg-card hover:border-brand/40",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
            {provider.avatarInitials}
          </span>
          <div>
            <p className="font-semibold text-ink">{provider.name}</p>
            <p className="text-meta text-ink-2">{provider.business}</p>
          </div>
        </div>
        {selected ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white"
          >
            <Check size={14} />
          </motion.span>
        ) : (
          <span className="shrink-0 text-meta font-semibold text-brand">Select</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-meta text-ink-2">
        <span className="flex items-center gap-1 font-semibold text-ink">
          <Star size={14} className="fill-accent text-accent" /> {provider.rating}
        </span>
        <span>{provider.jobsWithMembers} jobs with members</span>
        {provider.idChecked && (
          <span className="flex items-center gap-1 text-success">
            <ShieldCheck size={14} /> ID checked
          </span>
        )}
      </div>

      <p className="mt-2 text-meta text-ink-2">
        {platformName} coordinates and owns this job · {provider.business} sends and invoices ·{" "}
        {provider.name.split(" ")[0]} visits
      </p>

      {whyMatched && <p className="mt-1 text-meta font-medium text-brand-dark">Why matched: {whyMatched}</p>}
    </motion.button>
  );
}
