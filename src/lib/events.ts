import {
  Clapperboard,
  Drama,
  Music,
  Mic,
  Wrench,
  HeartPulse,
  Footprints,
  Bus,
  Palette,
  Users,
  HandHeart,
  GraduationCap,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import type { Person, SeniorGEvent, TicketBooking } from "@/types/entities";

export interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  tint: string; // existing design tokens
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  FILM: { label: "Movies", icon: Clapperboard, tint: "bg-plum-tint text-plum" },
  THEATRE: { label: "Theatre", icon: Drama, tint: "bg-accent-tint text-warning" },
  MUSIC: { label: "Music", icon: Music, tint: "bg-indigo-tint text-indigo" },
  TALK: { label: "Talks", icon: Mic, tint: "bg-brand-tint text-brand-dark" },
  WORKSHOP: { label: "Workshops", icon: Wrench, tint: "bg-clay-tint text-clay" },
  WELLNESS: { label: "Wellness", icon: HeartPulse, tint: "bg-brand-tint text-brand-dark" },
  WALK: { label: "Walks", icon: Footprints, tint: "bg-accent-tint text-warning" },
  TRAVEL: { label: "Travel", icon: Bus, tint: "bg-indigo-tint text-indigo" },
  HOBBY: { label: "Hobbies", icon: Palette, tint: "bg-plum-tint text-plum" },
  ASSOCIATION: { label: "Association meets", icon: Landmark, tint: "bg-accent-tint text-warning" },
  MENTORING: { label: "Mentoring", icon: GraduationCap, tint: "bg-indigo-tint text-indigo" },
  VOLUNTEERING: { label: "Volunteering", icon: HandHeart, tint: "bg-clay-tint text-clay" },
};

export function categoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category] ?? { label: category, icon: Users, tint: "bg-ink/5 text-ink" };
}

export function priceLabel(event: SeniorGEvent): string {
  if (event.priceFrom === 0 && event.priceTo === 0) return "Free";
  if (event.priceFrom === event.priceTo) return `₹${event.priceFrom} (illustrative demo price)`;
  return `₹${event.priceFrom}–₹${event.priceTo} (illustrative demo price)`;
}

const INACTIVE: TicketBooking["status"][] = ["CANCELLED_BY_MEMBER", "CANCELLED_BY_ORGANISER"];

// A person's active booking for an event — as the booker or as an invited attendee.
export function ticketFor(
  tickets: Record<string, TicketBooking>,
  eventId: string,
  personId: string
): TicketBooking | undefined {
  return Object.values(tickets).find(
    (t) => t.eventId === eventId && !INACTIVE.includes(t.status) && t.attendees.includes(personId)
  );
}

export function myTickets(tickets: Record<string, TicketBooking>, person: Person): TicketBooking[] {
  return Object.values(tickets)
    .filter((t) => t.attendees.includes(person.id) || t.bookedBy === person.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function activeTickets(tickets: Record<string, TicketBooking>, person: Person): TicketBooking[] {
  return myTickets(tickets, person).filter((t) => !INACTIVE.includes(t.status) && t.attendees.includes(person.id));
}

export function seatsLabel(event: SeniorGEvent): string {
  if (event.status === "SOLD_OUT") return "Sold out";
  if (event.status === "CANCELLED") return "Cancelled";
  return event.seatsLeft <= 10 ? `Only ${event.seatsLeft} seats left` : `${event.seatsLeft} seats left`;
}

export function actionLabel(event: SeniorGEvent): string {
  if (event.bookingType === "PARTNER") return "Continue with partner";
  if (event.bookingType === "ASSOCIATION") return "Register";
  return event.priceFrom === 0 ? "Join" : "Book through SeniorG";
}
