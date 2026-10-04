import type {
  DocumentEntry,
  Permission,
  PermissionArea,
  Person,
  Reminder,
  ServiceRequest,
} from "@/types/entities";

// ---- Family permission model -------------------------------------------------
// ONE permission system: Person.permissions on the family member. Each grant
// names who gave it (grantedBy) so a grant from Suresh only ever covers
// Suresh's own items — never Asha's private ones. Nothing is shared by default.

function grantsFor(person: Person, area: PermissionArea): Permission[] {
  return (person.permissions ?? []).filter((p) => p.area === area && p.scope !== "NONE");
}

export function hasAreaGrant(person: Person, area: PermissionArea): boolean {
  return grantsFor(person, area).length > 0;
}

function covers(person: Person, area: PermissionArea, ownerId: string, itemId: string): boolean {
  return grantsFor(person, area).some(
    (g) => g.grantedBy === ownerId && (g.scope === "ALL" || (g.scope === "SELECTED" && g.itemIds.includes(itemId)))
  );
}

export function familyCanSeeStatus(request: ServiceRequest, person: Person): boolean {
  return covers(person, "REQUEST_STATUS", request.createdBy, request.id);
}

export function familyCanSeePayment(request: ServiceRequest, person: Person): boolean {
  return covers(person, "PAYMENTS", request.createdBy, request.id);
}

// Only a family PAYER may pay, only where the member granted Payments for this
// request, and only once the work is done and nothing has been paid yet.
export function familyCanPay(request: ServiceRequest, person: Person): boolean {
  return (
    person.role === "FAMILY_PAYER" &&
    familyCanSeePayment(request, person) &&
    request.status === "COMPLETED" &&
    request.payment.status !== "PAID_SIMULATED" &&
    (request.price.final ?? 0) > 0
  );
}

// Members and spouses use the whole product; everyone else (family, desk, admin)
// gets a focused view: Home and Requests.
export function isHouseholdMember(person?: Person): boolean {
  return person?.role === "MEMBER" || person?.role === "SPOUSE";
}

export function isFamilyRole(person?: Person): boolean {
  return person?.role === "FAMILY_VIEWER" || person?.role === "FAMILY_PAYER";
}

// Reminders: members see their own plus any shared with them; family see only
// what the Reminders permission covers.
export function getVisibleReminders(reminders: Record<string, Reminder>, person: Person): Reminder[] {
  const all = Object.values(reminders);
  if (isFamilyRole(person)) return all.filter((r) => covers(person, "REMINDERS", r.ownerId, r.id));
  if (person.role === "MEMBER" || person.role === "SPOUSE") {
    return all.filter((r) => r.ownerId === person.id || r.sharedWith.includes(person.id));
  }
  return all;
}

// Document INDEX entries only (never contents).
export function getVisibleDocuments(documents: Record<string, DocumentEntry>, person: Person): DocumentEntry[] {
  const all = Object.values(documents);
  if (isFamilyRole(person)) {
    return all.filter((d) => d.visibleTo.some((owner) => covers(person, "DOCUMENTS", owner, d.id)));
  }
  if (person.role === "MEMBER" || person.role === "SPOUSE") return all.filter((d) => d.visibleTo.includes(person.id));
  return [];
}


// Minimal visibility rule for Milestone 1: a request-engine foundation,
// not the full Family Circle permission model (built in a later milestone).
export function getVisibleRequests(
  requests: Record<string, ServiceRequest>,
  person: Person
): ServiceRequest[] {
  const all = Object.values(requests);

  switch (person.role) {
    case "MEMBER":
    case "SPOUSE":
      // Spouses are independent: you see your own requests plus those shared with you.
      return all.filter(
        (r) => r.householdId === person.householdId && (r.createdBy === person.id || r.sharedWith.includes(person.id))
      );
    case "FAMILY_VIEWER":
    case "FAMILY_PAYER":
      return all.filter((r) => familyCanSeeStatus(r, person) || familyCanSeePayment(r, person));
    case "COORDINATOR":
      return all.filter((r) => r.owner === "DESK");
    default:
      return all;
  }
}

export type RequestSegment = "needsAction" | "active" | "completed";

const NEEDS_ACTION_STATUSES = new Set(["AWAITING_APPROVAL", "NO_PROVIDER_FOUND"]);
const COMPLETED_STATUSES = new Set(["COMPLETED", "PAID", "CLOSED", "CANCELLED", "RESOLVED"]);

export function segmentOf(request: ServiceRequest): RequestSegment {
  if (NEEDS_ACTION_STATUSES.has(request.status) && request.owner === "SELF") return "needsAction";
  if (COMPLETED_STATUSES.has(request.status)) return "completed";
  return "active";
}

const TERMINAL_STATUSES = new Set(["CLOSED", "CANCELLED"]);

// The single "what's in flight right now" query, used by both the Home hero
// card and the persistent ActiveRequestBar — one state, two surfaces.
export function getActiveRequestsFor(
  requests: Record<string, ServiceRequest>,
  person: Person
): ServiceRequest[] {
  return getVisibleRequests(requests, person)
    .filter((r) => !TERMINAL_STATUSES.has(r.status))
    .sort((a, b) => {
      // Needs-your-approval first, then anything with a nearer schedule date, then most recent.
      const aUrgent = a.status === "AWAITING_APPROVAL" ? 0 : 1;
      const bUrgent = b.status === "AWAITING_APPROVAL" ? 0 : 1;
      if (aUrgent !== bUrgent) return aUrgent - bUrgent;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}
