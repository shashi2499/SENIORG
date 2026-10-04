import { Link } from "react-router-dom";
import { ChevronRight, Headset } from "lucide-react";
import type { ServiceRequest } from "@/types/entities";
import { Photo } from "@/components/ds/Photo";
import { StatusPill } from "@/components/ds/StatusPill";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { presentRequest, SERVICE_KIND, whenLabel } from "@/lib/presentation";
import { requestImage } from "@/lib/imagery";

// A request as a person would describe it: what, what's happening, when.
export function RequestCard({ request, to, active, onSelect, compact }: { request: ServiceRequest; to?: string; active?: boolean; onSelect?: () => void; compact?: boolean }) {
  const { state } = useStore();
  const person = useCurrentPerson();
  const p = presentRequest(request, state.providers, state.people, person?.id);
  const when = whenLabel(request);
  const member = person?.role === "COORDINATOR" ? state.people[request.createdBy] : undefined;

  const body = (
    <div
      className={[
        ["flex items-center gap-4 rounded-card border bg-card pr-4 shadow-soft transition duration-calm hover:shadow-lift", compact ? "p-4" : "p-3"].join(" "),
        active ? "border-brand ring-2 ring-brand/30" : p.tone === "needs" ? "border-needs-ring" : "border-card-border",
      ].join(" ")}
    >
      {!compact && <Photo slot={requestImage(request)} className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" rounded="rounded-tile" />}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-meta text-ink-3">
          {SERVICE_KIND[request.category]} · <span className="tabular">{request.id}</span>
          {member ? ` · ${member.name.split(" ")[0]}` : ""}
        </p>
        <p className="truncate text-body font-semibold text-ink">{request.title}</p>
        <p className="line-clamp-2 text-body-sm text-ink-2">{p.headline}</p>
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <StatusPill tone={p.tone} label={p.pill} size="sm" />
          {request.owner === "DESK" && person?.role !== "COORDINATOR" && (
            <span className="inline-flex items-center gap-1 text-tag font-semibold text-handling">
              <Headset size={14} /> SeniorG has this
            </span>
          )}
          {when && request.status !== "CLOSED" && <span className="text-tag text-ink-3">{when}</span>}
        </div>
      </div>
      <ChevronRight size={20} className="shrink-0 text-ink-3" />
    </div>
  );

  if (onSelect) {
    return (
      <button onClick={onSelect} className="block w-full min-w-0 text-left" aria-pressed={active}>
        {body}
      </button>
    );
  }
  return (
    <Link to={to ?? `/requests/${request.id}`} className="block min-w-0">
      {body}
    </Link>
  );
}
