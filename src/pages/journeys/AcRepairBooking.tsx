import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Snowflake,
  Droplets,
  Volume2,
  PowerOff,
  HelpCircle,
  Camera,
  X,
  Check,
} from "lucide-react";
import { JourneyHeader } from "@/components/journey/JourneyHeader";
import { ChoiceGrid } from "@/components/journey/ChoiceGrid";
import { OptionCard } from "@/components/journey/OptionCard";
import { ProviderCard } from "@/components/journey/ProviderCard";
import { PriceBreakdown } from "@/components/journey/PriceBreakdown";
import { BookingSummary } from "@/components/journey/BookingSummary";
import { Button } from "@/components/ui/Button";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { buildAcRepairRequest } from "@/lib/requestFactory";
import { upcomingDateOptions } from "@/lib/date";

const SYMPTOMS = [
  { id: "not-cooling", label: "Not cooling", icon: Snowflake, description: "Blowing warm, or the room isn't cooling" },
  { id: "water-leak", label: "Water leak", icon: Droplets, description: "Water dripping from the indoor unit" },
  { id: "noise", label: "Making noise", icon: Volume2, description: "Unusual rattling or buzzing" },
  { id: "not-starting", label: "Not starting", icon: PowerOff, description: "Doesn't switch on at all" },
  { id: "other", label: "Something else", icon: HelpCircle, description: "Describe it in your own words" },
];

const AC_TYPES = ["Split AC", "Window AC"];

const URGENCY_OPTIONS = [
  { id: "today", label: "As soon as possible", description: "Today, if someone is free" },
  { id: "this-week", label: "This week", description: "No rush, within a few days" },
  { id: "flexible", label: "I'm flexible", description: "Whenever suits the professional" },
];

const SLOTS = ["Morning · 9 am–12 pm", "Afternoon · 12 pm–4 pm", "Evening · 4 pm–7 pm"];

const STEP_TITLES = [
  "Select problem",
  "Describe issue",
  "Add a photo",
  "Select urgency",
  "Select date",
  "Select time",
  "Choose provider",
  "Review & confirm",
];

