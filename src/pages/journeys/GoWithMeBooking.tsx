import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, HeartPulse, MapPin, Check } from "lucide-react";
import { JourneyHeader } from "@/components/journey/JourneyHeader";
import { ChoiceGrid } from "@/components/journey/ChoiceGrid";
import { OptionCard } from "@/components/journey/OptionCard";
import { ProviderCard } from "@/components/journey/ProviderCard";
import { PriceBreakdown } from "@/components/journey/PriceBreakdown";
import { BookingSummary } from "@/components/journey/BookingSummary";
import { Button } from "@/components/ui/Button";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { buildGoWithMeRequest, type GoWithMeDestination } from "@/lib/requestFactory";
import { upcomingDateOptions } from "@/lib/date";

const AIRPORT_ASSISTANCE = [
  { id: "cab-only", label: "Cab only", description: "Just the ride, no companion", price: 650 },
  { id: "cab-companion", label: "Cab + Companion", description: "A companion travels with you and helps at check-in", price: 1450 },
  { id: "cab-companion-wait-return", label: "Cab + Companion + Waiting + Return", description: "Full support there and back", price: 2600 },
];

const HOSPITAL_ASSISTANCE = [
  { id: "travel", label: "Travel assistance", description: "Cab there and back", price: 650 },
  { id: "checkin", label: "Check-in assistance", description: "Help with registration at the hospital", price: 300 },
  { id: "waiting", label: "Waiting assistance", description: "Companion waits during the appointment", price: 500 },
  { id: "return", label: "Return journey", description: "Companion travels back with you", price: 450 },
];

const SLOTS = ["Morning · 9 am–12 pm", "Afternoon · 12 pm–4 pm", "Evening · 4 pm–7 pm"];

const AIRPORT_STEP_TITLES = [
  "Choose destination",
  "Assistance type",
  "Select date",
  "Select time",
  "Pickup",
  "Traveller",
  "Choose companion",
  "Review & confirm",
];

const HOSPITAL_STEP_TITLES = [
  "Choose destination",
  "Appointment date & time",
  "Traveller",
  "Assistance required",
  "Choose companion",
  "Review & confirm",
];

