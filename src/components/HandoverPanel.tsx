import { Headset, Undo2, Check } from "lucide-react";
import { Button } from "./ui/Button";
import { useStore } from "@/store/StoreContext";
import type { Person, ServiceRequest } from "@/types/entities";

const TERMINAL = new Set(["CLOSED", "CANCELLED"]);

// A member (or spouse) may hand over, or take back, only requests they
// created — Suresh cannot silently move Asha's requests to the desk.
export function canHandOver(request: ServiceRequest, person?: Person): boolean {
  return (
    !!person &&
    (person.role === "MEMBER" || person.role === "SPOUSE") &&
    request.createdBy === person.id &&
    request.owner === "SELF" &&
    !TERMINAL.has(request.status)
  );
}

export function canTakeBack(request: ServiceRequest, person?: Person): boolean {
  return (
    !!person &&
    (person.role === "MEMBER" || person.role === "SPOUSE") &&
    request.createdBy === person.id &&
    request.owner === "DESK" &&
    !TERMINAL.has(request.status)
  );
}

interface HandoverPanelProps {
  request: ServiceRequest;
  mode: "handover" | "takeback";
  person: Person;
  onCancel: () => void;
  onDone: () => void;
}

// One confirmation used everywhere (Help sheet and request detail). It only
// dispatches SET_OWNER on the existing request — never creates a new record.
export function HandoverPanel({ request, mode, person, onCancel, onDone }: HandoverPanelProps) {
  const { dispatch } = useStore();

  function confirm() {
    if (mode === "handover") {
      dispatch({
        type: "SET_OWNER",
        requestId: request.id,
        owner: "DESK",
        actorId: person.id,
        handoverScope: { canMatch: true, canBook: true, approvalLimit: null },
        note: `${person.name} asked SeniorG to handle this`,
      });
    } else {
      dispatch({
        type: "SET_OWNER",
        requestId: request.id,
        owner: "SELF",
        actorId: person.id,
        note: `${person.name} took the request back`,
      });
    }
    onDone();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-card-border p-4">
        <p className="text-meta font-semibold text-ink-2">{request.id}</p>
        <p className="font-semibold text-ink">{request.title}</p>
        <p className="text-body-sm text-ink-2">Same request, same details, same history.</p>
      </div>

      {mode === "handover" ? (
        <div className="space-y-2 text-body-sm text-ink">
          <p className="font-semibold">SeniorG will:</p>
          <ul className="space-y-1.5">
            {[
              "Follow this request and keep it moving",
              "Coordinate with the provider on your behalf",
              "Add every step to the same timeline",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-brand" /> {t}
              </li>
            ))}
          </ul>
          <p className="pt-1 text-ink-2">
            You stay in charge: SeniorG cannot approve extra costs or make payments, and you can take it
            back any time.
          </p>
        </div>
      ) : (
        <p className="text-body-sm text-ink-2">
          You will manage this request yourself again. Nothing changes except who is driving it.
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Button fullWidth onClick={confirm}>
          {mode === "handover" ? (
            <>
              <Headset size={18} /> Confirm — have SeniorG handle this
            </>
          ) : (
            <>
              <Undo2 size={18} /> Confirm — take it back
            </>
          )}
        </Button>
        <Button variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
