import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: { label: string; to?: string; onClick?: () => void };
  icon?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, icon, className = "" }: SectionHeaderProps) {
  return (
    <div className={["mb-4 flex items-end justify-between gap-3", className].join(" ")}>
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 font-serif text-section text-ink">
          {icon}
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-body-sm text-ink-2">{subtitle}</p>}
      </div>
      {action &&
        (action.to ? (
          <Link
            to={action.to}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-0.5 text-body-sm font-semibold text-brand-dark hover:underline"
          >
            {action.label} <ChevronRight size={18} />
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-0.5 text-body-sm font-semibold text-brand-dark hover:underline"
          >
            {action.label} <ChevronRight size={18} />
          </button>
        ))}
    </div>
  );
}
