import { useState } from "react";
import { useMatch } from "react-router-dom";
import { FlaskConical, RotateCcw, Play, Image as ImageIcon, ChevronDown } from "lucide-react";
import { Sheet } from "./ui/Sheet";
import { ConfirmButton } from "./ui/ConfirmButton";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { demoControlsFor } from "@/lib/demoControls";
import { IMAGE_CREDITS } from "@/data/imageCredits";
import type { DemoEventType } from "@/store/types";

const DEMO_EVENTS: { id: DemoEventType; label: string }[] = [
  { id: "PROVIDER_ARRIVES", label: "Provider sets out" },
  { id: "PROVIDER_STARTS_WORK", label: "Provider starts work" },
  { id: "PROVIDER_ADDS_WORK", label: "Provider adds work" },
  { id: "PROVIDER_CANCELS", label: "Provider cancels" },
  { id: "PROVIDER_UNAVAILABLE", label: "No provider available" },
  { id: "COMPANION_ARRIVES", label: "Companion picks up" },
  { id: "PAYMENT_SUCCEEDS", label: "Payment succeeds" },
  { id: "PAYMENT_FAILS", label: "Payment fails" },
  { id: "HOUSE_HELP_ISSUE", label: "House-help issue today" },
  { id: "BACKUP_ASSIGNED", label: "Backup helper assigned" },
];

// Reviewer tooling — visibly not part of SeniorG. It stands in for providers,
// companions and the passage of time, and credits the photography.
export function PrototypeLens() {
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const match = useMatch("/requests/:requestId");
  const [targetRequestId, setTargetRequestId] = useState<string>("");
  const [credits, setCredits] = useState(false);
  const open = state.ui.prototypeLensOpen;
  const here = match?.params.requestId ? state.requests[match.params.requestId] : undefined;
  const controls = here && person ? demoControlsFor(here, person.id) : [];
  const activeRequests = Object.values(state.requests).filter((r) => r.status !== "CLOSED" && r.status !== "CANCELLED");

  return (
    <Sheet open={open} onClose={() => dispatch({ type: "TOGGLE_PROTOTYPE_LENS", open: false })} title="Prototype lens" subtitle="Reviewer tooling — not part of the member experience.">
      <div className="space-y-5">
        {here && (
          <section className="rounded-tile border-2 border-dashed border-ink/15 p-4">
            <p className="flex items-center gap-2 font-mono text-tag font-semibold uppercase tracking-wider text-ink-3">
              <FlaskConical size={14} /> This request · {here.id}
            </p>
            {controls.length === 0 ? (
              <p className="mt-2 text-body-sm text-ink-2">Nothing to simulate at this stage — the next step belongs to the member or the desk.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {controls.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => c.actions.forEach((a) => dispatch(a))}
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-tile border border-line bg-card px-4 text-left text-body-sm font-semibold text-ink hover:bg-sand"
                  >
                    <Play size={14} /> {c.kind === "variation" ? `Variation: ${c.label}` : c.label}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="rounded-tile border border-line p-4">
          <p className="font-semibold text-ink">Any request</p>
          {activeRequests.length === 0 ? (
            <p className="mt-1 text-body-sm text-ink-2">Start a journey first; these controls act on requests in progress.</p>
          ) : (
            <>
              <label className="mt-3 block text-meta font-semibold text-ink-2" htmlFor="lens-target">
                Target request
              </label>
              <select id="lens-target" className="mt-1 min-h-[48px] w-full rounded-tile border border-line bg-card px-3 text-body-sm" value={targetRequestId} onChange={(e) => setTargetRequestId(e.target.value)}>
                <option value="">Choose a request…</option>
                {activeRequests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} · {r.title}
                  </option>
                ))}
              </select>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {DEMO_EVENTS.map((evt) => (
                  <button
                    key={evt.id}
                    disabled={!targetRequestId}
                    onClick={() => dispatch({ type: "TRIGGER_DEMO_EVENT", eventType: evt.id, requestId: targetRequestId, actorId: "P-ADMIN" })}
                    className="min-h-[44px] rounded-tile border border-line px-3 text-left text-meta font-semibold text-ink hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {evt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="flex items-center justify-between rounded-tile border border-line p-4">
          <div>
            <p className="font-semibold text-ink">Scope tags</p>
            <p className="text-meta text-ink-2">Show CORE / SHOWCASE / FUTURE</p>
          </div>
          <button
            role="switch"
            aria-checked={state.ui.showScopeTags}
            aria-label="Show scope tags"
            onClick={() => dispatch({ type: "TOGGLE_SCOPE_TAGS" })}
            className={["relative h-8 w-14 rounded-pill transition-colors", state.ui.showScopeTags ? "bg-brand" : "bg-ink/20"].join(" ")}
          >
            <span className={["absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform", state.ui.showScopeTags ? "translate-x-7" : "translate-x-1"].join(" ")} />
          </button>
        </div>

        <section className="rounded-tile border border-line">
          <button onClick={() => setCredits((c) => !c)} aria-expanded={credits} className="flex min-h-[52px] w-full items-center justify-between px-4 text-left font-semibold text-ink">
            <span className="flex items-center gap-2">
              <ImageIcon size={18} className="text-ink-3" /> Photo credits ({IMAGE_CREDITS.length})
            </span>
            <ChevronDown size={18} className={credits ? "rotate-180 transition" : "transition"} />
          </button>
          {credits && (
            <ul className="max-h-64 space-y-2 overflow-y-auto px-4 pb-4 text-meta text-ink-2">
              <li>Openly licensed photographs from Wikimedia Commons, bundled with the prototype.</li>
              {IMAGE_CREDITS.map((c) => (
                <li key={c.slot}>
                  <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline">
                    {c.title.replace(/\.[a-z]+$/i, "")}
                  </a>{" "}
                  — {c.author} · {c.license}
                </li>
              ))}
            </ul>
          )}
        </section>

        <ConfirmButton
          onConfirm={() => dispatch({ type: "RESET_DEMO" })}
          confirmLabel="Click again to confirm reset"
          className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-pill border border-critical/40 bg-card font-semibold text-critical hover:bg-critical-tint"
        >
          <RotateCcw size={18} /> Reset demo
        </ConfirmButton>
      </div>
    </Sheet>
  );
}
