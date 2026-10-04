import { useState } from "react";
import { FlaskConical, ChevronDown, Play } from "lucide-react";
import type { ServiceRequest } from "@/types/entities";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { demoControlsFor } from "@/lib/demoControls";

// Reviewer tooling, deliberately styled apart from SeniorG: dashed, monospace
// label, collapsed by default. It stands in for providers, companions and time.
export function DemoStrip({ request }: { request: ServiceRequest }) {
  const { dispatch } = useStore();
  const person = useCurrentPerson();
  const [open, setOpen] = useState(false);
  if (!person) return null;
  const controls = demoControlsFor(request, person.id);

  return (
    <section aria-label="Prototype controls" className="rounded-card border-2 border-dashed border-ink/15 bg-surface p-1">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-tile px-4 py-3 text-left hover:bg-sand"
      >
        <span className="flex items-center gap-2">
          <FlaskConical size={18} className="text-ink-3" />
          <span className="font-mono text-tag font-semibold uppercase tracking-wider text-ink-3">Prototype controls</span>
          {controls.length > 0 && <span className="rounded-pill bg-ink/10 px-2 text-tag font-semibold text-ink-2">{controls.length}</span>}
        </span>
        <ChevronDown size={18} className={["text-ink-3 transition", open ? "rotate-180" : ""].join(" ")} />
      </button>
      {open && (
        <div className="space-y-2 px-4 pb-4">
          <p className="text-meta text-ink-3">For reviewers only. These stand in for the provider and the passage of time — not part of SeniorG.</p>
          {controls.length === 0 ? (
            <p className="text-body-sm text-ink-2">Nothing to simulate at this stage. The next step is the member's or the desk's.</p>
          ) : (
            controls.map((c) => (
              <button
                key={c.label}
                onClick={() => c.actions.forEach((a) => dispatch(a))}
                className={[
                  "flex min-h-[48px] w-full items-center gap-3 rounded-tile border px-4 py-2.5 text-left text-body-sm font-semibold",
                  c.kind === "next" ? "border-ink/20 bg-card text-ink hover:bg-sand" : "border-dashed border-ink/20 text-ink-2 hover:bg-sand",
                ].join(" ")}
              >
                <Play size={14} className="shrink-0" />
                {c.kind === "variation" ? `Variation: ${c.label}` : c.label}
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}
