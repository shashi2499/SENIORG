import { useState } from "react";
import { Headset, HandHelping, Undo2, UserRound } from "lucide-react";
import type { ServiceRequest } from "@/types/entities";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { HandoverPanel, canHandOver, canTakeBack } from "@/components/HandoverPanel";
import { useCurrentPerson, useStore } from "@/store/StoreContext";

// Who is driving this request — always visible, always reversible by the member.
export function OwnerBanner({ request }: { request: ServiceRequest }) {
  const { state } = useStore();
  const person = useCurrentPerson();
  const [mode, setMode] = useState<"handover" | "takeback" | null>(null);
  const desk = request.owner === "DESK";
  const isDesk = person?.role === "COORDINATOR";
  const member = state.people[request.createdBy];
  const coordinator = state.people["P-PRIYA"];
  const showHand = canHandOver(request, person);
  const showTake = canTakeBack(request, person);
  const closed = request.status === "CLOSED" || request.status === "CANCELLED";

  if (closed && !desk) return null;

  return (
    <>
      <div
        className={[
          "flex flex-col gap-4 rounded-card p-5 sm:flex-row sm:items-center sm:justify-between",
          desk ? "bg-handling-tint" : "bg-sand",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <span className={["flex h-11 w-11 shrink-0 items-center justify-center rounded-full", desk ? "bg-handling text-white" : "bg-card text-ink-2"].join(" ")}>
            {desk ? <Headset size={22} /> : <UserRound size={22} />}
          </span>
          <div>
            <p className="font-semibold text-ink">
              {desk
                ? isDesk
                  ? `Handed to the SeniorG desk by ${member?.name.split(" ")[0] ?? "the member"}`
                  : `SeniorG has this${coordinator ? ` · ${coordinator.name} is coordinating` : ""}`
                : isDesk
                  ? `${member?.name.split(" ")[0] ?? "The member"} is managing this`
                  : "You're managing this"}
            </p>
            <p className="mt-0.5 text-body-sm text-ink-2">
              {desk
                ? isDesk
                  ? request.handoverScope?.approvalLimit != null
                    ? `May approve extra costs up to ₹${request.handoverScope.approvalLimit}. Payments stay with the member.`
                    : "No authority to approve extra costs. Payments stay with the member."
                  : "Same request, same history. You can take it back at any time."
                : "Want someone to handle it? The SeniorG desk can take over — nothing is lost."}
            </p>
          </div>
        </div>
        {showHand && (
          <Button variant="secondary" size="md" className="shrink-0" onClick={() => setMode("handover")}>
            <HandHelping size={18} /> Have SeniorG handle this
          </Button>
        )}
        {showTake && (
          <Button variant="secondary" size="md" className="shrink-0" onClick={() => setMode("takeback")}>
            <Undo2 size={18} /> Take back
          </Button>
        )}
      </div>
      <Sheet open={mode !== null} onClose={() => setMode(null)} title={mode === "takeback" ? "Take this request back" : "Have SeniorG handle this"}>
        {mode && person && (
          <HandoverPanel request={request} mode={mode} person={person} onCancel={() => setMode(null)} onDone={() => setMode(null)} />
        )}
      </Sheet>
    </>
  );
}
