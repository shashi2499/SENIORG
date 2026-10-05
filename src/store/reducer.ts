import type { ServiceRequest, HistoryEvent } from "@/types/entities";
import * as seed from "@/data/seed";
import type { AppState, Action } from "./types";
import { familyCanPay } from "@/lib/visibility";

let historyCounter = 0;
function newHistoryId(): string {
  historyCounter += 1;
  return `H-${Date.now()}-${historyCounter}`;
}

export function makeInitialState(): AppState {
  return {
    household: seed.household,
    // Structured clone so repeated RESET_DEMO calls always start from a
    // pristine copy of the seed, never from a mutated previous session.
    people: structuredClone(seed.people),
    providers: structuredClone(seed.providers),
    services: structuredClone(seed.services),
    requests: structuredClone(seed.requests),
    reminders: structuredClone(seed.reminders),
    documents: structuredClone(seed.documents),
    events: structuredClone(seed.events),
    tickets: {},
    videos: structuredClone(seed.videos),
    notifications: structuredClone(seed.notifications),
    deskConversations: structuredClone(seed.deskConversations),
    currentRoleId: "P-SURESH",
    ui: {
      prototypeLensOpen: false,
      showScopeTags: false,
      helpSheetOpen: false,
      roleSwitcherOpen: false,
      notificationsOpen: false,
    },
  };
}

function appendHistory(
  request: ServiceRequest,
  entry: Omit<HistoryEvent, "id" | "at">
): ServiceRequest {
  const event: HistoryEvent = {
    id: newHistoryId(),
    at: new Date().toISOString(),
    ...entry,
  };
  return { ...request, history: [...request.history, event] };
}

function updateRequest(
  state: AppState,
  requestId: string,
  updater: (request: ServiceRequest) => ServiceRequest
): AppState {
  const request = state.requests[requestId];
  if (!request) return state;
  return {
    ...state,
    requests: { ...state.requests, [requestId]: updater(request) },
  };
}

