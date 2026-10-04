import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CalendarCheck, CalendarPlus, CheckCircle2, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ds/Photo";
import { eventImage } from "@/lib/imagery";
import { motion } from "framer-motion";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { ComingSoon } from "@/components/ComingSoon";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { ticketFor, priceLabel } from "@/lib/events";
import { formatShortDateTime } from "@/lib/date";

type Step = "choose" | "review" | "done";

// Booking / registration for events that SeniorG can book (SENIORG or
// ASSOCIATION). It creates a TicketBooking, not a ServiceRequest.
export function EventBooking() {
  const { eventId } = useParams();
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const event = eventId ? state.events[eventId] : undefined;
  const [step, setStep] = useState<Step>("choose");
  const [withSpouse, setWithSpouse] = useState(false);
  const [premium, setPremium] = useState(false);
  const [aisle, setAisle] = useState(false);

  if (!event || !person) return <ComingSoon title="Event not found" note="It may have been reset with the demo." />;
  if (event.bookingType === "PARTNER" || event.status !== "ON_SALE") {
    // Partner events are booked externally; sold-out events use the waitlist.
    const existing = ticketFor(state.tickets, event.id, person.id);
    if (!existing) return <Navigate to={`/explore/${event.id}`} replace />;
  }

  const ticket = ticketFor(state.tickets, event.id, person.id);
  const spouseId = state.household.memberIds.find((id) => id !== person.id);
  const spouse = spouseId ? state.people[spouseId] : undefined;
  const spouseHasOwn = !!spouse && !!ticketFor(state.tickets, event.id, spouse.id);
  const canBringSpouse = !!spouse && !spouseHasOwn && event.seatsLeft >= 2;
  const free = event.priceFrom === 0 && event.priceTo === 0;
  const tiers = event.priceFrom !== event.priceTo;
  const unit = premium ? event.priceTo : event.priceFrom;
  const count = withSpouse && canBringSpouse ? 2 : 1;
  const total = unit * count;
  const verb = event.bookingType === "ASSOCIATION" ? "Register" : free ? "Join" : "Book";
  const tierName = tiers ? (premium ? "Preferred" : "Standard") : "Standard";
  const seatLabel = `${tierName}${aisle && event.accessibility.aisleSeats ? " · aisle" : ""}`;

  function confirm() {
    const attendeeIds = count === 2 && spouse ? [person!.id, spouse.id] : [person!.id];
    dispatch({
      type: "BOOK_EVENT",
      eventId: event!.id,
      bookedBy: person!.id,
      attendeeIds,
      seats: attendeeIds.map(() => seatLabel),
      total,
    });
    setStep("done");
  }

  if (ticket || step === "done") {
    const inCalendar = !!ticket && ticket.inCalendarFor.includes(person.id);
    const spouseAttending = !!spouse && !!ticket && ticket.attendees.includes(spouse.id);
    return (
      <div className="space-y-6">
        <FadeInSection className="space-y-3 text-center">
          <div className="relative -mx-gutter overflow-hidden sm:mx-0 sm:rounded-card">
            <Photo slot={eventImage(event)} className="h-40 sm:h-56" rounded="rounded-none" eager />
            <div className="absolute inset-0 bg-brand-deep/30" />
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-success text-white shadow-lift"
            >
              <CheckCircle2 size={44} />
            </motion.span>
          </div>
          <h1 className="pt-2 font-serif text-title text-ink sm:text-display">
            {event.bookingType === "ASSOCIATION" ? "You're registered" : free ? "You're in" : "You're booked"}
          </h1>
          <p className="text-body-sm text-ink-2">{event.title}</p>
          <p className="text-body-sm text-ink-2">{formatShortDateTime(event.dateTime)} · {event.venue}</p>
        </FadeInSection>
        {ticket && (
          <Card className="space-y-1">
            <p className="tabular text-meta text-ink-3">{ticket.id}</p>
            <p className="font-semibold text-ink">
              {ticket.attendees.map((id) => state.people[id]?.name).join(" & ")}
            </p>
            <p className="text-body-sm text-ink-2">
              {ticket.seats.join(", ")} ·{" "}
              {ticket.payment.status === "PAID_SIMULATED" ? `Paid ₹${ticket.payment.amount} (demo)` : "No payment needed"}
            </p>
          </Card>
        )}
        <div className="space-y-2">
          {ticket && (inCalendar ? (
            <p className="flex items-center justify-center gap-2 text-body-sm font-semibold text-success">
              <CalendarCheck size={18} /> Added to your calendar
            </p>
          ) : (
            <Button fullWidth onClick={() => dispatch({ type: "ADD_TO_CALENDAR", ticketId: ticket.id, personId: person.id })}>
              <CalendarPlus size={18} /> Add to my calendar
            </Button>
          ))}
          {ticket && spouse && !spouseAttending && !spouseHasOwn && event.seatsLeft > 0 && (
            <Button
              variant="secondary"
              fullWidth
              onClick={() => dispatch({ type: "INVITE_TO_EVENT", ticketId: ticket.id, personId: spouse.id, actorId: person.id })}
            >
              <UserPlus size={18} /> Invite {spouse.name.split(" ")[0]}
            </Button>
          )}
          {ticket && spouseAttending && spouse && (
            <p className="flex items-center justify-center gap-2 text-body-sm font-semibold text-success">
              <CheckCircle2 size={18} /> {spouse.name.split(" ")[0]} is coming too
            </p>
          )}
          <Link to={`/explore/${event.id}`} className="block">
            <Button variant="secondary" fullWidth>
              View event
            </Button>
          </Link>
          <Link to="/explore" className="block">
            <Button variant="text" fullWidth>
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeInSection>
        <p className="text-body-sm font-semibold text-brand-dark">
          Step {step === "choose" ? 1 : 2} of 2 · {verb === "Register" ? "Registration" : "Booking"}
        </p>
        <h1 className="font-serif text-title text-ink">{event.title}</h1>
        <p className="text-body-sm text-ink-2">{formatShortDateTime(event.dateTime)} · {event.locality}</p>
      </FadeInSection>

      {step === "choose" && (
        <FadeInSection className="space-y-5">
          <div className="space-y-2">
            <p className="font-semibold text-ink">Who is coming?</p>
            <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Who is coming">
              <button
                aria-pressed={!withSpouse}
                onClick={() => setWithSpouse(false)}
                className={["rounded-card border p-4 text-left font-semibold", !withSpouse ? "border-brand bg-brand-tint text-brand-dark" : "border-card-border text-ink"].join(" ")}
              >
                Just me
              </button>
              <button
                aria-pressed={withSpouse}
                disabled={!canBringSpouse}
                onClick={() => setWithSpouse(true)}
                className={["rounded-card border p-4 text-left font-semibold disabled:opacity-50", withSpouse ? "border-brand bg-brand-tint text-brand-dark" : "border-card-border text-ink"].join(" ")}
              >
                Me + {spouse?.name.split(" ")[0] ?? "spouse"}
                {!canBringSpouse && (
                  <span className="block text-meta font-normal text-ink-2">
                    {spouseHasOwn ? "Already coming" : "Not enough seats"}
                  </span>
                )}
              </button>
            </div>
          </div>
          {tiers && (
            <div className="space-y-2">
              <p className="font-semibold text-ink">Seat type</p>
              <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Seat type">
                {[
                  { v: false, label: "Standard", price: event.priceFrom },
                  { v: true, label: "Preferred", price: event.priceTo },
                ].map((o) => (
                  <button
                    key={o.label}
                    aria-pressed={premium === o.v}
                    onClick={() => setPremium(o.v)}
                    className={["rounded-card border p-4 text-left font-semibold", premium === o.v ? "border-brand bg-brand-tint text-brand-dark" : "border-card-border text-ink"].join(" ")}
                  >
                    {o.label}
                    <span className="block text-meta font-normal text-ink-2">₹{o.price} each (illustrative demo price)</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {event.accessibility.aisleSeats && (
            <label className="flex items-center gap-3 text-body-sm text-ink">
              <input type="checkbox" checked={aisle} onChange={(e) => setAisle(e.target.checked)} className="h-5 w-5" />
              Prefer an aisle seat
            </label>
          )}
          <Button fullWidth onClick={() => setStep("review")}>
            Continue
          </Button>
          <Link to={`/explore/${event.id}`} className="block">
            <Button variant="text" fullWidth>
              Back to event
            </Button>
          </Link>
        </FadeInSection>
      )}

      {step === "review" && (
        <FadeInSection className="space-y-4">
          <Card className="space-y-2">
            <p className="text-subhead text-ink">Review</p>
            <div className="flex justify-between text-body-sm text-ink">
              <span>Who</span>
              <span className="font-semibold">
                {count === 2 && spouse ? `${person.name.split(" ")[0]} & ${spouse.name.split(" ")[0]}` : person.name.split(" ")[0]}
              </span>
            </div>
            <div className="flex justify-between text-body-sm text-ink">
              <span>Seats</span>
              <span className="font-semibold">
                {count} × {seatLabel}
              </span>
            </div>
            <div className="flex justify-between text-body-sm text-ink">
              <span>Total</span>
              <span className="font-semibold">{free ? "Free" : `₹${total} (illustrative demo price)`}</span>
            </div>
            <p className="text-meta text-ink-3">
              {free
                ? "No payment is needed. You can cancel any time before the event."
                : "Payment is simulated. No card, PIN or OTP is asked. You can cancel before the event for a refund (demo)."}
            </p>
            <p className="text-meta text-ink-3">{priceLabel(event) === "Free" ? "" : "Prices are illustrative, not SeniorG tariffs."}</p>
          </Card>
          <Button fullWidth onClick={confirm}>
            {free ? `${verb} now` : `Pay ₹${total} (demo) and confirm`}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setStep("choose")}>
            Edit
          </Button>
        </FadeInSection>
      )}
    </div>
  );
}
