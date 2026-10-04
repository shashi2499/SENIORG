import type { Dispatch } from "react";
import type { Person, Reminder, ServiceRequest } from "@/types/entities";
import type { Action } from "@/store/types";
import { buildDeskRequestFromReminder } from "./requestFactory";

// The single "Help me with this" implementation — used by the reminder
// detail page today. Creates one real ServiceRequest (owner DESK from the
// start, since there's no self-serve stage to hand over from) and links it
// back onto the reminder, so there is exactly one place this logic lives
// and no risk of a second request being created for the same reminder.
export function assistWithReminder(dispatch: Dispatch<Action>, reminder: Reminder, person: Person): ServiceRequest {
  const request = buildDeskRequestFromReminder(reminder, person);
  dispatch({ type: "CREATE_REQUEST", request, actorId: person.id });
  dispatch({
    type: "SET_REMINDER_STATUS",
    reminderId: reminder.id,
    status: "ASSISTED",
    linkedRequestId: request.id,
  });
  return request;
}
