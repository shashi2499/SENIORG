import type {
  Household,
  Person,
  Provider,
  Service,
  ServiceRequest,
  Reminder,
  DocumentEntry,
  SeniorGEvent,
  TicketBooking,
  LearningVideo,
  AppNotification,
  DeskConversation,
  Payment,
  PermissionArea,
  PermissionScope,
  HandoverScope,
  RequestStatus,
  RequestOwner,
  ReminderStatus,
} from "@/types/entities";

export interface UiState {
  prototypeLensOpen: boolean;
  showScopeTags: boolean;
  helpSheetOpen: boolean;
  roleSwitcherOpen: boolean;
  notificationsOpen: boolean;
}

export interface AppState {
  household: Household;
  people: Record<string, Person>;
  providers: Record<string, Provider>;
  services: Record<string, Service>;
  requests: Record<string, ServiceRequest>;
  reminders: Record<string, Reminder>;
  documents: Record<string, DocumentEntry>;
  events: Record<string, SeniorGEvent>;
  tickets: Record<string, TicketBooking>;
  videos: Record<string, LearningVideo>;
  notifications: AppNotification[];
  deskConversations: Record<string, DeskConversation>;
  currentRoleId: string;
  ui: UiState;
}

// Reviewer-triggered simulated events (Prototype Lens, G-05).
// These stand in for a provider, coordinator or the passage of time
// (see /docs/04_HERO_JOURNEYS.md "Demo control").
export type DemoEventType =
  | "PROVIDER_ARRIVES"
  | "PROVIDER_STARTS_WORK"
  | "PROVIDER_ADDS_WORK"
  | "PROVIDER_CANCELS"
  | "PROVIDER_UNAVAILABLE"
  | "PAYMENT_SUCCEEDS"
  | "PAYMENT_FAILS"
  | "COMPANION_ARRIVES"
  | "EVENT_SOLD_OUT"
  | "HOUSE_HELP_ISSUE"
  | "BACKUP_ASSIGNED"
  | "PROVIDER_COMPLETES"
  | "COMPANION_SETS_OUT"
  | "REACHED_DESTINATION"
  | "VISIT_COMPLETES"
  | "START_RETURN_JOURNEY"
  | "TRIP_COMPLETES"
  | "HOUSE_HELP_STARTS"
  | "HOUSE_HELP_DAY_DONE";

export type Action =
  | { type: "SET_CURRENT_ROLE"; personId: string }
  | { type: "TOGGLE_HELP_SHEET"; open?: boolean }
  | { type: "TOGGLE_ROLE_SWITCHER"; open?: boolean }
  | { type: "TOGGLE_PROTOTYPE_LENS"; open?: boolean }
  | { type: "TOGGLE_SCOPE_TAGS" }
  | { type: "TOGGLE_NOTIFICATIONS"; open?: boolean }
  | { type: "CREATE_REQUEST"; request: ServiceRequest; actorId: string }
  | { type: "SET_STATUS"; requestId: string; status: RequestStatus; actorId: string; note?: string }
  | {
      type: "SET_OWNER";
      requestId: string;
      owner: RequestOwner;
      actorId: string;
      handoverScope?: HandoverScope;
      note?: string;
    }
  | { type: "SET_PAYMENT"; requestId: string; payment: Partial<Payment>; actorId: string }
  | {
      type: "ADD_HISTORY";
      requestId: string;
      actorId: string;
      action: string;
      from?: string;
      to?: string;
      note?: string;
    }
  | { type: "APPROVE_ADDITIONAL_WORK"; requestId: string; workId: string; actorId: string }
  | { type: "DECLINE_ADDITIONAL_WORK"; requestId: string; workId: string; actorId: string }
  | { type: "TRIGGER_DEMO_EVENT"; eventType: DemoEventType; requestId?: string; actorId: string }
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | { type: "SET_REMINDER_STATUS"; reminderId: string; status: ReminderStatus; linkedRequestId?: string }
  | { type: "CLOSE_REQUEST"; requestId: string; actorId: string; rating?: number }
  | {
      type: "SET_FAMILY_PERMISSION";
      memberId: string;
      grantedBy: string;
      area: PermissionArea;
      scope: PermissionScope;
      itemIds?: string[];
    }
  | { type: "REVOKE_FAMILY_ACCESS"; memberId: string; grantedBy: string }
  | { type: "ADD_FAMILY_MEMBER"; person: Person }
  | { type: "SET_REQUEST_SHARING"; requestId: string; personId: string; shared: boolean; actorId: string }
  | { type: "ASK_TO_SHARE"; requesterId: string; ownerId: string; area: PermissionArea }
  | { type: "FAMILY_PAY"; requestId: string; payerId: string }
  | { type: "BOOK_EVENT"; eventId: string; bookedBy: string; attendeeIds: string[]; seats: string[]; total: number }
  | { type: "ADD_TO_CALENDAR"; ticketId: string; personId: string }
  | { type: "INVITE_TO_EVENT"; ticketId: string; personId: string; actorId: string }
  | { type: "CANCEL_TICKET"; ticketId: string; actorId: string }
  | { type: "JOIN_WAITLIST"; eventId: string; personId: string }
  | { type: "TOGGLE_SAVE_EVENT"; eventId: string }
  | { type: "TOGGLE_SAVE_VIDEO"; videoId: string; personId: string }
  | { type: "TOGGLE_VIDEO_WATCHED"; videoId: string; personId: string }
  | { type: "SHARE_VIDEO"; videoId: string; fromId: string; toId: string }
  | { type: "MATCH_PROVIDER"; requestId: string; actorId: string }
  | { type: "RESET_DEMO" };
