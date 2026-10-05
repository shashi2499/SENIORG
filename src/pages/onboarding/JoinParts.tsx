import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { PHASES, type Step } from "@/lib/onboarding";

// Shared building blocks for the join flow: phase progress, a step frame with
// one primary action, large choice cards and labelled fields.

export function PhaseProgress({ step }: { step: Step }) {
  const phaseIndex = PHASES.findIndex((p) => p.steps.includes(step));
  return (
    <div>
      <p className="mb-1.5 flex items-baseline justify-between text-meta">
        <span className="font-semibold text-brand-dark">{PHASES[phaseIndex]?.label}</span>
        <span className="text-ink-3">
          Part {phaseIndex + 1} of {PHASES.length}
        </span>
      </p>
      <ol className="grid grid-cols-4 gap-1.5" aria-label="Progress">
        {PHASES.map((p, i) => {
          const within = i === phaseIndex ? (p.steps.indexOf(step) + 1) / p.steps.length : i < phaseIndex ? 1 : 0;
          return (
            <li key={p.label} aria-current={i === phaseIndex ? "step" : undefined}>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full rounded-full bg-brand"
                  initial={false}
                  animate={{ width: `${Math.round(within * 100)}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <span className="sr-only">
                {p.label}
                {i < phaseIndex ? " (done)" : i === phaseIndex ? " (current)" : ""}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function StepFrame({
  eyebrow,
  title,
  subtitle,
  children,
  action,
  note,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <div>
      {eyebrow && <div className="mb-3">{eyebrow}</div>}
      <h1 className="text-balance font-serif text-title text-ink sm:text-[2.25rem] sm:leading-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-body text-ink-2">{subtitle}</p>}
      {children && <div className="mt-7">{children}</div>}
      {action && (
        // One primary action: resting at the bottom of the phone, inline on larger screens.
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <div className="flex flex-col gap-2">{action}</div>
          {note && <p className="mt-2 text-center text-meta text-ink-3 sm:text-left">{note}</p>}
        </div>
      )}
    </div>
  );
}

export function ChoiceCard({
  selected,
  onClick,
  title,
  body,
  icon,
  multi,
  className = "",
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title: React.ReactNode;
  body?: React.ReactNode;
  icon?: React.ReactNode;
  multi?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={[
        "flex min-h-[72px] w-full items-center gap-4 rounded-card border-2 bg-card px-5 py-4 text-left transition duration-calm",
        selected ? "border-brand bg-brand-tint shadow-soft" : "border-card-border hover:border-brand/40 hover:bg-sand/60",
        className,
      ].join(" ")}
    >
      {icon && (
        <span className={["flex h-12 w-12 shrink-0 items-center justify-center rounded-full", selected ? "bg-brand text-white" : "bg-sand text-brand-dark"].join(" ")}>
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-subhead text-ink">{title}</span>
        {body && <span className="mt-0.5 block text-body-sm text-ink-2">{body}</span>}
        {children}
      </span>
      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center border-2",
          multi ? "rounded-md" : "rounded-full",
          selected ? "border-brand bg-brand text-white" : "border-ink/25 bg-card",
        ].join(" ")}
        aria-hidden="true"
      >
        {selected && <Check size={16} strokeWidth={3} />}
      </span>
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string | false;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-body-sm font-semibold text-ink">
        {label}
      </label>
      {hint && <p className="text-meta text-ink-3">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1.5 text-body-sm font-semibold text-critical" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "block min-h-[56px] w-full rounded-tile border-2 border-card-border bg-card px-4 text-body text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none";

export function DemoBadge({ children = "Demo verification" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-dashed border-accent-deep/50 bg-accent-tint px-3 py-1 text-tag font-bold uppercase tracking-wider text-accent-deep">
      {children}
    </span>
  );
}
