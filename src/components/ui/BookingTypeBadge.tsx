import { ExternalLink, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import type { BookingType } from "@/types/entities";

const CONFIG: Record<BookingType, { label: string; className: string; icon: LucideIcon }> = {
  THROUGH_SENIORG: { label: "Book through SeniorG", className: "bg-brand text-white", icon: ShieldCheck },
  PARTNER: { label: "Partner", className: "bg-white text-ink border border-ink/15", icon: ExternalLink },
  ASSOCIATION: { label: "Association", className: "bg-accent text-ink", icon: Users },
};

export function BookingTypeBadge({ type }: { type: BookingType }) {
  const { label, className, icon: Icon } = CONFIG[type];
  return (
    <span className={["inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-tag font-semibold shadow-soft", className].join(" ")}>
      <Icon size={14} />
      {label}
    </span>
  );
}
