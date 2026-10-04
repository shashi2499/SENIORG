import { Link } from "react-router-dom";
import { KeyRound, CalendarClock, Car, MapPin, Hourglass, CheckCircle2, ChevronRight, Headset, Search } from "lucide-react";
import type { ServiceRequest } from "@/types/entities";
import { Button } from "@/components/ui/Button";
import { AdditionalWorkCard } from "@/components/journey/AdditionalWorkCard";
import { CompletionProof } from "@/components/journey/CompletionProof";
import { PaymentCard } from "@/components/journey/PaymentCard";
import { RateAndClose } from "@/components/journey/RateAndClose";
import { DailyTracker } from "@/components/journey/DailyTracker";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { destinationOf, whenLabel } from "@/lib/presentation";

// What is happening right now, and the one thing (if any) for the person
// looking at it to do. Member-facing: no simulation controls live here.
export function StageNow({ request }: { request: ServiceRequest }) {
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  if (!person) return null;

  const isDesk = person.role === "COORDINATOR";
  const provider = request.providerId ? state.providers[request.providerId] : undefined;
  const first = provider?.name.split(" ")[0] ?? "The professional";
  const when = whenLabel(request);
  const s = request.status;

  const pay = () => {
    dispatch({ type: "SET_PAYMENT", requestId: request.id, payment: { status: "PAID_SIMULATED", amount: request.price.final }, actorId: person.id });
    dispatch({ type: "SET_STATUS", requestId: request.id, status: "PAID", actorId: person.id });
  };
  const close = (rating: number) => dispatch({ type: "CLOSE_REQUEST", requestId: request.id, actorId: person.id, rating });

  // ---- shared end states -------------------------------------------------
  if (s === "PAID") return <RateAndClose onClose={close} />;
  if (s === "CLOSED") return null;

  // ---- Help from SeniorG (reminder assistance) ----------------------------
  if (request.category === "REFERRAL") {
    const reminderId = request.linkedReminderId;
    const markDone = () => {
      dispatch({ type: "SET_STATUS", requestId: request.id, status: "COMPLETED", actorId: person.id });
      dispatch({ type: "SET_PAYMENT", requestId: request.id, payment: { status: "PAID_SIMULATED", amount: 0 }, actorId: person.id });
      dispatch({ type: "SET_STATUS", requestId: request.id, status: "PAID", actorId: person.id, note: "Nothing to pay for this one" });
      if (reminderId) dispatch({ type: "SET_REMINDER_STATUS", reminderId, status: "DONE" });
    };
    return (
      <div className="space-y-4">
        {reminderId && (
          <Link to={`/household/reminders/${reminderId}`} className="flex items-center gap-3 rounded-tile bg-sand px-4 py-3 text-body-sm hover:bg-sand-deep">
            <CalendarClock size={18} className="text-ink-3" />
            <span className="flex-1 text-ink-2">
              For your reminder: <strong className="font-semibold text-ink">{(request.details as { reminderTitle?: string })?.reminderTitle}</strong>
            </span>
            <ChevronRight size={18} className="text-ink-3" />
          </Link>
        )}
        {s === "REQUESTED" &&
          (isDesk ? (
            <Button
              fullWidth
              onClick={() => dispatch({ type: "SET_STATUS", requestId: request.id, status: "CONFIRMED", actorId: person.id, note: "Desk confirmed the plan" })}
            >
              <Headset size={20} /> Confirm the plan with the member
            </Button>
          ) : (
            <Waiting text="Priya from the SeniorG desk will call you to confirm the plan. You don't need to do anything yet." />
          ))}
        {s === "CONFIRMED" &&
          (isDesk ? (
            <Waiting text="The plan is confirmed. The member will mark it done once it's taken care of." />
          ) : (
            <Button fullWidth onClick={markDone}>
              <CheckCircle2 size={20} /> It's done — mark as complete
            </Button>
          ))}
      </div>
    );
  }

  // ---- payment (every booked service) -------------------------------------
  if (s === "COMPLETED") {
    return (
      <div className="space-y-5">
        {request.proof && <CompletionProof proof={request.proof} />}
        {request.dailyLog && request.dailyLog.length > 0 && <DailyTracker days={request.dailyLog} />}
        <PaymentCard amount={request.price.final ?? 0} onPay={pay} />
      </div>
    );
  }

  // ---- Home repairs ----------------------------------------------------------
  if (request.category === "HOME_REPAIR") {
    if (s === "REQUESTED" || s === "NO_PROVIDER_FOUND" || s === "REMATCHING") {
      return isDesk && s === "REQUESTED" && !request.providerId ? (
        <Button fullWidth onClick={() => dispatch({ type: "MATCH_PROVIDER", requestId: request.id, actorId: person.id })}>
          <Search size={20} /> Match a verified professional
        </Button>
      ) : (
        <Waiting text="SeniorG matches only ID-checked professionals. You'll see who is coming and when, before anyone visits." />
      );
    }
    if (s === "CONFIRMED" || s === "MATCHED") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Fact icon={CalendarClock} label="Visit" value={when ?? "To be confirmed"} />
          {request.arrivalCode && <Fact icon={KeyRound} label="Arrival code" value={request.arrivalCode} big hint={`${first} will say this at your door.`} />}
        </div>
      );
    }
    if (s === "PROVIDER_EN_ROUTE") {
      return (
        <div className="space-y-4">
          {request.arrivalCode && (
            <div className="rounded-card bg-sand p-5 text-center">
              <p className="text-body-sm text-ink-2">Arrival code</p>
              <p className="tabular mt-1 font-serif text-[3rem] leading-none tracking-[0.2em] text-ink">{request.arrivalCode}</p>
              <p className="mt-2 text-body-sm text-ink-2">Only open the door if {first} says this code.</p>
            </div>
          )}
          {!isDesk && (
            <Button fullWidth onClick={() => dispatch({ type: "TRIGGER_DEMO_EVENT", eventType: "PROVIDER_STARTS_WORK", requestId: request.id, actorId: person.id })}>
              <KeyRound size={20} /> The code matches — let {first} in
            </Button>
          )}
        </div>
      );
    }
    if (s === "IN_PROGRESS") return <Waiting text={`${first} is working. If anything extra is needed, you'll be asked first — nothing is added without your approval.`} />;
    if (s === "AWAITING_APPROVAL") {
      const pending = request.additionalWork.find((w) => w.status === "PENDING");
      if (!pending) return null;
      const limit = request.handoverScope?.approvalLimit;
      if (isDesk && !(limit != null && pending.amount <= limit)) {
        return <Waiting text={`Waiting for the member to approve ₹${pending.amount} for ${pending.description.toLowerCase()}. The desk has no authority to approve this amount.`} />;
      }
      return (
        <AdditionalWorkCard
          work={pending}
          providerFirst={first}
          currentTotal={(request.price.agreed ?? request.price.estimate ?? 0) + request.additionalWork.filter((w) => w.status === "APPROVED").reduce((t, w) => t + w.amount, 0)}
          onApprove={() => dispatch({ type: "APPROVE_ADDITIONAL_WORK", requestId: request.id, workId: pending.id, actorId: person.id })}
          onDecline={() => dispatch({ type: "DECLINE_ADDITIONAL_WORK", requestId: request.id, workId: pending.id, actorId: person.id })}
        />
      );
    }
  }

  // ---- Go With Me ------------------------------------------------------------
  if (request.category === "GO_WITH_ME") {
    const dest = destinationOf(request) === "hospital" ? "Hospital visit" : "Airport";
    const pickup = (request.details as { pickupAddress?: string })?.pickupAddress;
    if (s === "CONFIRMED" || s === "MATCHED") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Fact icon={CalendarClock} label="Pick-up" value={when ?? "To be confirmed"} />
          <Fact icon={MapPin} label="Going to" value={dest} hint={pickup ? `From ${pickup}` : undefined} />
        </div>
      );
    }
    const words: Partial<Record<string, string>> = {
      COMPANION_EN_ROUTE: `${first} is on the way. You'll get a call when ${first} is at the gate.`,
      PICKED_UP: `${first} is travelling with you. The desk can see the trip and will step in if anything changes.`,
      ARRIVED: `${first} is helping with check-in and will stay until you're through.`,
      AT_VENUE: `${first} is handling registration and waiting. ${first} won't make medical decisions — that stays with you and your doctor.`,
      VISIT_COMPLETE: `The visit is done. ${first} will see you safely to the next step.`,
      RETURN_JOURNEY: `On the way home together. You'll be asked to check and pay once you're back.`,
    };
    if (words[s]) return <Waiting icon={Car} text={words[s]!} />;
  }

  // ---- Temporary house help ----------------------------------------------------
  if (request.category === "HOUSE_HELP") {
    if (s === "CONFIRMED" || s === "MATCHED") {
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Fact icon={CalendarClock} label="Starts" value={when ?? "To be confirmed"} />
            <Fact icon={Hourglass} label="Plan" value={`${request.schedule?.days ?? 1} day${request.schedule?.days === 1 ? "" : "s"}${request.schedule?.hoursPerDay ? ` · ${request.schedule.hoursPerDay} h a day` : ""}`} />
          </div>
          {request.dailyLog && <DailyTracker days={request.dailyLog} />}
        </div>
      );
    }
    if (s === "ACTIVE" && request.dailyLog) {
      return (
        <div className="space-y-3">
          <DailyTracker days={request.dailyLog} />
          <p className="text-body-sm text-ink-2">If {first} can't come on a day, SeniorG sends a backup — or the day isn't charged.</p>
        </div>
      );
    }
  }

  return null;
}

function Waiting({ text, icon: Icon = Hourglass }: { text: string; icon?: typeof Hourglass }) {
  return (
    <div className="flex items-start gap-3 rounded-card bg-sand p-4">
      <Icon size={20} className="mt-0.5 shrink-0 text-ink-3" />
      <p className="text-body-sm text-ink-2">{text}</p>
    </div>
  );
}

function Fact({ icon: Icon, label, value, hint, big }: { icon: typeof Hourglass; label: string; value: string; hint?: string; big?: boolean }) {
  return (
    <div className="rounded-card bg-sand p-4">
      <p className="flex items-center gap-1.5 text-body-sm text-ink-2">
        <Icon size={16} /> {label}
      </p>
      <p className={["mt-1 font-semibold text-ink", big ? "tabular font-serif text-title tracking-[0.15em]" : "text-body"].join(" ")}>{value}</p>
      {hint && <p className="mt-1 text-meta text-ink-3">{hint}</p>}
    </div>
  );
}
