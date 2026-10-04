// Entity types for the SeniorG prototype.
// Source of truth: /docs/07_MOCK_DATA_MODEL.md and /docs/08_STATE_MODEL.md.
// All data represented by these types is fictional and illustrative (CLAUDE.md §11).

export type PersonRole =
  | "MEMBER"
  | "SPOUSE"
  | "FAMILY_VIEWER"
  | "FAMILY_PAYER"
  | "COORDINATOR"
  | "PROVIDER"
  | "ORGANISER"
  | "ADMIN";

export interface PersonPreferences {
  languages: string[];
  textSize: "standard" | "large" | "extra-large";
  visitorGender: "any" | "male" | "female";
  mobilityNote?: string;
  diet?: string;
  pickupAddress?: string;
}

export type PermissionArea =
  | "REQUEST_STATUS"
  | "REMINDERS"
  | "DOCUMENTS"
  | "EMERGENCY_INFO"
  | "PAYMENTS";

export type PermissionScope = "NONE" | "SELECTED" | "ALL";

export interface Permission {
  grantedTo: string; // personId
  grantedBy: string; // personId
  area: PermissionArea;
  scope: PermissionScope;
  itemIds: string[];
}

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  householdId?: string;
  relation?: string;
  city?: string;
  age?: number;
  membershipNo?: string;
  preferences?: PersonPreferences;
  permissions?: Permission[]; // family members only
  avatarInitials: string;
}

export interface Household {
  id: string;
  name: string;
  address: string;
  city: "Pune" | "Mumbai";
  associationChapter: string;
  memberIds: string[];
  trustedContactIds: string[];
}

export type ProviderType = "REPAIR" | "COMPANION" | "HOUSE_HELP";

export interface Provider {
  id: string;
  name: string;
  business: string;
  businessAddress?: string;
  customerCare?: string;
  type: ProviderType;
  skills: string[];
  languages: string[];
  rating: number;
  jobsWithMembers: number;
  idChecked: boolean;
  available: boolean;
  avatarInitials: string;
}

export type ScopeTag = "CORE" | "SHOWCASE" | "FUTURE";
export type BookingType = "THROUGH_SENIORG" | "PARTNER" | "ASSOCIATION";

export type ServiceCategory =
  | "HOME_REPAIR"
  | "GO_WITH_ME"
  | "HOUSE_HELP"
  | "REFERRAL"
  | "FUTURE";

export interface ServiceVariant {
  id: string;
  label: string;
  includes: string[];
  basePrice: number;
  perHour?: number;
}

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  bookingType: BookingType;
  scopeTag: ScopeTag;
  variants?: ServiceVariant[];
  visitFee?: number;
  estimateRange?: [number, number];
  terms?: string[];
}

// ---- Request engine -------------------------------------------------------

export type RequestStatus =
  | "DRAFT"
  | "REQUESTED"
  | "NO_PROVIDER_FOUND"
  | "MATCHED"
  | "CONFIRMED"
  | "REMATCHING"
  | "RESCHEDULED"
  | "AWAITING_APPROVAL"
  | "PROVIDER_EN_ROUTE"
  | "IN_PROGRESS"
  | "COMPANION_EN_ROUTE"
  | "PICKED_UP"
  | "AT_VENUE"
  | "VISIT_COMPLETE"
  | "RETURN_JOURNEY"
  | "ARRIVED"
  | "ACTIVE"
  | "COMPLETED"
  | "PAID"
  | "CLOSED"
  | "CANCELLED"
  | "DISPUTED"
  | "RESOLVED";

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  DRAFT: "Not sent yet",
  REQUESTED: "Finding the right person",
  NO_PROVIDER_FOUND: "No one is free then",
  MATCHED: "Ready for you to confirm",
  CONFIRMED: "Confirmed",
  REMATCHING: "Finding a replacement",
  RESCHEDULED: "New time confirmed",
  AWAITING_APPROVAL: "Needs your approval",
  PROVIDER_EN_ROUTE: "On the way",
  IN_PROGRESS: "In progress",
  COMPANION_EN_ROUTE: "On the way",
  PICKED_UP: "Picked up",
  AT_VENUE: "At the venue",
  VISIT_COMPLETE: "Visit complete",
  RETURN_JOURNEY: "On the way back",
  ARRIVED: "Arrived",
  ACTIVE: "Active",
  COMPLETED: "Done: please check",
  PAID: "Paid",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
  DISPUTED: "We're looking into it",
  RESOLVED: "Resolved",
};