export function AcRepairBooking() {
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const service = state.services["SV-AC"];

  const [step, setStep] = useState(0);
  const [symptom, setSymptom] = useState<string | null>(null);
  const [acType, setAcType] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!service || !person) return null;

  const dateOptions = upcomingDateOptions(5);
  const providers = Object.values(state.providers).filter(
    (p) => p.type === "REPAIR" && p.skills.includes("AC")
  );

  const stepValid = [!!symptom, !!acType, true, !!urgency, !!date, !!slot, !!providerId, true][step];

  function goBack() {
    if (step === 0) navigate("/services");
    else setStep((s) => s - 1);
  }

  function goNext() {
    if (!stepValid) return;
    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
  }

  function handleConfirm() {
    if (!symptom || !acType || !urgency || !date || !slot || !providerId || !person) return;
    setConfirming(true);
    const provider = state.providers[providerId];
    const request = buildAcRepairRequest(
      { symptom, acType, note: note || undefined, hasPhoto, urgency, date, slot },
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

  const symptomLabel = SYMPTOMS.find((s) => s.id === symptom)?.label;
  const dateLabel = dateOptions.find((d) => d.iso === date)?.label;

  return (
    <div className="mx-auto min-h-screen w-full max-w-content bg-surface px-gutter pb-40 sm:px-6 lg:px-8">
      <JourneyHeader title="AC Repair" stepIndex={step} stepCount={STEP_TITLES.length} onBack={goBack} />

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-4"
      >
        {step === 0 && (
          <>
            <p className="text-body-sm text-ink-2">What's going on with the AC?</p>
            <ChoiceGrid>
              {SYMPTOMS.map((s) => (
                <OptionCard
                  key={s.id}
                  label={s.label}
                  description={s.description}
                  icon={s.icon}
                  selected={symptom === s.id}
                  onSelect={() => setSymptom(s.id)}
                />
              ))}
            </ChoiceGrid>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-body-sm text-ink-2">What type of AC is it?</p>
            <ChoiceGrid columns={2}>
              {AC_TYPES.map((t) => (
                <OptionCard key={t} label={t} selected={acType === t} onSelect={() => setAcType(t)} />
              ))}
            </ChoiceGrid>
            <div>
              <label className="mb-1.5 block text-body-sm font-semibold text-ink-2">
                Anything else to mention? (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. Makes a clicking sound when it starts"
                className="w-full rounded-card border border-card-border p-3 text-body-sm text-ink placeholder:text-ink-2/60 focus-visible:outline-none"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-body-sm text-ink-2">A photo helps the professional come prepared. Totally optional.</p>
            {hasPhoto ? (
              <div className="flex items-center gap-3 rounded-card border border-card-border bg-card p-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-card bg-brand-tint text-brand-dark">
                  <Camera size={24} />
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-ink">Photo added</p>
                  <p className="text-meta text-ink-2">indoor-unit.jpg (demo)</p>
                </div>
                <button
                  onClick={() => setHasPhoto(false)}
                  aria-label="Remove photo"
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setHasPhoto(true)}
                className="flex w-full flex-col items-center gap-2 rounded-card border-2 border-dashed border-card-border p-8 text-ink-2 hover:border-brand/40 hover:text-brand"
              >
                <Camera size={28} />
                <span className="font-semibold">Add a photo (demo)</span>
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-body-sm text-ink-2">When would you like this done?</p>
            <ChoiceGrid>
              {URGENCY_OPTIONS.map((u) => (
                <OptionCard
                  key={u.id}
                  label={u.label}
                  description={u.description}
                  selected={urgency === u.id}
                  onSelect={() => setUrgency(u.id)}
                />
              ))}
            </ChoiceGrid>
          </>
        )}

        {step === 4 && (
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

        {step === 5 && (
          <>
            <p className="text-body-sm text-ink-2">Choose a time window.</p>
            <ChoiceGrid>
              {SLOTS.map((s) => (
                <OptionCard key={s} label={s} selected={slot === s} onSelect={() => setSlot(s)} />
              ))}
            </ChoiceGrid>
          </>
        )}

        {step === 6 && (
          <>
            <p className="text-body-sm text-ink-2">
              Matched from your preferences — {person.preferences?.languages?.join(", ") ?? "your language"}.
            </p>
            <div className="space-y-3">
              {providers.map((p) => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  whyMatched={`Speaks ${p.languages.join(", ")} · ${p.rating}★ · ${p.jobsWithMembers} jobs with members`}
                  selected={providerId === p.id}
                  onSelect={() => setProviderId(p.id)}
                />
              ))}
            </div>
          </>
        )}

        {step === 7 && (
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
                    { label: "Problem", value: symptomLabel ?? "—" },
                    { label: "AC type", value: acType ?? "—" },
                    { label: "Urgency", value: URGENCY_OPTIONS.find((u) => u.id === urgency)?.label ?? "—" },
                    { label: "Date", value: dateLabel ?? "—" },
                    { label: "Time", value: slot ?? "—" },
                    { label: "Professional", value: providerId ? state.providers[providerId].name : "—" },
                  ]}
                />
                <PriceBreakdown
                  items={[{ label: "Visit fee", amount: service.visitFee ?? 0, emphasis: true }]}
                  note="Added work needs your approval before anything extra is charged. Free cancellation until 4 h before."
                />
              </>
            )}
          </>
        )}
      </motion.div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-bar backdrop-blur-md">
        <div className="mx-auto flex max-w-content gap-3">
          {step === STEP_TITLES.length - 1 ? (
            <Button fullWidth onClick={handleConfirm} disabled={confirming}>
              <Check size={18} /> Confirm booking
            </Button>
          ) : (
            <Button fullWidth onClick={goNext} disabled={!stepValid}>
              Next
            </Button>
          )}
        </div>
        {!stepValid && step !== STEP_TITLES.length - 1 && (
          <p className="mx-auto mt-2 max-w-content text-center text-meta text-ink-2">Choose an option to continue.</p>
        )}
      </div>
    </div>
  );
}