export function GoWithMeBooking() {
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const service = state.services["SV-GOWITHME"];

  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState<GoWithMeDestination | null>(null);
  const [assistanceAirport, setAssistanceAirport] = useState<string | null>(null);
  const [assistanceHospital, setAssistanceHospital] = useState<string[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [travellerId, setTravellerId] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!service || !person) return null;

  const isHospital = destination === "hospital";
  const stepTitles = isHospital ? HOSPITAL_STEP_TITLES : AIRPORT_STEP_TITLES;
  const dateOptions = upcomingDateOptions(5);

  function toggleHospitalAssistance(id: string) {
    setAssistanceHospital((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const providers = Object.values(state.providers).filter(
    (p) => p.type === "COMPANION" && p.skills.includes(isHospital ? "Hospital" : "Airport")
  );

  const estimate = isHospital
    ? HOSPITAL_ASSISTANCE.filter((a) => assistanceHospital.includes(a.id)).reduce((s, a) => s + a.price, 0)
    : (AIRPORT_ASSISTANCE.find((a) => a.id === assistanceAirport)?.price ?? 0);

  // Validity per step, branching by destination.
  const stepValid = (() => {
    if (step === 0) return destination !== null;
    if (isHospital) {
      switch (step) {
        case 1:
          return !!date && !!slot;
        case 2:
          return !!travellerId;
        case 3:
          return assistanceHospital.length > 0;
        case 4:
          return !!providerId;
        default:
          return true;
      }
    }
    switch (step) {
      case 1:
        return !!assistanceAirport;
      case 2:
        return !!date;
      case 3:
        return !!slot;
      case 4:
        return true; // pickup, informational
      case 5:
        return !!travellerId;
      case 6:
        return !!providerId;
      default:
        return true;
    }
  })();

  function goBack() {
    if (step === 0) navigate("/services");
    else setStep((s) => s - 1);
  }

  function goNext() {
    if (!stepValid) return;
    setStep((s) => Math.min(s + 1, stepTitles.length - 1));
  }

  function handleConfirm() {
    if (!destination || !travellerId || !providerId || !date || !slot || !person) return;
    if (isHospital && assistanceHospital.length === 0) return;
    if (!isHospital && !assistanceAirport) return;

    setConfirming(true);
    const provider = state.providers[providerId];
    const request = buildGoWithMeRequest(
      {
        destinationType: destination,
        assistance: isHospital ? assistanceHospital : [assistanceAirport!],
        date,
        slot,
        travellerId,
        pickupAddress: !isHospital ? person.preferences?.pickupAddress : undefined,
      },
      estimate,
      person,
      service,
      providerId
    );
    dispatch({ type: "CREATE_REQUEST", request, actorId: person.id });
    dispatch({
      type: "SET_STATUS",
      requestId: request.id,
      status: "MATCHED",
      actorId: person.id,
      note: `Matched with ${provider.name}`,
    });
    dispatch({ type: "SET_STATUS", requestId: request.id, status: "CONFIRMED", actorId: person.id });
    window.setTimeout(() => navigate(`/requests/${request.id}`), 700);
  }

  const traveller = travellerId ? state.people[travellerId] : undefined;
  const dateLabel = dateOptions.find((d) => d.iso === date)?.label ?? date ?? "—";
  const assistanceLabel = isHospital
    ? HOSPITAL_ASSISTANCE.filter((a) => assistanceHospital.includes(a.id))
        .map((a) => a.label)
        .join(", ")
    : (AIRPORT_ASSISTANCE.find((a) => a.id === assistanceAirport)?.label ?? "—");

  return (
    <div className="mx-auto min-h-screen w-full max-w-content bg-surface px-gutter pb-40 sm:px-6 lg:px-8">
      <JourneyHeader title="Go With Me" stepIndex={step} stepCount={stepTitles.length} onBack={goBack} />

      <motion.div
        key={`${destination ?? "none"}-${step}`}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-4"
      >
        {step === 0 && (
          <>
            <p className="text-body-sm text-ink-2">Where do you need to go?</p>
            <ChoiceGrid>
              <OptionCard
                label="Airport"
                description="A companion and cab to the airport"
                icon={Plane}
                selected={destination === "airport"}
                onSelect={() => setDestination("airport")}
              />
              <OptionCard
                label="Hospital"
                description="Accompaniment for a medical appointment"
                icon={HeartPulse}
                selected={destination === "hospital"}
                onSelect={() => setDestination("hospital")}
              />
            </ChoiceGrid>
          </>
        )}

        {!isHospital && step === 1 && (
          <>
            <p className="text-body-sm text-ink-2">How much help would you like?</p>
            <ChoiceGrid>
              {AIRPORT_ASSISTANCE.map((a) => (
                <OptionCard
                  key={a.id}
                  label={a.label}
                  description={a.description}
                  selected={assistanceAirport === a.id}
                  onSelect={() => setAssistanceAirport(a.id)}
                />
              ))}
            </ChoiceGrid>
          </>
        )}

        {!isHospital && step === 2 && (
          <>
            <p className="text-body-sm text-ink-2">Choose a date.</p>
            <ChoiceGrid columns={2}>
              {dateOptions.map((d, i) => (
                <OptionCard
                  key={d.iso}
                  label={d.label}
                  description={
                    i < 2
                      ? new Date(d.iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
                      : undefined
                  }
                  selected={date === d.iso}
                  onSelect={() => setDate(d.iso)}
                />
              ))}
            </ChoiceGrid>
          </>
        )}

        {!isHospital && step === 3 && (
          <>
            <p className="text-body-sm text-ink-2">Choose a pickup time.</p>
            <ChoiceGrid>
              {SLOTS.map((s) => (
                <OptionCard key={s} label={s} selected={slot === s} onSelect={() => setSlot(s)} />
              ))}
            </ChoiceGrid>
          </>
        )}

        {!isHospital && step === 4 && (
          <>
            <p className="text-body-sm text-ink-2">We'll pick up from your saved address.</p>
            <div className="flex items-start gap-3 rounded-card border border-card-border bg-card p-4">
              <MapPin size={20} className="mt-0.5 shrink-0 text-brand" />
              <p className="text-body-sm text-ink">
                {person.preferences?.pickupAddress ?? state.household.address}
              </p>
            </div>
          </>
        )}

        {!isHospital && step === 5 && (
          <>
            <p className="text-body-sm text-ink-2">Who is travelling?</p>
            <ChoiceGrid columns={2}>
              {state.household.memberIds.map((id) => {
                const m = state.people[id];
                return (
                  <OptionCard
                    key={id}
                    label={m.name}
                    selected={travellerId === id}
                    onSelect={() => setTravellerId(id)}
                  />
                );
              })}
            </ChoiceGrid>
          </>
        )}

        {isHospital && step === 1 && (
          <>
            <p className="text-body-sm text-ink-2">When is the appointment?</p>
            <div className="space-y-2">
              <p className="text-body-sm font-semibold text-ink-2">Date</p>
              <ChoiceGrid columns={2}>
                {dateOptions.map((d, i) => (
                  <OptionCard
                    key={d.iso}
                    label={d.label}
                    description={
                      i < 2
                        ? new Date(d.iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
                        : undefined
                    }
                    selected={date === d.iso}
                    onSelect={() => setDate(d.iso)}
                  />
                ))}
              </ChoiceGrid>
            </div>
            <div className="space-y-2">
              <p className="text-body-sm font-semibold text-ink-2">Time</p>
              <ChoiceGrid>
                {SLOTS.map((s) => (
                  <OptionCard key={s} label={s} selected={slot === s} onSelect={() => setSlot(s)} />
                ))}
              </ChoiceGrid>
            </div>
          </>
        )}

        {isHospital && step === 2 && (
          <>
            <p className="text-body-sm text-ink-2">Who is travelling?</p>
            <ChoiceGrid columns={2}>
              {state.household.memberIds.map((id) => {
                const m = state.people[id];
                return (
                  <OptionCard
                    key={id}
                    label={m.name}
                    selected={travellerId === id}
                    onSelect={() => setTravellerId(id)}
                  />
                );
              })}
            </ChoiceGrid>
          </>
        )}

        {isHospital && step === 3 && (
          <>
            <p className="text-body-sm text-ink-2">Choose everything that applies.</p>
            <ChoiceGrid>
              {HOSPITAL_ASSISTANCE.map((a) => (
                <OptionCard
                  key={a.id}
                  label={a.label}
                  description={a.description}
                  selected={assistanceHospital.includes(a.id)}
                  onSelect={() => toggleHospitalAssistance(a.id)}
                />
              ))}
            </ChoiceGrid>
          </>
        )}

        {((!isHospital && step === 6) || (isHospital && step === 4)) && (
          <>
            <p className="text-body-sm text-ink-2">
              Matched from your preferences — {person.preferences?.languages?.join(", ") ?? "your language"}.
            </p>
            <div className="space-y-3">
              {providers.map((p) => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  whyMatched={`Speaks ${p.languages.join(", ")} · ${p.rating}★ · ${p.jobsWithMembers} trips`}
                  selected={providerId === p.id}
                  onSelect={() => setProviderId(p.id)}
                />
              ))}
            </div>
          </>
        )}

        {((!isHospital && step === 7) || (isHospital && step === 5)) && (
          <>
            {confirming ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand border-t-transparent"
                />
                <p className="font-semibold text-ink">Confirming your booking…</p>
              </div>
            ) : (
              <>
                <BookingSummary
                  rows={[
                    { label: "Destination", value: isHospital ? "Hospital" : "Airport" },
                    { label: "Assistance", value: assistanceLabel },
                    { label: "Date", value: dateLabel },
                    { label: "Time", value: slot ?? "—" },
                    { label: "Traveller", value: traveller?.name ?? "—" },
                    { label: "Companion", value: providerId ? state.providers[providerId].name : "—" },
                  ]}
                />
                <PriceBreakdown
                  items={[{ label: "Estimate", amount: estimate, emphasis: true }]}
                  note="Final price is confirmed by the desk before the trip. Free cancellation until 12 h before."
                />
              </>
            )}
          </>
        )}
      </motion.div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-bar backdrop-blur-md">
        <div className="mx-auto flex max-w-content gap-3">
          {step === stepTitles.length - 1 ? (
            <Button fullWidth onClick={handleConfirm} disabled={confirming}>
              <Check size={18} /> Confirm booking
            </Button>
          ) : (
            <Button fullWidth onClick={goNext} disabled={!stepValid}>
              Next
            </Button>
          )}
        </div>
        {!stepValid && step !== stepTitles.length - 1 && (
          <p className="mx-auto mt-2 max-w-content text-center text-meta text-ink-2">Choose an option to continue.</p>
        )}
      </div>
    </div>
  );
}