export type RequestOwner = "SELF" | "DESK";

export type PaymentStatus =
  | "NOT_DUE"
  | "DUE"
  | "PAID_SIMULATED"
  | "PARTIAL"
  | "REFUND_PENDING"
  | "REFUNDED";

export interface Payment {
  status: PaymentStatus;
  amount?: number;
  refundAmount?: number;
  payerId?: string;
  method: "Demo payment";
}

export type AdditionalWorkStatus = "PENDING" | "APPROVED" | "DECLINED";

export interface AdditionalWork {
  id: string;
  description: string;
  reason: string;
  photo?: string;
  amount: number;
  status: AdditionalWorkStatus;
  decidedBy?: string;
  decidedAt?: string;
}

export interface HandoverScope {
  canMatch: boolean;
  canBook: boolean;
  approvalLimit: number | null; // null = no price-approval authority (default)
}

export interface HistoryEvent {
  id: string;
  at: string; // ISO timestamp
  actorId: string;
  action: string;
  from?: string;
  to?: string;
  note?: string;
}

export type DayStatus =
  | "SCHEDULED"
  | "CHECKED_IN"
  | "DONE"
  | "ISSUE"
  | "BACKUP_ASSIGNED"
  | "UNRESOLVED"
  | "SKIPPED";

export interface DayEntry {
  date: string;
  status: DayStatus;
  checkIn?: string;
  note?: string;
}

export type TripStage =
  | "ASSIGNED"
  | "COMPANION_EN_ROUTE"
  | "PICKED_UP"
  | "ARRIVED"
  | "AT_VENUE"
  | "VISIT_COMPLETE"
  | "RETURN_JOURNEY"
  | "COMPLETED";

export interface RequestProof {
  photos: string[];
  notes?: string;
  timeIn?: string;
  timeOut?: string;
  parts?: string[];
}

export interface ServiceRequest {
  id: string;
  householdId: string;
  createdBy: string; // personId
  serviceId: string;
  variantId?: string;
  category: ServiceCategory;
  title: string;
  status: RequestStatus;
  owner: RequestOwner;
  handoverScope?: HandoverScope;
  details: Record<string, unknown>;
  schedule?: { date?: string; slot?: string; start?: string; days?: number; hoursPerDay?: number };
  providerId?: string;
  backupProviderId?: string;
  arrivalCode?: string;
  price: { estimate?: number; agreed?: number; additional?: number; final?: number };
  additionalWork: AdditionalWork[];
  dailyLog?: DayEntry[];
  tripStage?: TripStage;
  proof?: RequestProof;
  payment: Payment;
  sharedWith: string[]; // personIds
  rating?: number;
  history: HistoryEvent[];
  linkedReminderId?: string;
  linkedEventId?: string;
  createdAt: string;
}

// ---- Reminders / Documents -------------------------------------------------

export type ReminderCategory =
  | "PENSION"
  | "INSURANCE"
  | "TAX"
  | "BILL"
  | "PROPERTY"
  | "DEPOSIT"
  | "ASSOCIATION"
  | "WARRANTY";

export type ReminderStatus =
  | "UPCOMING"
  | "DUE_SOON"
  | "EXPLAINED"
  | "IN_PROGRESS_SELF"
  | "ASSISTED"
  | "DONE"
  | "SNOOZED"
  | "OVERDUE";

export interface ReminderRule {
  source: string;
  appliesTo: string;
  year: number;
  verifiedOn: string;
  reviewedBy: string;
}

export interface Reminder {
  id: string;
  title: string;
  category: ReminderCategory;
  ownerId: string;
  windowStart?: string;
  dueDate: string;
  status: ReminderStatus;
  whyItMatters: string;
  whatYouNeed: string[];
  options: Array<"SELF" | "EXPLAIN" | "ASSIST">;
  partnerLink?: string;
  rule: ReminderRule;
  linkedDocumentId?: string;
  linkedRequestId?: string;
  sharedWith: string[];
}

