import type { DayEntry, Person, Reminder, RequestOwner, Service, ServiceRequest } from "@/types/entities";

// Household services (home repairs, house help) are shared between spouses by
// default; personal requests (trips, reminder help) stay private to the creator.
import { household } from "@/data/seed";
function spouseIds(person: Person): string[] {
  return household.memberIds.filter((id) => id !== person.id);
}

function newRequestId(): string {
  // Prototype-only id scheme — good enough to avoid collisions in a single session.
  return `REQ-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 10)}`;
}

function newArrivalCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// The "Start" entry point for a bookable service from the Services
// marketplace. This intentionally stops short of the full step-by-step
// wizard (problem, date, provider, price review) — that is Milestone 2.
// It creates one real ServiceRequest so Home / Requests / the active-request
// bar all immediately reflect it, proving ONE STATE -> MULTIPLE SURFACES.
export function buildServiceRequestFromService(
  service: Service,
  person: Person,
  owner: RequestOwner = "SELF"
): ServiceRequest {
  const estimate = service.visitFee ?? service.estimateRange?.[0];
  return {
    id: newRequestId(),
    householdId: person.householdId ?? "HH-01",
    createdBy: person.id,
    serviceId: service.id,
    category: service.category,
    title: service.name,
    status: "REQUESTED",
    owner,
    details: {},
    price: { estimate },
    additionalWork: [],
    payment: { status: "NOT_DUE", method: "Demo payment" },
    sharedWith: service.category === "HOME_REPAIR" || service.category === "HOUSE_HELP" ? spouseIds(person) : [],
    history: [],
    createdAt: new Date().toISOString(),
  };
}

// The "Help me with this" choice on a reminder (D-05): creates a desk-owned
// request directly — there is no self-serve stage to hand over from. The
// request keeps the reminder's reference, reason, due date and the
// assistance checklist, alongside the household/member it belongs to.
export function buildDeskRequestFromReminder(reminder: Reminder, person: Person): ServiceRequest {
  return {
    id: newRequestId(),
    householdId: person.householdId ?? "HH-01",
    createdBy: person.id,
    serviceId: "SV-BANKING",
    category: "REFERRAL",
    title: `Help with ${reminder.title}`,
    status: "REQUESTED",
    owner: "DESK",
    handoverScope: { canMatch: true, canBook: true, approvalLimit: null },
    details: {
      reminderId: reminder.id,
      reminderTitle: reminder.title,
      reason: reminder.whyItMatters,
      dueDate: reminder.dueDate,
      assistanceRequired: reminder.whatYouNeed,
    } as unknown as Record<string, unknown>,
    price: {},
    additionalWork: [],
    payment: { status: "NOT_DUE", method: "Demo payment" },
    sharedWith: [],
    history: [],
    linkedReminderId: reminder.id,
    createdAt: new Date().toISOString(),
  };
}

// ---- AC repair (J1), the first fully-built hero journey -------------------

export interface AcRepairDetails {
  symptom: string;
  acType: string;
  note?: string;
  hasPhoto: boolean;
  urgency: string;
  date: string; // ISO date, e.g. 2026-10-06
  slot: string; // "Morning (9am-12pm)" etc.
}

// Built once the member has gone through the whole booking wizard (problem,
// description, photo, urgency, date, time, provider) — unlike the generic
// marketplace "Start" sheet, this request is born CONFIRMED with a provider
// already attached, matching R-01..R-06 of the approved journey.
export function buildAcRepairRequest(
  details: AcRepairDetails,
  person: Person,
  service: Service,
  providerId: string
): ServiceRequest {
  return {
    id: newRequestId(),
    householdId: person.householdId ?? "HH-01",
    createdBy: person.id,
    serviceId: service.id,
    category: service.category,
    title: service.name,
    status: "REQUESTED",
    owner: "SELF",
    details: { ...details } as unknown as Record<string, unknown>,
    schedule: { date: details.date, slot: details.slot },
    providerId,
    arrivalCode: newArrivalCode(),
    price: { estimate: service.visitFee },
    additionalWork: [],
    payment: { status: "NOT_DUE", method: "Demo payment" },
    sharedWith: spouseIds(person),
    history: [],
    createdAt: new Date().toISOString(),
  };
}

// ---- Go With Me (J2 airport / J3 hospital) — one shared flow, two configs -

export type GoWithMeDestination = "airport" | "hospital";

export interface GoWithMeDetails {
  destinationType: GoWithMeDestination;
  assistance: string[]; // chosen assistance id(s) — single for airport tiers, multiple for hospital
  date: string;
  slot: string;
  travellerId: string; // household member id
  pickupAddress?: string; // airport only
}

// Built once the member has picked a destination, assistance level, date,
// time, traveller and companion — the same "wizard collapses into one
// confirmed request" pattern as buildAcRepairRequest.
export function buildGoWithMeRequest(
  details: GoWithMeDetails,
  estimate: number,
  person: Person,
  service: Service,
  providerId: string
): ServiceRequest {
  const title = details.destinationType === "hospital" ? "Hospital companion" : "Airport assistance";
  return {
    id: newRequestId(),
    householdId: person.householdId ?? "HH-01",
    createdBy: person.id,
    serviceId: service.id,
    category: service.category,
    title,
    status: "REQUESTED",
    owner: "SELF",
    details: { ...details } as unknown as Record<string, unknown>,
    schedule: { date: details.date, slot: details.slot },
    providerId,
    price: { estimate },
    additionalWork: [],
    payment: { status: "NOT_DUE", method: "Demo payment" },
    sharedWith: [],
    history: [],
    createdAt: new Date().toISOString(),
  };
}

// ---- Temporary House Help (J4) — multi-day, per-day tracking ---------------

export interface HouseHelpDetails {
  taskType: string; // cleaning | cooking | dishes | multiple | replacement
  days: number;
  timing: string; // Morning / Afternoon / Evening
  preferences: string[]; // female-helper, male-helper, experienced, same-helper
  startDate: string; // ISO date
}

function buildDailyLog(startDate: string, days: number): DayEntry[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().slice(0, 10), status: "SCHEDULED" as const };
  });
}

// Built once the member has picked what's needed, for how long, when, any
// preferences, and a helper — same "wizard collapses into one confirmed
// request" pattern as the other two journeys, plus a generated dailyLog
// (already part of the ServiceRequest schema) for the multi-day tracker.
export function buildHouseHelpRequest(
  details: HouseHelpDetails,
  estimate: number,
  person: Person,
  service: Service,
  providerId: string
): ServiceRequest {
  return {
    id: newRequestId(),
    householdId: person.householdId ?? "HH-01",
    createdBy: person.id,
    serviceId: service.id,
    category: service.category,
    title: "Temporary House Help",
    status: "REQUESTED",
    owner: "SELF",
    details: { ...details } as unknown as Record<string, unknown>,
    schedule: { start: details.startDate, days: details.days },
    providerId,
    price: { estimate },
    additionalWork: [],
    dailyLog: buildDailyLog(details.startDate, details.days),
    payment: { status: "NOT_DUE", method: "Demo payment" },
    sharedWith: spouseIds(person),
    history: [],
    createdAt: new Date().toISOString(),
  };
}
