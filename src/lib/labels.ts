import type { PaymentStatus, TicketStatus, ReminderStatus } from "@/types/entities";

// Human words for every enum the UI can show. Nothing raw should ever reach the screen.
export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  NOT_DUE: "Not due yet",
  DUE: "Payment due",
  PAID_SIMULATED: "Paid (demo)",
  PARTIAL: "Part paid",
  REFUND_PENDING: "Refund on its way",
  REFUNDED: "Refunded (demo)",
};

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  SEATS_HELD: "Seats held",
  CONFIRMED: "Confirmed",
  IN_CALENDAR: "Confirmed · in your calendar",
  ATTENDED: "Attended",
  CANCELLED_BY_MEMBER: "Cancelled by you",
  CANCELLED_BY_ORGANISER: "Cancelled by the organiser",
};

export function reminderStatusLabel(status: ReminderStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
}
