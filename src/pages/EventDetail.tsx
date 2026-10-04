import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bookmark,
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  MinusCircle,
  MapPin,
  Clock,
  Languages,
  Building2,
  Car,
  Armchair,
  UserRound,
  ExternalLink,
  UserPlus,
  Ticket,
  CalendarX2,
  BadgeIndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { ConfirmSheet } from "@/components/ds/ConfirmSheet";
import { BookingTypeBadge } from "@/components/ui/BookingTypeBadge";
import { ScopeTag } from "@/components/ui/ScopeTag";
import { Photo } from "@/components/ds/Photo";
import { EmptyState, DemoTag } from "@/components/ds/States";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { actionLabel, categoryMeta, priceLabel, seatsLabel, ticketFor } from "@/lib/events";
import { eventImage } from "@/lib/imagery";
import { formatLongDate } from "@/lib/date";

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}
function duration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h ? `${h} h` : "", m ? `${m} min` : ""].filter(Boolean).join(" ");
}

export function EventDetail() {
  const { eventId } = useParams();
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const [partnerStep, setPartnerStep] = useState<null | "leaving" | "demo">(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const event = eventId ? state.events[eventId] : undefined;

  if (!event || !person) {
    return <EmptyState title="We can't find that event" body="It may have been cleared when the demo was reset." action={{ label: "Back to Explore", onClick: () => navigate("/explore") }} />;
  }

  const meta = categoryMeta(event.category);
  const ticket = ticketFor(state.tickets, event.id, person.id);
  const spouseId = state.household.memberIds.find((id) => id !== person.id);
  const spouse = spouseId ? state.people[spouseId] : undefined;
  const spouseAttending = !!spouse && !!ticket && ticket.attendees.includes(spouse.id);
  const spouseHasOwn = !!spouse && !!ticketFor(state.tickets, event.id, spouse.id);
  const inCalendar = !!ticket && ticket.inCalendarFor.includes(person.id);
  const isFree = event.priceFrom === 0 && event.priceTo === 0;
  const a = event.accessibility;
  const onWaitlist = event.waitlist.includes(person.id);
  const verb = event.bookingType === "ASSOCIATION" ? "registered" : isFree ? "in" : "booked";

  const bookingCard = (
    <div className="rounded-card border border-card-border bg-card p-5 shadow-lift lg:sticky lg:top-24">
      {ticket ? (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success text-white">
              <CalendarCheck size={22} />
            </span>
            <div>
              <p className="font-serif text-section leading-tight text-ink">You're {verb}</p>
              <p className="text-body-sm text-ink-2">{ticket.attendees.map((id) => state.people[id]?.name.split(" ")[0]).join(" & ")}</p>
            </div>
          </div>
          <dl className="space-y-1 rounded-tile bg-sand p-4 text-body-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-2">{ticket.source === "ASSOCIATION" ? "Registration" : "Ticket"}</dt>
              <dd className="tabular font-semibold text-ink">{ticket.id}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-2">Seats</dt>
              <dd className="text-right font-semibold text-ink">{ticket.seats.join(", ")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-2">Payment</dt>
              <dd className="font-semibold text-ink">{ticket.payment.status === "PAID_SIMULATED" ? `₹${ticket.payment.amount} paid (demo)` : "Nothing to pay"}</dd>
            </div>
          </dl>
          {inCalendar ? (
            <p className="flex items-center gap-2 font-semibold text-success">
              <CheckCircle2 size={20} /> In your calendar
            </p>
          ) : (
            <Button fullWidth onClick={() => dispatch({ type: "ADD_TO_CALENDAR", ticketId: ticket.id, personId: person.id })}>
              <CalendarPlus size={20} /> Add to my calendar
            </Button>
          )}
          {spouse && !spouseAttending && !spouseHasOwn && event.seatsLeft > 0 && (
            <Button variant="secondary" fullWidth onClick={() => dispatch({ type: "INVITE_TO_EVENT", ticketId: ticket.id, personId: spouse.id, actorId: person.id })}>
              <UserPlus size={20} /> Invite {spouse.name.split(" ")[0]}
            </Button>
          )}
          {spouseAttending && spouse && (
            <p className="flex items-center gap-2 text-body-sm font-semibold text-success">
              <CheckCircle2 size={18} /> {spouse.name.split(" ")[0]} is coming too
            </p>
          )}
          <Link to="/services/go-with-me/book" className="flex items-center gap-2 text-body-sm font-semibold text-brand-dark hover:underline">
            <Car size={17} /> Arrange someone to go with you
          </Link>
          {ticket.bookedBy === person.id && (
            <button onClick={() => setConfirmCancel(true)} className="flex min-h-[44px] items-center gap-2 text-body-sm font-semibold text-critical hover:underline">
              <CalendarX2 size={17} /> Cancel {event.bookingType === "ASSOCIATION" ? "registration" : "booking"}
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-body-sm text-ink-2">{isFree ? "Price" : "From"}</p>
            <p className="tabular font-serif text-title text-ink">{isFree ? "Free" : `₹${event.priceFrom}`}</p>
            {!isFree && <p className="text-meta text-ink-3">Illustrative demo price{event.priceTo !== event.priceFrom ? ` · up to ₹${event.priceTo}` : ""}</p>}
            <p className={["mt-1 text-body-sm font-semibold", event.status === "SOLD_OUT" ? "text-needs" : event.seatsLeft <= 10 ? "text-needs" : "text-ink-2"].join(" ")}>{seatsLabel(event)}</p>
          </div>
          {event.status === "SOLD_OUT" ? (
            onWaitlist ? (
              <p className="flex items-center gap-2 rounded-tile bg-success-tint p-3 text-body-sm font-semibold text-success">
                <CheckCircle2 size={18} /> You're on the waitlist. We'll tell you if a seat opens.
              </p>
            ) : (
              <>
                <Button fullWidth onClick={() => dispatch({ type: "JOIN_WAITLIST", eventId: event.id, personId: person.id })}>
                  Join the waitlist
                </Button>
                <Button variant="secondary" fullWidth onClick={() => navigate("/explore")}>
                  See similar events
                </Button>
              </>
            )
          ) : event.status === "CANCELLED" ? (
            <p className="text-body-sm text-ink-2">This event was cancelled by the organiser.</p>
          ) : event.bookingType === "PARTNER" ? (
            <>
              <Button fullWidth onClick={() => setPartnerStep("leaving")}>
                <ExternalLink size={20} /> Continue with partner
              </Button>
              <p className="text-meta text-ink-3">Booked on {event.partnerName}'s own site. Their terms apply.</p>
            </>
          ) : (
            <>
              <Button fullWidth onClick={() => navigate(`/explore/${event.id}/book`)}>
                <Ticket size={20} /> {actionLabel(event)}
              </Button>
              {spouse && <p className="text-meta text-ink-3">You can add {spouse.name.split(" ")[0]} on the next step.</p>}
            </>
          )}
          <button
            onClick={() => dispatch({ type: "TOGGLE_SAVE_EVENT", eventId: event.id })}
            aria-pressed={event.saved}
            className="flex min-h-[44px] items-center gap-2 text-body-sm font-semibold text-brand-dark hover:underline"
          >
            <Bookmark size={18} className={event.saved ? "fill-brand text-brand" : ""} /> {event.saved ? "Saved" : "Save for later"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="-mx-gutter sm:mx-0">
        <div className="relative overflow-hidden sm:rounded-card">
          <Photo slot={eventImage(event)} className="h-64 sm:h-96" rounded="rounded-none" eager />
          <div className="scrim-bottom absolute inset-0" />
          <div className="absolute left-gutter top-4 flex gap-2 sm:left-6 sm:top-6">
            <BookingTypeBadge type={event.bookingType} />
            <ScopeTag tag={event.scopeTag} />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-gutter text-white sm:p-8">
            <p className="text-body-sm font-semibold text-accent">{meta.label}</p>
            <h1 className="mt-1 max-w-2xl text-balance font-serif text-title leading-tight text-white sm:text-display">{event.title}</h1>
            <p className="mt-2 text-body-sm text-white/85">by {event.organiser}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 space-y-8 lg:order-1">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Fact icon={Clock} label={formatLongDate(event.dateTime)} value={`${timeOf(event.dateTime)} · ${duration(event.durationMin)}`} />
            <Fact icon={MapPin} label={`${event.locality} · ${event.distanceKm} km away`} value={event.venue} />
            <Fact icon={BadgeIndianRupee} label="Price" value={priceLabel(event).replace(" (illustrative demo price)", "")} />
          </dl>

          <section>
            <p className="max-w-reading text-body text-ink">{event.description}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-ink-2">
              {event.language && (
                <span className="inline-flex items-center gap-1.5">
                  <Languages size={16} /> {event.language}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={16} /> {event.organiser}
              </span>
              {event.goodForCouples && (
                <span className="inline-flex items-center gap-1.5">
                  <UserRound size={16} /> Good for couples
                </span>
              )}
            </div>
          </section>

          <section className="rounded-card bg-sand p-5 sm:p-6">
            <h2 className="font-serif text-section text-ink">Getting there and getting in</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <Practical ok={a.stepFree}>{a.stepFree ? "Step-free entry" : "Steps at the entrance or on the route"}</Practical>
              <Practical ok={a.lift}>{a.lift ? "Lift available" : "No lift"}</Practical>
              <Practical ok={a.accessibleToilet}>{a.accessibleToilet ? "Accessible washroom" : "No accessible washroom"}</Practical>
              <Practical ok={a.aisleSeats}>{a.aisleSeats ? "Aisle seats can be chosen" : "No aisle seat choice"}</Practical>
            </ul>
            <dl className="mt-5 space-y-3 border-t border-line pt-5 text-body-sm">
              <Info icon={Armchair} label="Seating" value={event.practical.seating} />
              <Info icon={Car} label="Parking" value={event.practical.parking} />
              <Info icon={UserRound} label="Companion" value={event.practical.companion} />
            </dl>
          </section>

          <section className="flex items-start gap-3 rounded-card border border-card-border p-5">
            {event.bookingType === "PARTNER" ? <ExternalLink size={20} className="mt-0.5 shrink-0 text-ink-3" /> : <Ticket size={20} className="mt-0.5 shrink-0 text-brand" />}
            <div className="text-body-sm text-ink-2">
              {event.bookingType === "THROUGH_SENIORG" && (
                <>
                  <p className="font-semibold text-ink">Booked through SeniorG</p>
                  Seats are held for you in the app, with the desk to help if plans change. Payment is simulated in this demo.
                </>
              )}
              {event.bookingType === "PARTNER" && (
                <>
                  <p className="font-semibold text-ink">A partner event</p>
                  Sold by {event.partnerName}. You leave SeniorG to book; their terms and refunds apply, and SeniorG can't track or change that booking.
                </>
              )}
              {event.bookingType === "ASSOCIATION" && (
                <>
                  <p className="font-semibold text-ink">An association event</p>
                  {isFree ? "Free to attend. " : ""}Register here and the chapter will see your name. Spouses are welcome.
                </>
              )}
            </div>
          </section>
        </div>

        <div className="order-1 lg:order-2">{bookingCard}</div>
      </div>

      <ConfirmSheet
        open={confirmCancel}
        title={`Cancel this ${event.bookingType === "ASSOCIATION" ? "registration" : "booking"}?`}
        body={ticket?.payment.status === "PAID_SIMULATED" ? `Your ₹${ticket.payment.amount} will be refunded (demo) and the seats released.` : "Your seats will be released for someone else."}
        confirmLabel="Yes, cancel"
        cancelLabel="Keep it"
        tone="danger"
        onConfirm={() => {
          if (ticket) dispatch({ type: "CANCEL_TICKET", ticketId: ticket.id, actorId: person.id });
          setConfirmCancel(false);
        }}
        onCancel={() => setConfirmCancel(false)}
      />

      <Sheet open={partnerStep !== null} onClose={() => setPartnerStep(null)} title={partnerStep === "demo" ? "Partner page (demo)" : "You are leaving SeniorG"}>
        {partnerStep === "leaving" && (
          <div className="space-y-4">
            <p className="text-body text-ink">
              You're about to continue on <strong>{event.partnerName}</strong>, an external partner. Their prices, terms and refunds apply. SeniorG cannot track or change this booking.
            </p>
            <p className="text-body-sm text-ink-2">Demo: no real partner site is opened, and fictional partners are not SeniorG partners.</p>
            <Button fullWidth onClick={() => setPartnerStep("demo")}>
              <ExternalLink size={18} /> Continue (demo)
            </Button>
            <Button variant="quiet" fullWidth onClick={() => setPartnerStep(null)}>
              Stay on SeniorG
            </Button>
          </div>
        )}
        {partnerStep === "demo" && (
          <div className="space-y-4">
            <div className="rounded-card border-2 border-dashed border-ink/20 p-6 text-center">
              <DemoTag>External partner · simulated</DemoTag>
              <p className="mt-3 font-serif text-section text-ink">{event.partnerName}</p>
              <p className="mt-1 text-body-sm text-ink-2">{event.title}</p>
              <p className="mt-3 text-body-sm text-ink">This is a placeholder for the partner's own booking page.</p>
            </div>
            <p className="text-meta text-ink-3">Nothing was booked and no payment was made. Because this is a partner booking, it will not appear in your SeniorG plans.</p>
            <Button fullWidth onClick={() => setPartnerStep(null)}>
              Back to SeniorG
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-card border border-card-border bg-card p-4">
      <dt className="flex items-center gap-1.5 text-meta text-ink-3">
        <Icon size={15} /> {label}
      </dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Practical({ ok, children }: { ok: boolean; children: string }) {
  return (
    <li className="flex items-center gap-2.5 text-body-sm text-ink">
      {ok ? <CheckCircle2 size={20} className="shrink-0 text-success" aria-label="Yes" /> : <MinusCircle size={20} className="shrink-0 text-ink-3" aria-label="No" />}
      {children}
    </li>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-brand" />
      <div>
        <dt className="font-semibold text-ink">{label}</dt>
        <dd className="text-ink-2">{value}</dd>
      </div>
    </div>
  );
}
