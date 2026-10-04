import type { ServiceRequest } from "@/types/entities";
import type { Action, DemoEventType } from "@/store/types";
import { hasReturnLeg } from "./presentation";

// Reviewer-only: what a provider, companion, helper or the passage of time
// would do next. These used to be "Simulate: …" buttons inside the member's
// screens; they now live in the Prototype strip and the Prototype lens, so a
// member never feels they are operating a prototype. Same actions, same state.
export interface DemoControl {
  label: string;
  kind: "next" | "variation";
  actions: Action[];
}

export function demoControlsFor(request: ServiceRequest, actorId: string): DemoControl[] {
  const ev = (eventType: DemoEventType): Action => ({ type: "TRIGGER_DEMO_EVENT", eventType, requestId: request.id, actorId });
  const next = (label: string, ...actions: Action[]): DemoControl => ({ label, kind: "next", actions });
  const vary = (label: string, ...actions: Action[]): DemoControl => ({ label, kind: "variation", actions });
  const s = request.status;

  if (request.category === "HOME_REPAIR") {
    if (s === "REQUESTED" && !request.providerId) return [next("A professional is matched and booked", { type: "MATCH_PROVIDER", requestId: request.id, actorId })];
    if (s === "CONFIRMED") return [next("Professional sets out", ev("PROVIDER_ARRIVES")), vary("Professional cancels", ev("PROVIDER_CANCELS")), vary("No one is available", ev("PROVIDER_UNAVAILABLE"))];
    if (s === "PROVIDER_EN_ROUTE") return [next("Professional arrives and starts work", ev("PROVIDER_STARTS_WORK"))];
    if (s === "IN_PROGRESS") {
      const hasPending = request.additionalWork.some((w) => w.status === "PENDING");
      return [
        next("Professional finishes and shares proof", ev("PROVIDER_COMPLETES")),
        ...(hasPending || request.additionalWork.length > 0 ? [] : [vary("Professional finds extra work", ev("PROVIDER_ADDS_WORK"))]),
      ];
    }
    if (s === "COMPLETED") return [vary("Payment fails (nothing charged)", ev("PAYMENT_FAILS"))];
  }

  if (request.category === "GO_WITH_ME") {
    const ret = hasReturnLeg(request);
    if (s === "CONFIRMED") return [next("Companion sets out", ev("COMPANION_SETS_OUT")), vary("Companion cancels", ev("PROVIDER_CANCELS"))];
    if (s === "COMPANION_EN_ROUTE") return [next("Companion picks up the traveller", ev("COMPANION_ARRIVES"))];
    if (s === "PICKED_UP") return [next("They reach the destination", ev("REACHED_DESTINATION"))];
    if (s === "ARRIVED") return [ret ? next("Return journey begins", ev("START_RETURN_JOURNEY")) : next("Trip is complete", ev("TRIP_COMPLETES"))];
    if (s === "AT_VENUE") return [next("The visit is complete", ev("VISIT_COMPLETES"))];
    if (s === "VISIT_COMPLETE") return [ret ? next("Return journey begins", ev("START_RETURN_JOURNEY")) : next("Trip is complete", ev("TRIP_COMPLETES"))];
    if (s === "RETURN_JOURNEY") return [next("Back home, trip complete", ev("TRIP_COMPLETES"))];
  }

  if (request.category === "HOUSE_HELP") {
    if (s === "CONFIRMED") return [next("The plan starts", ev("HOUSE_HELP_STARTS"))];
    if (s === "ACTIVE") return [next("Today's help is done", ev("HOUSE_HELP_DAY_DONE")), vary("Helper reports an issue today", ev("HOUSE_HELP_ISSUE")), vary("Backup helper assigned", ev("BACKUP_ASSIGNED"))];
  }

  if (request.category === "REFERRAL") {
    if (s === "REQUESTED") return [next("Desk confirms the plan", { type: "SET_STATUS", requestId: request.id, status: "CONFIRMED", actorId, note: "Desk confirmed the plan" })];
  }

  return [];
}
