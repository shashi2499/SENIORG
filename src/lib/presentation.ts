import type { HistoryEvent, Person, Provider, ServiceRequest, RequestStatus } from "@/types/entities";
import { formatShortDateTime, isDateOnly } from "@/lib/date";

// Presentation-only: turns the frozen request state into human language.
// Nothing here changes state; it only decides what a person reads.

export type Tone = "needs" | "handling" | "active" | "scheduled" | "waiting" | "done" | "problem" | "closed";

export interface RequestPresentation {
  tone: Tone;
  pill: string; // short status, e.g. "On the way"
  headline: string; // e.g. "Ramesh is on the way"
  detail?: string; // one supporting line
  needsYou: boolean; // the member must act
}

export const SERVICE_KIND: Record<string, string> = {
  HOME_REPAIR: "Home repair",
  GO_WITH_ME: "Go With Me",
  HOUSE_HELP: "Temporary house help",
  REFERRAL: "Help from SeniorG",
  FUTURE: "Service",
};

function first(name?: string) {
  return name ? name.split(" ")[0] : undefined;
}

export function whenLabel(request: ServiceRequest): string | undefined {
  const s = request.schedule;
  if (!s) return undefined;
  const date = s.date ?? s.start;
  if (!date) return s.slot;
  const d = isDateOnly(date) ? formatShortDateTime(date) : formatShortDateTime(date);
  return s.slot ? `${d} · ${s.slot}` : d;
}

export function destinationOf(request: ServiceRequest): "airport" | "hospital" | undefined {
  const dest = (request.details as { destinationType?: string })?.destinationType;
  return dest === "hospital" ? "hospital" : dest === "airport" ? "airport" : undefined;
}

export function hasReturnLeg(request: ServiceRequest): boolean {
  const details = request.details as { destinationType?: string; assistance?: string[] };
  if (!details?.assistance) return false;
  return details.destinationType === "hospital"
    ? details.assistance.includes("return")
    : details.assistance.includes("cab-companion-wait-return");
}

export function travellerName(request: ServiceRequest, people: Record<string, Person>, viewerId?: string) {
  const id = (request.details as { travellerId?: string })?.travellerId;
  if (!id || id === viewerId) return "you";
  return first(people[id]?.name) ?? "you";
}

