import type { Person, Reminder, ServiceRequest } from "@/types/entities";
import type { AppState } from "@/store/types";
import { getActiveRequestsFor, getVisibleReminders, getVisibleRequests } from "./visibility";
import { presentRequest } from "./presentation";
import { reminderSection } from "./reminderUrgency";
import { daysUntil } from "./date";

// One read of shared state, used by Home, the right rail and the active-request
// pill alike: ONE STATE → MULTIPLE SURFACES.

export interface AttentionItem {
  kind: "request" | "reminder";
  id: string;
  title: string;
  reason: string;
  to: string;
}

export function attentionFor(state: AppState, person: Person): AttentionItem[] {
  const items: AttentionItem[] = [];
  for (const r of getVisibleRequests(state.requests, person)) {
    if (r.status === "CLOSED" || r.status === "CANCELLED") continue;
    // Only the person who owns the request is asked to act on it.
    if (r.createdBy !== person.id) continue;
    const p = presentRequest(r, state.providers, state.people, person.id);
    if (p.needsYou) items.push({ kind: "request", id: r.id, title: r.title, reason: p.headline, to: `/requests/${r.id}` });
  }
  for (const rem of dueReminders(state, person)) {
    const d = daysUntil(rem.dueDate);
    items.push({
      kind: "reminder",
      id: rem.id,
      title: rem.title,
      reason: rem.status === "OVERDUE" || d < 0 ? "Overdue — SeniorG can help" : `Due in ${d} day${d === 1 ? "" : "s"}`,
      to: `/household/reminders/${rem.id}`,
    });
  }
  return items;
}

export function dueReminders(state: AppState, person: Person): Reminder[] {
  return getVisibleReminders(state.reminders, person)
    .filter((r) => r.ownerId === person.id && reminderSection(r) === "attention")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export function handledByDesk(state: AppState, person: Person): ServiceRequest[] {
  return getVisibleRequests(state.requests, person).filter(
    (r) => r.owner === "DESK" && r.status !== "CLOSED" && r.status !== "CANCELLED"
  );
}

// The single request that deserves the stage right now (needs-you first).
export function spotlightRequest(state: AppState, person: Person): ServiceRequest | undefined {
  const active = getActiveRequestsFor(state.requests, person);
  const needs = active.find((r) => presentRequest(r, state.providers, state.people, person.id).needsYou);
  return needs ?? active[0];
}