export type DocumentCategory =
  | "IDENTITY"
  | "PENSION"
  | "INSURANCE"
  | "HEALTH"
  | "BANKING"
  | "PROPERTY"
  | "TAX"
  | "WARRANTY"
  | "HOUSEHOLD";

export interface DocumentEntry {
  id: string;
  name: string;
  category: DocumentCategory;
  refLast4?: string;
  storedWhere: string;
  expiryOrRenewal?: string;
  linkedReminderId?: string;
  notes?: string;
  visibleTo: string[];
}

// ---- Explore / Events / Tickets -------------------------------------------

export interface EventAccessibility {
  stepFree: boolean;
  lift: boolean;
  accessibleToilet: boolean;
  aisleSeats: boolean;
}

export type EventStatus = "ON_SALE" | "SOLD_OUT" | "CANCELLED";

export interface SeniorGEvent {
  id: string;
  title: string;
  category: string;
  language?: string;
  organiser: string;
  venue: string;
  dateTime: string;
  durationMin: number;
  distanceKm: number;
  priceFrom: number;
  priceTo: number;
  accessibility: EventAccessibility;
  bookingType: BookingType;
  scopeTag: ScopeTag;
  seatsLeft: number;
  status: EventStatus;
  description: string;
  locality: string;
  practical: { parking: string; seating: string; companion: string };
  goodForCouples: boolean;
  partnerName?: string; // PARTNER events only (a fictional external provider)
  saved: boolean;
  waitlist: string[]; // personIds waiting for a seat (sold-out events)
}

export type TicketStatus =
  | "SEATS_HELD"
  | "CONFIRMED"
  | "IN_CALENDAR"
  | "ATTENDED"
  | "CANCELLED_BY_MEMBER"
  | "CANCELLED_BY_ORGANISER";

export interface TicketBooking {
  id: string;
  eventId: string;
  bookedBy: string;
  attendees: string[];
  seats: string[];
  status: TicketStatus;
  payment: Payment;
  source: "SENIORG_DEMO" | "PARTNER" | "ASSOCIATION";
  inCalendarFor: string[]; // personIds who added it to their calendar
  createdAt: string;
}

// ---- Smart Minutes ----------------------------------------------------------

export type SmartMinuteCategory =
  | "STAY_SAFE"
  | "LEARN_SOMETHING"
  | "STAY_ACTIVE"
  | "CREATE_ENJOY"
  | "BHAKTI_MUSIC"
  | "TRAVEL_EXPLORE";

export type SmartMinuteSourceType = "OFFICIAL_GOVERNMENT" | "TRUSTED_INSTITUTION" | "CULTURAL_INSTITUTION";

// A curated Smart Minute. SeniorG never hosts or re-hosts the video: it links
// out to the source's own YouTube page. A record with videoUrl = null is a
// clearly labelled demo placeholder (no verified link yet), never a made-up URL.
export interface LearningVideo {
  id: string;
  title: string;
  category: SmartMinuteCategory;
  shortDescription: string;
  durationSec: number;
  sourceOrganisation: string;
  sourceChannel: string;
  sourceType: SmartMinuteSourceType;
  videoUrl: string | null;
  language: string;
  thumbnail: string; // visual placeholder key (rendered from the design tokens)
  verified: boolean; // true = the exact URL was checked against its source channel
  verificationLabel: string;
  whyItMatters: string;
  keyTakeaway: string;
  savedBy: string[]; // personIds (each spouse keeps their own list)
  watchedBy: string[]; // personIds, oldest first
}

// ---- Notifications / Desk ----------------------------------------------------

export type NotificationType =
  | "STATUS"
  | "APPROVAL_NEEDED"
  | "REMINDER"
  | "FAMILY_REQUEST"
  | "DESK_MESSAGE"
  | "EVENT_CHANGE"
  | "SMART_MINUTE";

export interface AppNotification {
  id: string;
  recipientId: string;
  type: NotificationType;
  text: string;
  linkScreenId?: string;
  linkEntityId?: string;
  read: boolean;
  at: string;
}

export interface DeskMessage {
  at: string;
  fromId: string;
  text: string;
}

export interface DeskConversation {
  id: string;
  requestId?: string;
  memberId: string;
  coordinatorId: string;
  messages: DeskMessage[];
}