export function presentRequest(
  request: ServiceRequest,
  providers: Record<string, Provider>,
  people: Record<string, Person>,
  viewerId?: string
): RequestPresentation {
  const p = first(request.providerId ? providers[request.providerId]?.name : undefined);
  const who = p ?? "Your professional";
  const when = whenLabel(request);
  const dest = destinationOf(request);
  const place = dest === "hospital" ? "the hospital" : "the airport";
  const traveller = travellerName(request, people, viewerId);
  const desk = request.owner === "DESK";
  const cat = request.category;
  const days = request.dailyLog?.length ?? 0;
  const doneDays = request.dailyLog?.filter((d) => d.status === "DONE").length ?? 0;

  const map: Partial<Record<RequestStatus, RequestPresentation>> = {
    DRAFT: { tone: "waiting", pill: "Not sent", headline: "Not sent yet", needsYou: true },
    REQUESTED:
      cat === "REFERRAL"
        ? { tone: "handling", pill: "SeniorG is arranging", headline: "The SeniorG desk is preparing your plan", detail: "Priya will confirm what happens next.", needsYou: false }
        : {
            tone: desk ? "handling" : "waiting",
            pill: "Finding someone",
            headline: cat === "GO_WITH_ME" ? "Finding your companion" : cat === "HOUSE_HELP" ? "Finding a helper for you" : "Finding the right professional",
            detail: "SeniorG matches verified people only. We'll tell you who, and when.",
            needsYou: false,
          },
    NO_PROVIDER_FOUND: { tone: "problem", pill: "No one free", headline: "No one is free at that time", detail: "Choose another time, or let SeniorG find someone for you.", needsYou: true },
    REMATCHING: { tone: "handling", pill: "Finding a replacement", headline: "Finding a replacement", detail: "The original booking fell through. SeniorG is arranging someone else.", needsYou: false },
    MATCHED: { tone: "active", pill: "Matched", headline: `${who} is matched`, detail: when, needsYou: false },
    CONFIRMED:
      cat === "REFERRAL"
        ? { tone: "scheduled", pill: "Arranged", headline: "SeniorG has arranged this", detail: "Mark it done once it's taken care of.", needsYou: false }
        : cat === "GO_WITH_ME"
          ? { tone: "scheduled", pill: "Booked", headline: `${who} will be with ${traveller}`, detail: when, needsYou: false }
          : cat === "HOUSE_HELP"
            ? { tone: "scheduled", pill: "Booked", headline: `${who} will help at home`, detail: when ? `Starting ${when}` : undefined, needsYou: false }
            : { tone: "scheduled", pill: "Booked", headline: `${who} will visit you`, detail: when, needsYou: false },
    RESCHEDULED: { tone: "scheduled", pill: "New time", headline: "New time confirmed", detail: when, needsYou: false },
    PROVIDER_EN_ROUTE: { tone: "active", pill: "On the way", headline: `${who} is on the way`, detail: "About 20 minutes. Check the arrival code at the door.", needsYou: false },
    IN_PROGRESS: { tone: "active", pill: "Work in progress", headline: `${who} is working on it`, detail: "Anything extra needs your approval first.", needsYou: false },
    AWAITING_APPROVAL: { tone: "needs", pill: "Needs your approval", headline: "Your approval is needed", detail: `${who} found something extra. Nothing is charged unless you approve.`, needsYou: true },
    COMPANION_EN_ROUTE: { tone: "active", pill: "On the way", headline: `${who} is on the way to pick up ${traveller}`, detail: when, needsYou: false },
    PICKED_UP: { tone: "active", pill: "Travelling", headline: `On the way to ${place} with ${who}`, needsYou: false },
    ARRIVED: { tone: "active", pill: "Arrived", headline: "Arrived at the airport", detail: `${who} is helping with check-in.`, needsYou: false },
    AT_VENUE: { tone: "active", pill: "At the hospital", headline: `At the hospital with ${who}`, detail: "Registration and waiting are taken care of.", needsYou: false },
    VISIT_COMPLETE: { tone: "active", pill: "Visit complete", headline: "The visit is complete", detail: hasReturnLeg(request) ? `${who} will travel back with ${traveller}.` : undefined, needsYou: false },
    RETURN_JOURNEY: { tone: "active", pill: "Heading home", headline: `On the way home with ${who}`, needsYou: false },
    ACTIVE: { tone: "active", pill: "Under way", headline: `${who} is helping at home`, detail: days ? `Day ${Math.min(doneDays + 1, days)} of ${days}` : undefined, needsYou: false },
    COMPLETED: { tone: "needs", pill: "Payment due", headline: cat === "REFERRAL" ? "Done" : "All done — please check and pay", detail: "Pay only once you're happy with the work.", needsYou: true },
    PAID: { tone: "done", pill: "Paid", headline: "Paid — thank you", detail: "Tell us how it went to close this request.", needsYou: true },
    CLOSED: { tone: "closed", pill: "Completed", headline: "Completed", detail: request.rating ? `You rated this ${request.rating} of 5.` : undefined, needsYou: false },
    CANCELLED: { tone: "problem", pill: "Cancelled", headline: "This request was cancelled", needsYou: false },
    DISPUTED: { tone: "handling", pill: "Looking into it", headline: "SeniorG is looking into this", needsYou: false },
    RESOLVED: { tone: "done", pill: "Resolved", headline: "Resolved", needsYou: false },
  };

  let base = map[request.status] ?? { tone: "waiting" as Tone, pill: request.status, headline: request.title, needsYou: false };
  // Seen by someone other than the member (the desk, a spouse): describe what the member must do.
  if (viewerId && viewerId !== request.createdBy && base.needsYou) {
    const m = first(people[request.createdBy]?.name) ?? "the member";
    const words: Partial<Record<RequestStatus, string>> = {
      AWAITING_APPROVAL: `Waiting for ${m}'s approval`,
      COMPLETED: `Waiting for ${m} to pay`,
      PAID: `Waiting for ${m} to close it`,
      NO_PROVIDER_FOUND: "No one is free at that time",
    };
    base = { ...base, headline: words[request.status] ?? base.headline, pill: request.status === "AWAITING_APPROVAL" ? `With ${m}` : base.pill, tone: request.status === "NO_PROVIDER_FOUND" ? base.tone : "waiting", needsYou: false };
  }
  // When the desk owns it, the member is not the one who must act — except to pay and close.
  if (desk && base.needsYou && request.status !== "COMPLETED" && request.status !== "PAID" && request.status !== "AWAITING_APPROVAL") {
    return { ...base, tone: "handling", needsYou: false };
  }
  return base;
}

// History entries were written by the reducer for an audit trail; some carry
// "Demo:" prefixes from simulated events. Members read plain language.
export function humanizeHistory(h: HistoryEvent): string {
  let text = h.action.replace(/^Demo:\s*/i, "");
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (text === "Status changed" && h.to) return `Moved to: ${STATUS_WORDS[h.to as RequestStatus] ?? h.to}`;
  return text;
}

export const STATUS_WORDS: Partial<Record<RequestStatus, string>> = {
  REQUESTED: "requested",
  MATCHED: "matched",
  CONFIRMED: "booked",
  PROVIDER_EN_ROUTE: "on the way",
  IN_PROGRESS: "work in progress",
  AWAITING_APPROVAL: "waiting for your approval",
  COMPANION_EN_ROUTE: "companion on the way",
  PICKED_UP: "picked up",
  ARRIVED: "arrived",
  AT_VENUE: "at the hospital",
  VISIT_COMPLETE: "visit complete",
  RETURN_JOURNEY: "heading home",
  ACTIVE: "under way",
  COMPLETED: "done",
  PAID: "paid",
  CLOSED: "closed",
  CANCELLED: "cancelled",
};

export const TONE_STYLE: Record<Tone, { pill: string; dot: string; text: string }> = {
  needs: { pill: "bg-needs-tint text-needs", dot: "bg-accent", text: "text-needs" },
  handling: { pill: "bg-handling-tint text-handling", dot: "bg-handling", text: "text-handling" },
  active: { pill: "bg-brand-tint text-brand-dark", dot: "bg-brand", text: "text-brand-dark" },
  scheduled: { pill: "bg-brand-tint text-brand-dark", dot: "bg-brand", text: "text-brand-dark" },
  waiting: { pill: "bg-sand text-ink-2", dot: "bg-ink-3", text: "text-ink-2" },
  done: { pill: "bg-success-tint text-success", dot: "bg-success", text: "text-success" },
  closed: { pill: "bg-sand text-ink-2", dot: "bg-success", text: "text-ink-2" },
  problem: { pill: "bg-critical-tint text-critical", dot: "bg-critical", text: "text-critical" },
};
