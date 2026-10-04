import { CalendarCheck, MapPin, Accessibility } from "lucide-react";
import { MediaTile } from "@/components/ds/MediaTile";
import { BookingTypeBadge } from "@/components/ui/BookingTypeBadge";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { categoryMeta, priceLabel, seatsLabel, ticketFor } from "@/lib/events";
import { eventImage } from "@/lib/imagery";
import { formatShortDateTime } from "@/lib/date";
import type { SeniorGEvent } from "@/types/entities";
import { Photo } from "@/components/ds/Photo";

export function EventVisual({ event, tall }: { event: SeniorGEvent; tall?: boolean }) {
  return <Photo slot={eventImage(event)} className={tall ? "h-56 sm:h-80" : "h-28"} />;
}

// An event as a discovery tile: the place first, then what, when, where, cost.
export function EventCard({ event }: { event: SeniorGEvent }) {
  const { state } = useStore();
  const person = useCurrentPerson();
  const ticket = person ? ticketFor(state.tickets, event.id, person.id) : undefined;
  const meta = categoryMeta(event.category);

  return (
    <MediaTile
      slot={eventImage(event)}
      to={`/explore/${event.id}`}
      badge={<BookingTypeBadge type={event.bookingType} />}
      eyebrow={meta.label}
      title={event.title}
      meta={
        <span className="space-y-0.5">
          <span className="block">{formatShortDateTime(event.dateTime)}</span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0" /> {event.locality} · {event.distanceKm} km
          </span>
          <span className="flex items-center gap-1.5 text-ink-3">
            <Accessibility size={14} className="shrink-0" /> {event.accessibility.stepFree ? "Step-free entry" : "Steps involved"}
          </span>
        </span>
      }
      footer={
        <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
          <span className="font-semibold text-ink">{priceLabel(event).replace(" (illustrative demo price)", "")}</span>
          {ticket ? (
            <span className="inline-flex items-center gap-1 text-body-sm font-semibold text-success">
              <CalendarCheck size={16} /> {event.bookingType === "ASSOCIATION" ? "Registered" : "Booked"}
            </span>
          ) : event.status === "SOLD_OUT" ? (
            <span className="text-body-sm font-semibold text-needs">Sold out</span>
          ) : (
            <span className="text-meta text-ink-3">{seatsLabel(event)}</span>
          )}
        </div>
      }
    />
  );
}