// The desk may only approve or decline added work inside the limit the member
// set at handover (default: none). Members and spouses are never limited.
function deskMayDecide(state: AppState, request: ServiceRequest, workId: string, actorId: string): boolean {
  if (state.people[actorId]?.role !== "COORDINATOR") return true;
  const work = request.additionalWork.find((w) => w.id === workId);
  const limit = request.handoverScope?.approvalLimit;
  return request.owner === "DESK" && limit != null && !!work && work.amount <= limit;
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_CURRENT_ROLE":
      return { ...state, currentRoleId: action.personId, ui: { ...state.ui, roleSwitcherOpen: false } };

    case "TOGGLE_HELP_SHEET":
      return { ...state, ui: { ...state.ui, helpSheetOpen: action.open ?? !state.ui.helpSheetOpen } };

    case "TOGGLE_ROLE_SWITCHER":
      return { ...state, ui: { ...state.ui, roleSwitcherOpen: action.open ?? !state.ui.roleSwitcherOpen } };

    case "TOGGLE_PROTOTYPE_LENS":
      return { ...state, ui: { ...state.ui, prototypeLensOpen: action.open ?? !state.ui.prototypeLensOpen } };

    case "TOGGLE_SCOPE_TAGS":
      return { ...state, ui: { ...state.ui, showScopeTags: !state.ui.showScopeTags } };

    case "TOGGLE_NOTIFICATIONS":
      return { ...state, ui: { ...state.ui, notificationsOpen: action.open ?? !state.ui.notificationsOpen } };

    case "CREATE_REQUEST": {
      let withHistory = appendHistory(action.request, {
        actorId: action.actorId,
        action: "Request created",
        to: action.request.status,
      });
      // Requests created already owned by the desk (e.g. from a reminder) get the
      // same ownership entry a later handover would, so the timeline reads alike.
      if (withHistory.owner === "DESK") {
        withHistory = appendHistory(withHistory, {
          actorId: action.actorId,
          action: "Assigned to SeniorG Desk",
          to: "DESK",
        });
      }
      return { ...state, requests: { ...state.requests, [withHistory.id]: withHistory } };
    }

    case "SET_STATUS":
      return updateRequest(state, action.requestId, (request) =>
        appendHistory(
          { ...request, status: action.status },
          {
            actorId: action.actorId,
            action: `Status changed`,
            from: request.status,
            to: action.status,
            note: action.note,
          }
        )
      );

    case "SET_OWNER": {
      const current = state.requests[action.requestId];
      // Ownership change on the SAME record: ignore no-ops and closed requests.
      if (!current || current.owner === action.owner) return state;
      if (current.status === "CLOSED" || current.status === "CANCELLED") return state;

      const toDesk = action.owner === "DESK";
      const actor = state.people[action.actorId];
      const actorName = actor?.name ?? "Member";
      let next = updateRequest(state, action.requestId, (request) => {
        let updated: ServiceRequest = {
          ...request,
          owner: action.owner,
          handoverScope: toDesk ? action.handoverScope ?? request.handoverScope : request.handoverScope,
        };
        if (toDesk) {
          updated = appendHistory(updated, {
            actorId: action.actorId,
            action: "Member requested SeniorG assistance",
            note: action.note,
          });
          updated = appendHistory(updated, {
            actorId: action.actorId,
            action: "Assigned to SeniorG Desk",
            from: request.owner,
            to: "DESK",
          });
        } else {
          updated = appendHistory(updated, {
            actorId: action.actorId,
            action: "Member took the request back",
            from: request.owner,
            to: action.owner,
            note: action.note,
          });
        }
        return updated;
      });

      const at = new Date().toISOString();
      const notifications = [...next.notifications];
      if (toDesk) {
        notifications.push(
          {
            id: newHistoryId().replace("H-", "N-"),
            recipientId: current.createdBy,
            type: "DESK_MESSAGE",
            text: `Your request has been handed to SeniorG: ${current.title}.`,
            linkScreenId: "request",
            linkEntityId: current.id,
            read: false,
            at,
          },
          {
            id: newHistoryId().replace("H-", "N-"),
            recipientId: "P-PRIYA",
            type: "DESK_MESSAGE",
            text: `New handover from ${actorName}: ${current.title} (${current.id}).`,
            linkScreenId: "request",
            linkEntityId: current.id,
            read: false,
            at,
          }
        );
      } else {
        notifications.push({
          id: newHistoryId().replace("H-", "N-"),
          recipientId: "P-PRIYA",
          type: "DESK_MESSAGE",
          text: `${actorName} took back ${current.title} (${current.id}).`,
          linkScreenId: "request",
          linkEntityId: current.id,
          read: false,
          at,
        });
      }
      next = { ...next, notifications };
      return next;
    }

    case "SET_PAYMENT":
      return updateRequest(state, action.requestId, (request) =>
        appendHistory(
          {
            ...request,
            payment: {
              ...request.payment,
              ...action.payment,
              // Record who actually paid (the member, unless a family payer paid).
              payerId:
                action.payment.payerId ??
                (action.payment.status === "PAID_SIMULATED" ? request.payment.payerId ?? action.actorId : request.payment.payerId),
            },
          },
          {
            actorId: action.actorId,
            action: "Payment updated",
            to: action.payment.status ?? request.payment.status,
          }
        )
      );

    case "ADD_HISTORY":
      return updateRequest(state, action.requestId, (request) =>
        appendHistory(request, {
          actorId: action.actorId,
          action: action.action,
          from: action.from,
          to: action.to,
          note: action.note,
        })
      );

    case "APPROVE_ADDITIONAL_WORK":
      if (state.requests[action.requestId] && !deskMayDecide(state, state.requests[action.requestId], action.workId, action.actorId)) return state;
      return updateRequest(state, action.requestId, (request) => {
        const updatedWork = request.additionalWork.map((w) =>
          w.id === action.workId
            ? { ...w, status: "APPROVED" as const, decidedBy: action.actorId, decidedAt: new Date().toISOString() }
            : w
        );
        const work = request.additionalWork.find((w) => w.id === action.workId);
        return appendHistory(
          { ...request, additionalWork: updatedWork, status: "IN_PROGRESS" },
          {
            actorId: action.actorId,
            action: `Approved added work${work ? `: ${work.description} (₹${work.amount})` : ""}`,
            from: "AWAITING_APPROVAL",
            to: "IN_PROGRESS",
          }
        );
      });

    case "DECLINE_ADDITIONAL_WORK":
      if (state.requests[action.requestId] && !deskMayDecide(state, state.requests[action.requestId], action.workId, action.actorId)) return state;
      return updateRequest(state, action.requestId, (request) => {
        const updatedWork = request.additionalWork.map((w) =>
          w.id === action.workId
            ? { ...w, status: "DECLINED" as const, decidedBy: action.actorId, decidedAt: new Date().toISOString() }
            : w
        );
        const work = request.additionalWork.find((w) => w.id === action.workId);
        return appendHistory(
          { ...request, additionalWork: updatedWork, status: "IN_PROGRESS" },
          {
            actorId: action.actorId,
            action: `Declined added work${work ? `: ${work.description}` : ""}`,
            from: "AWAITING_APPROVAL",
            to: "IN_PROGRESS",
          }
        );
      });

    case "TRIGGER_DEMO_EVENT": {
      if (!action.requestId) return state;
      return updateRequest(state, action.requestId, (request) => {
        switch (action.eventType) {
          case "PROVIDER_ARRIVES":
            return appendHistory(
              { ...request, status: "PROVIDER_EN_ROUTE" },
              { actorId: action.actorId, action: "Demo: provider on the way", to: "PROVIDER_EN_ROUTE" }
            );
          case "PROVIDER_STARTS_WORK":
            return appendHistory(
              { ...request, status: "IN_PROGRESS" },
              { actorId: action.actorId, action: "Demo: provider started work", to: "IN_PROGRESS" }
            );
          case "PROVIDER_ADDS_WORK": {
            if (request.additionalWork.some((w) => w.status === "PENDING")) return request;
            const work = {
              id: `AW-${request.id}-${request.additionalWork.length + 1}`,
              description: "Capacitor replacement",
              reason: "The old capacitor is worn and needs to be replaced to complete the repair.",
              amount: 350,
              status: "PENDING" as const,
            };
            return appendHistory(
              {
                ...request,
                status: "AWAITING_APPROVAL",
                additionalWork: [...request.additionalWork, work],
              },
              {
                actorId: action.actorId,
                action: `Provider requested added work: ${work.description} (₹${work.amount})`,
                to: "AWAITING_APPROVAL",
              }
            );
          }
          case "PROVIDER_COMPLETES": {
            const approvedExtra = request.additionalWork
              .filter((w) => w.status === "APPROVED")
              .reduce((sum, w) => sum + w.amount, 0);
            const finalAmount = (request.price.estimate ?? 0) + approvedExtra;
            const now = new Date();
            const timeIn = new Date(now.getTime() - 45 * 60 * 1000).toISOString();
            return appendHistory(
              {
                ...request,
                status: "COMPLETED",
                price: { ...request.price, final: finalAmount },
                payment: { ...request.payment, status: "DUE", amount: finalAmount },
                proof: {
                  photos: ["before.jpg", "after.jpg"],
                  notes: "Work completed and tested. The unit is cooling normally.",
                  timeIn,
                  timeOut: now.toISOString(),
                },
              },
              { actorId: action.actorId, action: "Work completed, proof uploaded", to: "COMPLETED" }
            );
          }
          case "PROVIDER_CANCELS":
            return appendHistory(
              { ...request, status: "REMATCHING" },
              { actorId: action.actorId, action: "Demo: provider cancelled, rematching", to: "REMATCHING" }
            );
          case "PROVIDER_UNAVAILABLE":
            return appendHistory(
              { ...request, status: "NO_PROVIDER_FOUND" },
              { actorId: action.actorId, action: "Demo: no provider available", to: "NO_PROVIDER_FOUND" }
            );
          case "PAYMENT_SUCCEEDS":
            return appendHistory(
              { ...request, status: "PAID", payment: { ...request.payment, status: "PAID_SIMULATED" } },
              { actorId: action.actorId, action: "Demo: payment succeeded", to: "PAID" }
            );
          case "PAYMENT_FAILS":
            return appendHistory(
              { ...request, payment: { ...request.payment, status: "DUE" } },
              { actorId: action.actorId, action: "Demo: payment failed, nothing was charged" }
            );
          case "COMPANION_ARRIVES":
            return appendHistory(
              { ...request, status: "PICKED_UP" },
              { actorId: action.actorId, action: "Demo: companion picked up the member", to: "PICKED_UP" }
            );
          case "COMPANION_SETS_OUT":
            return appendHistory(
              { ...request, status: "COMPANION_EN_ROUTE" },
              { actorId: action.actorId, action: "Companion is on the way", to: "COMPANION_EN_ROUTE" }
            );
          case "REACHED_DESTINATION": {
            const isHospital = (request.details as { destinationType?: string })?.destinationType === "hospital";
            const next = isHospital ? "AT_VENUE" : "ARRIVED";
            return appendHistory(
              { ...request, status: next },
              {
                actorId: action.actorId,
                action: isHospital ? "Arrived at the hospital" : "Arrived at the airport",
                to: next,
              }
            );
          }
          case "VISIT_COMPLETES":
            return appendHistory(
              { ...request, status: "VISIT_COMPLETE" },
              { actorId: action.actorId, action: "Visit complete", to: "VISIT_COMPLETE" }
            );
          case "START_RETURN_JOURNEY":
            return appendHistory(
              { ...request, status: "RETURN_JOURNEY" },
              { actorId: action.actorId, action: "On the way back", to: "RETURN_JOURNEY" }
            );
          case "TRIP_COMPLETES": {
            const finalAmount = request.price.estimate ?? 0;
            const now = new Date();
            return appendHistory(
              {
                ...request,
                status: "COMPLETED",
                price: { ...request.price, final: finalAmount },
                payment: { ...request.payment, status: "DUE", amount: finalAmount },
                proof: {
                  photos: [],
                  notes: "Trip completed safely.",
                  timeIn: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
                  timeOut: now.toISOString(),
                },
              },
              { actorId: action.actorId, action: "Trip completed", to: "COMPLETED" }
            );
          }
          case "HOUSE_HELP_STARTS":
            return appendHistory(
              { ...request, status: "ACTIVE" },
              { actorId: action.actorId, action: "Plan started", to: "ACTIVE" }
            );
          case "HOUSE_HELP_DAY_DONE": {
            const log = request.dailyLog ?? [];
            const idx = log.findIndex((d) => d.status === "SCHEDULED");
            if (idx === -1) return request;
            const updatedLog = log.map((d, i) => (i === idx ? { ...d, status: "DONE" as const } : d));
            const allDone = updatedLog.every((d) => d.status === "DONE");
            if (!allDone) {
              return appendHistory(
                { ...request, dailyLog: updatedLog },
                { actorId: action.actorId, action: `Day ${idx + 1} completed` }
              );
            }
            const finalAmount = request.price.estimate ?? 0;
            return appendHistory(
              {
                ...request,
                dailyLog: updatedLog,
                status: "COMPLETED",
                price: { ...request.price, final: finalAmount },
                payment: { ...request.payment, status: "DUE", amount: finalAmount },
                proof: {
                  photos: [],
                  notes: `All ${updatedLog.length} day${updatedLog.length === 1 ? "" : "s"} completed.`,
                  timeOut: new Date().toISOString(),
                },
              },
              { actorId: action.actorId, action: `Day ${idx + 1} completed — all days done`, to: "COMPLETED" }
            );
          }
          case "HOUSE_HELP_ISSUE":
            return appendHistory(request, {
              actorId: action.actorId,
              action: "Demo: today's helper reported an issue",
            });
          case "BACKUP_ASSIGNED":
            return appendHistory(request, {
              actorId: action.actorId,
              action: "Demo: backup helper assigned",
            });
          case "EVENT_SOLD_OUT":
            return request;
          default:
            return request;
        }
      });
    }

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };

    case "SET_REMINDER_STATUS": {
      const reminder = state.reminders[action.reminderId];
      if (!reminder) return state;
      return {
        ...state,
        reminders: {
          ...state.reminders,
          [action.reminderId]: {
            ...reminder,
            status: action.status,
            linkedRequestId: action.linkedRequestId ?? reminder.linkedRequestId,
          },
        },
      };
    }

    case "CLOSE_REQUEST":
      return updateRequest(state, action.requestId, (request) =>
        appendHistory(
          { ...request, status: "CLOSED", rating: action.rating ?? request.rating },
          {
            actorId: action.actorId,
            action: action.rating ? `Rated ${action.rating}★ and closed` : "Closed",
            from: request.status,
            to: "CLOSED",
          }
        )
      );

    case "SET_FAMILY_PERMISSION": {
      const member = state.people[action.memberId];
      const granter = state.people[action.grantedBy];
      if (!member || !granter || (granter.role !== "MEMBER" && granter.role !== "SPOUSE")) return state;
      if (member.role !== "FAMILY_VIEWER" && member.role !== "FAMILY_PAYER") return state;
      const others = (member.permissions ?? []).filter(
        (p) => !(p.grantedBy === action.grantedBy && p.area === action.area)
      );
      const permissions =
        action.scope === "NONE"
          ? others
          : [
              ...others,
              {
                grantedTo: action.memberId,
                grantedBy: action.grantedBy,
                area: action.area,
                scope: action.scope,
                itemIds: action.scope === "SELECTED" ? action.itemIds ?? [] : [],
              },
            ];
      return { ...state, people: { ...state.people, [member.id]: { ...member, permissions } } };
    }

    case "REVOKE_FAMILY_ACCESS": {
      const member = state.people[action.memberId];
      if (!member) return state;
      const permissions = (member.permissions ?? []).filter((p) => p.grantedBy !== action.grantedBy);
      return { ...state, people: { ...state.people, [member.id]: { ...member, permissions } } };
    }

    case "ADD_FAMILY_MEMBER":
      if (state.people[action.person.id]) return state;
      return { ...state, people: { ...state.people, [action.person.id]: { ...action.person, permissions: [] } } };

    case "SET_REQUEST_SHARING":
      return updateRequest(state, action.requestId, (request) => {
        if (request.createdBy !== action.actorId) return request;
        const has = request.sharedWith.includes(action.personId);
        if (has === action.shared) return request;
        const name = state.people[action.personId]?.name ?? "household member";
        return appendHistory(
          {
            ...request,
            sharedWith: action.shared
              ? [...request.sharedWith, action.personId]
              : request.sharedWith.filter((id) => id !== action.personId),
          },
          {
            actorId: action.actorId,
            action: action.shared ? `Shared with ${name}` : `Stopped sharing with ${name}`,
          }
        );
      });

    case "ASK_TO_SHARE": {
      const requester = state.people[action.requesterId];
      if (!requester) return state;
      const area = action.area.replace(/_/g, " ").toLowerCase();
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: newHistoryId().replace("H-", "N-"),
            recipientId: action.ownerId,
            type: "FAMILY_REQUEST",
            text: `${requester.name} asked to see ${area}. Review in Family Circle — you decide.`,
            linkScreenId: "family",
            read: false,
            at: new Date().toISOString(),
          },
        ],
      };
    }

    case "FAMILY_PAY": {
      const payer = state.people[action.payerId];
      const request = state.requests[action.requestId];
      if (!payer || !request || !familyCanPay(request, payer)) return state;
      return updateRequest(state, action.requestId, (r) =>
        appendHistory(
          {
            ...r,
            status: "PAID",
            payment: { ...r.payment, status: "PAID_SIMULATED", amount: r.price.final, payerId: payer.id },
          },
          {
            actorId: payer.id,
            action: `Paid by ${payer.name} (family payer, demo)`,
            from: r.status,
            to: "PAID",
          }
        )
      );
    }

    // ---- Events / tickets: their own model (TicketBooking), not ServiceRequests ----
    case "BOOK_EVENT": {
      const event = state.events[action.eventId];
      const n = action.attendeeIds.length;
      if (!event || event.status !== "ON_SALE" || event.bookingType === "PARTNER") return state;
      if (n < 1 || event.seatsLeft < n) return state;
      // One active booking per person per event: never a duplicate.
      const already = Object.values(state.tickets).some(
        (t) =>
          t.eventId === event.id &&
          t.status !== "CANCELLED_BY_MEMBER" &&
          t.status !== "CANCELLED_BY_ORGANISER" &&
          t.attendees.some((a) => action.attendeeIds.includes(a))
      );
      if (already) return state;
      const ticketId = `TK-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`;
      const free = action.total === 0;
      const at = new Date().toISOString();
      const names = action.attendeeIds.map((id) => state.people[id]?.name.split(" ")[0] ?? "Guest");
      return {
        ...state,
        events: {
          ...state.events,
          [event.id]: { ...event, seatsLeft: event.seatsLeft - n, status: event.seatsLeft - n === 0 ? "SOLD_OUT" : event.status },
        },
        tickets: {
          ...state.tickets,
          [ticketId]: {
            id: ticketId,
            eventId: event.id,
            bookedBy: action.bookedBy,
            attendees: action.attendeeIds,
            seats: action.seats,
            status: "CONFIRMED",
            payment: free
              ? { status: "NOT_DUE", amount: 0, payerId: action.bookedBy, method: "Demo payment" }
              : { status: "PAID_SIMULATED", amount: action.total, payerId: action.bookedBy, method: "Demo payment" },
            source: event.bookingType === "ASSOCIATION" ? "ASSOCIATION" : "SENIORG_DEMO",
            inCalendarFor: [],
            createdAt: at,
          },
        },
        notifications: [
          ...state.notifications,
          ...action.attendeeIds
            .filter((id) => id !== action.bookedBy)
            .map((id) => ({
              id: newHistoryId().replace("H-", "N-"),
              recipientId: id,
              type: "EVENT_CHANGE" as const,
              text: `${state.people[action.bookedBy]?.name ?? "Your spouse"} booked ${event.title} for ${names.join(" and ")}.`,
              linkScreenId: "event",
              linkEntityId: event.id,
              read: false,
              at,
            })),
        ],
      };
    }

    case "ADD_TO_CALENDAR": {
      const t = state.tickets[action.ticketId];
      if (!t || !t.attendees.includes(action.personId) || t.inCalendarFor.includes(action.personId)) return state;
      return {
        ...state,
        tickets: {
          ...state.tickets,
          [t.id]: { ...t, status: "IN_CALENDAR", inCalendarFor: [...t.inCalendarFor, action.personId] },
        },
      };
    }

    case "INVITE_TO_EVENT": {
      const t = state.tickets[action.ticketId];
      const event = t ? state.events[t.eventId] : undefined;
      if (!t || !event || t.attendees.includes(action.personId) || event.seatsLeft < 1) return state;
      if (t.status === "CANCELLED_BY_MEMBER" || t.status === "CANCELLED_BY_ORGANISER") return state;
      // The spouse must not already hold their own booking for this event.
      const spouseBooked = Object.values(state.tickets).some(
        (x) =>
          x.eventId === event.id &&
          x.status !== "CANCELLED_BY_MEMBER" &&
          x.status !== "CANCELLED_BY_ORGANISER" &&
          x.attendees.includes(action.personId)
      );
      if (spouseBooked) return state;
      const price = event.priceFrom;
      return {
        ...state,
        events: {
          ...state.events,
          [event.id]: { ...event, seatsLeft: event.seatsLeft - 1, status: event.seatsLeft - 1 === 0 ? "SOLD_OUT" : event.status },
        },
        tickets: {
          ...state.tickets,
          [t.id]: {
            ...t,
            attendees: [...t.attendees, action.personId],
            seats: [...t.seats, "Standard"],
            payment: t.payment.status === "PAID_SIMULATED"
              ? { ...t.payment, amount: (t.payment.amount ?? 0) + price }
              : t.payment,
          },
        },
        notifications: [
          ...state.notifications,
          {
            id: newHistoryId().replace("H-", "N-"),
            recipientId: action.personId,
            type: "EVENT_CHANGE",
            text: `${state.people[action.actorId]?.name ?? "Your spouse"} added you to ${event.title}.`,
            linkScreenId: "event",
            linkEntityId: event.id,
            read: false,
            at: new Date().toISOString(),
          },
        ],
      };
    }

    case "CANCEL_TICKET": {
      const t = state.tickets[action.ticketId];
      const event = t ? state.events[t.eventId] : undefined;
      if (!t || !event || t.bookedBy !== action.actorId) return state;
      if (t.status === "CANCELLED_BY_MEMBER" || t.status === "CANCELLED_BY_ORGANISER") return state;
      return {
        ...state,
        events: {
          ...state.events,
          [event.id]: {
            ...event,
            seatsLeft: event.seatsLeft + t.attendees.length,
            status: event.status === "SOLD_OUT" ? "ON_SALE" : event.status,
          },
        },
        tickets: {
          ...state.tickets,
          [t.id]: {
            ...t,
            status: "CANCELLED_BY_MEMBER",
            payment: t.payment.status === "PAID_SIMULATED" ? { ...t.payment, status: "REFUNDED" } : t.payment,
          },
        },
      };
    }

    case "JOIN_WAITLIST": {
      const event = state.events[action.eventId];
      if (!event || event.status !== "SOLD_OUT" || event.waitlist.includes(action.personId)) return state;
      return {
        ...state,
        events: { ...state.events, [event.id]: { ...event, waitlist: [...event.waitlist, action.personId] } },
      };
    }

    case "TOGGLE_SAVE_EVENT": {
      const event = state.events[action.eventId];
      if (!event) return state;
      return { ...state, events: { ...state.events, [event.id]: { ...event, saved: !event.saved } } };
    }

    // ---- Smart Minutes: one curated record per video, per-person saved/watched lists ----
    case "TOGGLE_SAVE_VIDEO": {
      const video = state.videos[action.videoId];
      if (!video) return state;
      const has = video.savedBy.includes(action.personId);
      return {
        ...state,
        videos: {
          ...state.videos,
          [video.id]: {
            ...video,
            savedBy: has ? video.savedBy.filter((id) => id !== action.personId) : [...video.savedBy, action.personId],
          },
        },
      };
    }

    case "TOGGLE_VIDEO_WATCHED": {
      const video = state.videos[action.videoId];
      if (!video) return state;
      const has = video.watchedBy.includes(action.personId);
      return {
        ...state,
        videos: {
          ...state.videos,
          [video.id]: {
            ...video,
            watchedBy: has ? video.watchedBy.filter((id) => id !== action.personId) : [...video.watchedBy, action.personId],
          },
        },
      };
    }

    case "SHARE_VIDEO": {
      const video = state.videos[action.videoId];
      const from = state.people[action.fromId];
      if (!video || !from || !state.people[action.toId] || action.toId === action.fromId) return state;
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: newHistoryId().replace("H-", "N-"),
            recipientId: action.toId,
            type: "SMART_MINUTE",
            text: `${from.name} shared a Smart Minute with you: ${video.title}.`,
            linkScreenId: "smart-minute",
            linkEntityId: video.id,
            read: false,
            at: new Date().toISOString(),
          },
        ],
      };
    }

    // Quick-started home-repair requests (Services hub: electrical, plumbing, ...) have no
    // provider yet. This stands in for SeniorG finding and confirming a professional.
    case "MATCH_PROVIDER": {
      const current = state.requests[action.requestId];
      if (!current || current.status !== "REQUESTED" || current.providerId) return state;
      const service = state.services[current.serviceId];
      const repairers = Object.values(state.providers).filter((p) => p.type === "REPAIR" && p.available);
      const skill = (service?.name ?? "").toLowerCase();
      const provider =
        repairers.find((p) => p.skills.some((s) => skill.includes(s.toLowerCase()) || s.toLowerCase().includes(skill))) ??
        repairers[0];
      if (!provider) return state;
      const tomorrow = new Date(new Date(seed.DEMO_TODAY).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      let next = updateRequest(state, action.requestId, (r) => {
        let u: ServiceRequest = {
          ...r,
          providerId: provider.id,
          arrivalCode: r.arrivalCode ?? String(Math.floor(1000 + Math.random() * 9000)),
          schedule: r.schedule?.date ? r.schedule : { date: tomorrow, slot: "Morning · 9 am–12 pm" },
          status: "MATCHED",
        };
        u = appendHistory(u, { actorId: action.actorId, action: `Matched with ${provider.name}`, from: "REQUESTED", to: "MATCHED" });
        u = { ...u, status: "CONFIRMED" };
        return appendHistory(u, { actorId: action.actorId, action: "Booking confirmed", from: "MATCHED", to: "CONFIRMED" });
      });
      return next;
    }

    // Onboarding personalises the principal member's own account (name, city,
    // preferred help language) and switches the view to them. Nothing else in
    // the household, request or permission model changes.
    case "COMPLETE_ONBOARDING": {
      const { profile } = action;
      const person = state.people[profile.personId];
      if (!person) return state;
      const name = profile.name.trim() || person.name;
      const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]!.toUpperCase())
        .join("");
      const prefs = person.preferences;
      return {
        ...state,
        onboarding: profile,
        currentRoleId: profile.personId,
        people: {
          ...state.people,
          [person.id]: {
            ...person,
            name,
            avatarInitials: initials || person.avatarInitials,
            city: profile.city,
            preferences: prefs
              ? { ...prefs, languages: [profile.language, ...prefs.languages.filter((l) => l !== profile.language)] }
              : prefs,
          },
        },
      };
    }

    case "RESET_DEMO":
      return makeInitialState();

    default:
      return state;
  }
}
