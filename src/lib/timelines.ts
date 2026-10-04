import type { RequestStatus, ServiceRequest } from "@/types/entities";
import { destinationOf, hasReturnLeg } from "./presentation";

// Each journey tells its own story. A step lists the statuses that belong to it;
// the timeline lights up the step that contains the request's current status.
export interface TimelineStep {
  key: string;
  label: string; // what the step means to the member
  statuses: RequestStatus[];
}

const TAIL: TimelineStep[] = [
  { key: "paid", label: "Paid", statuses: ["PAID"] },
  { key: "closed", label: "Closed", statuses: ["CLOSED", "RESOLVED"] },
];

export function timelineFor(request: ServiceRequest): TimelineStep[] {
  switch (request.category) {
    case "HOME_REPAIR":
      return [
        { key: "requested", label: "Request received", statuses: ["DRAFT", "REQUESTED", "NO_PROVIDER_FOUND", "REMATCHING"] },
        { key: "matched", label: "Professional matched", statuses: ["MATCHED"] },
        { key: "booked", label: "Visit booked", statuses: ["CONFIRMED", "RESCHEDULED"] },
        { key: "enroute", label: "On the way", statuses: ["PROVIDER_EN_ROUTE"] },
        { key: "work", label: "Work in progress", statuses: ["IN_PROGRESS", "AWAITING_APPROVAL"] },
        { key: "done", label: "Work done, proof shared", statuses: ["COMPLETED", "DISPUTED"] },
        ...TAIL,
      ];
    case "GO_WITH_ME": {
      const hospital = destinationOf(request) === "hospital";
      const steps: TimelineStep[] = [
        { key: "requested", label: "Request received", statuses: ["DRAFT", "REQUESTED", "NO_PROVIDER_FOUND", "REMATCHING"] },
        { key: "matched", label: "Companion matched", statuses: ["MATCHED"] },
        { key: "booked", label: "Trip confirmed", statuses: ["CONFIRMED", "RESCHEDULED"] },
        { key: "enroute", label: "Companion on the way", statuses: ["COMPANION_EN_ROUTE"] },
        { key: "picked", label: "Picked up", statuses: ["PICKED_UP"] },
      ];
      if (hospital) {
        steps.push({ key: "venue", label: "At the hospital", statuses: ["AT_VENUE"] });
        steps.push({ key: "visit", label: "Visit complete", statuses: ["VISIT_COMPLETE"] });
      } else {
        steps.push({ key: "arrived", label: "At the airport, checked in", statuses: ["ARRIVED"] });
      }
      if (hasReturnLeg(request)) steps.push({ key: "return", label: "Journey home", statuses: ["RETURN_JOURNEY"] });
      steps.push({ key: "done", label: hospital ? "Back home" : "Trip complete", statuses: ["COMPLETED"] });
      return [...steps, ...TAIL];
    }
    case "HOUSE_HELP":
      return [
        { key: "requested", label: "Request received", statuses: ["DRAFT", "REQUESTED", "NO_PROVIDER_FOUND", "REMATCHING"] },
        { key: "matched", label: "Helper matched", statuses: ["MATCHED"] },
        { key: "booked", label: "Plan confirmed", statuses: ["CONFIRMED", "RESCHEDULED"] },
        { key: "active", label: "Help under way", statuses: ["ACTIVE"] },
        { key: "done", label: "All days done", statuses: ["COMPLETED"] },
        ...TAIL,
      ];
    case "REFERRAL":
    default:
      return [
        { key: "requested", label: "Asked SeniorG for help", statuses: ["DRAFT", "REQUESTED"] },
        { key: "arranged", label: "Desk arranged it", statuses: ["MATCHED", "CONFIRMED"] },
        { key: "done", label: "Done", statuses: ["COMPLETED", "PAID"] },
        { key: "closed", label: "Closed", statuses: ["CLOSED", "RESOLVED"] },
      ];
  }
}

export function currentStepIndex(steps: TimelineStep[], status: RequestStatus): number {
  const i = steps.findIndex((s) => s.statuses.includes(status));
  return i < 0 ? 0 : i;
}

// When did the request reach this step? Uses the request's own history.
export function stepTime(request: ServiceRequest, step: TimelineStep): string | undefined {
  const hit = [...request.history].reverse().find((h) => h.to && step.statuses.includes(h.to as RequestStatus));
  if (hit) return hit.at;
  if (step.key === "requested") return request.history[0]?.at ?? request.createdAt;
  return undefined;
}
