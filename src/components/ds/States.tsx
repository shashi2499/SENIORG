import React from "react";
import { Lock, Sprout, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface StateProps {
  icon?: LucideIcon;
  title: string;
  body?: React.ReactNode;
  action?: { label: string; onClick: () => void; variant?: "primary" | "secondary" };
  children?: React.ReactNode;
  className?: string;
}

// Empty: nothing here yet. Icon + plain message + one way forward.
export function EmptyState({ icon: Icon = Sprout, title, body, action, children, className = "" }: StateProps) {
  return (
    <div className={["surface-secondary flex flex-col items-center px-6 py-10 text-center", className].join(" ")}>
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-card text-brand-dark shadow-soft">
        <Icon size={26} />
      </span>
      <p className="font-serif text-section text-ink">{title}</p>
      {body && <p className="mt-2 max-w-sm text-body-sm text-ink-2">{body}</p>}
      {action && (
        <Button variant={action.variant ?? "secondary"} size="md" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}

// Locked: someone chose not to share this. No titles, counts or hints.
export function LockedState({ title, body, action, className = "" }: StateProps) {
  return (
    <div className={["flex items-start gap-4 rounded-card border border-dashed border-line bg-surface p-5", className].join(" ")}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-ink-2">
        <Lock size={20} />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-ink">{title}</p>
        {body && <p className="mt-1 text-body-sm text-ink-2">{body}</p>}
        {action && (
          <Button variant="secondary" size="sm" className="mt-3" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

// Planned: part of SeniorG's design, not yet live. Honest, not broken.
export function PlannedState({ icon: Icon = Sprout, title, body, children, className = "" }: StateProps) {
  return (
    <div className={["surface-secondary p-6 sm:p-8", className].join(" ")}>
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-card px-3 py-1 text-tag font-semibold text-brand-dark shadow-soft">
        <Icon size={14} /> Coming to SeniorG
      </span>
      <p className="mt-4 font-serif text-title text-ink">{title}</p>
      {body && <p className="mt-2 max-w-reading text-body text-ink-2">{body}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

export function DemoTag({ children = "Demo" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-pill border border-ink/15 px-2 py-0.5 text-tag font-semibold text-ink-3">
      {children}
    </span>
  );
}
