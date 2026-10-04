import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChefHat, UtensilsCrossed, ListChecks, UserPlus, Check } from "lucide-react";
import { JourneyHeader } from "@/components/journey/JourneyHeader";
import { ChoiceGrid } from "@/components/journey/ChoiceGrid";
import { OptionCard } from "@/components/journey/OptionCard";
import { ProviderCard } from "@/components/journey/ProviderCard";
import { PriceBreakdown } from "@/components/journey/PriceBreakdown";
import { BookingSummary } from "@/components/journey/BookingSummary";
import { Button } from "@/components/ui/Button";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { buildHouseHelpRequest } from "@/lib/requestFactory";
import { demoToday, formatLongDate } from "@/lib/date";

const TASKS = [
  { id: "cleaning", label: "Cleaning", icon: Sparkles, description: "Sweeping, mopping, dusting" },
  { id: "cooking", label: "Cooking", icon: ChefHat, description: "Simple meals, your way" },
  { id: "dishes", label: "Dishes", icon: UtensilsCrossed, description: "Washing up after meals" },
  { id: "multiple", label: "Multiple tasks", icon: ListChecks, description: "A bit of everything" },
  { id: "replacement", label: "Temporary replacement", icon: UserPlus, description: "A full stand-in for your regular help" },
];

const DURATIONS = [
  { id: "1", label: "1 day" },
  { id: "3", label: "3 days" },
  { id: "7", label: "1 week" },
  { id: "custom", label: "Custom" },
];

const TIMINGS = ["Morning", "Afternoon", "Evening"];

const PREFERENCES = [
  { id: "female", label: "Female helper" },
  { id: "male", label: "Male helper" },
  { id: "experienced", label: "Experienced" },
  { id: "same-helper", label: "Same helper if available" },
];

const STEP_TITLES = [
  "What help do you need?",
  "How long?",
  "Preferred timing",
  "Preferences",
  "Choose a helper",
  "Your plan",
  "Confirm",
];

export function HouseHelpBooking() {
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const service = state.services["SV-HOUSEHELP"];

  const [step, setStep] = useState(0);
  const [taskType, setTaskType] = useState<string | null>(null);
  const [durationId, setDurationId] = useState<string | null>(null);
  const [customDays, setCustomDays] = useState(5);
  const [timing, setTiming] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!service || !person) return null;

  const days = durationId === "custom" ? customDays : Number(durationId ?? 0);
  const dailyRate = service.visitFee ?? 650;
  const estimate = dailyRate * days;
  const startDate = demoToday().toISOString().slice(0, 10);

  const providers = Object.values(state.providers).filter((p) => p.type === "HOUSE_HELP");

  function togglePreference(id: string) {
    setPreferences((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const stepValid = [
    !!taskType,
    !!durationId && (durationId !== "custom" || customDays >= 1),
    !!timing,
    true,
    !!providerId,
    true,
    true,
  ][step];

  function goBack() {
    if (step === 0) navigate("/services");
    else setStep((s) => s - 1);
  }

  function goNext() {
    if (!stepValid) return;
    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
  }

  function handleConfirm() {
    if (!taskType || !durationId || !timing || !providerId || !person) return;
    setConfirming(true);
    const provider = state.providers[providerId];
    const request = buildHouseHelpRequest(
      { taskType, days, timing, preferences, startDate },
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

  const taskLabel = TASKS.find((t) => t.id === taskType)?.label ?? "—";
  const preferenceLabels = PREFERENCES.filter((p) => preferences.includes(p.id)).map((p) => p.label);
  const helper = providerId ? state.providers[providerId] : undefined;

  return (
    <div className="mx-auto min-h-screen w-full max-w-content bg-surface px-gutter pb-40 sm:px-6 lg:px-8">
      <JourneyHeader
        title="Temporary House Help"
        stepIndex={step}
        stepCount={STEP_TITLES.length}
        onBack={goBack}
        onHelp={() => dispatch({ type: "TOGGLE_HELP_SHEET", open: true })}
      />

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-5"
      >
        {step === 0 && (
          <>
            <p className="text-body-sm text-ink-2">What help do you need while your regular help is away?</p>
            <ChoiceGrid>
              {TASKS.map((t) => (
                <OptionCard
                  key={t.id}
                  label={t.label}
                  description={t.description}
                  icon={t.icon}
                  selected={taskType === t.id}
                  onSelect={() => setTaskType(t.id)}
                />
              ))}
            </ChoiceGrid>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-body-sm text-ink-2">How many days do you need help for?</p>
            <ChoiceGrid>
              {DURATIONS.map((d) => (
                <OptionCard
                  key={d.id}
                  label={d.label}
                  selected={durationId === d.id}
                  onSelect={() => setDurationId(d.id)}
                />
              ))}
            </ChoiceGrid>
            {durationId === "custom" && (
              <div className="flex items-center justify-center gap-6 rounded-card border border-card-border bg-card p-6">
                <button
                  onClick={() => setCustomDays((d) => Math.max(2, d - 1))}
                  aria-label="Fewer days"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5 text-2xl font-bold text-ink hover:bg-ink/10"
                >
                  −
                </button>
                <div className="w-20 text-center">
                  <p className="font-serif text-title text-ink">{customDays}</p>
                  <p className="text-meta text-ink-2">days</p>
                </div>
                <button
                  onClick={() => setCustomDays((d) => Math.min(30, d + 1))}
                  aria-label="More days"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white hover:bg-brand-dark"
                >
                  +
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-body-sm text-ink-2">What time of day works best?</p>
            <ChoiceGrid>
              {TIMINGS.map((t) => (
                <OptionCard key={t} label={t} selected={timing === t} onSelect={() => setTiming(t)} />
              ))}
            </ChoiceGrid>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-body-sm text-ink-2">
              Anything you'd like us to keep in mind? This is optional — skip if you have no preference.
            </p>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePreference(p.id)}
                  className={[
                    "rounded-full border px-5 py-3 text-body-sm font-semibold transition-colors",
                    preferences.includes(p.id)
                      ? "border-brand bg-brand-tint text-brand-dark"
                      : "border-card-border bg-card text-ink hover:border-brand/40",
                  ].join(" ")}
                >
                  {preferences.includes(p.id) && <Check size={14} className="mr-1.5 inline" />}
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-body-sm text-ink-2">These helpers are available and suit what you need.</p>
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

        {step === 5 && (
          <>
            <p className="text-body-sm text-ink-2">Here's your plan before you confirm.</p>
            <BookingSummary
              rows={[
                { label: "Help needed", value: taskLabel },
                { label: "Duration", value: `${days} day${days === 1 ? "" : "s"}` },
                { label: "Timing", value: timing ?? "—" },
                { label: "Preferences", value: preferenceLabels.length ? preferenceLabels.join(", ") : "No preference" },
                { label: "Helper", value: helper?.name ?? "—" },
              ]}
            />
            <PriceBreakdown
              items={[{ label: `₹${dailyRate} × ${days} day${days === 1 ? "" : "s"}`, amount: estimate, emphasis: true }]}
              note="Pay at the end for days actually served — skipped days are never charged."
            />
          </>
        )}

        {step === 6 && (
          <>
            {confirming ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand border-t-transparent"
                />
                <p className="font-semibold text-ink">Confirming your plan…</p>
              </div>
            ) : (
              <div className="space-y-5 rounded-card border border-card-border bg-card p-6 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
                  {helper?.avatarInitials}
                </span>
                <div>
                  <p className="font-serif text-section text-ink">{helper?.name} will help you</p>
                  <p className="mt-2 text-body-sm text-ink-2">
                    {taskLabel} · {days} day{days === 1 ? "" : "s"} · {timing?.toLowerCase()} · starting{" "}
                    {formatLongDate(startDate)}
                  </p>
                </div>
                <div className="rounded-card bg-brand-tint p-4">
                  <p className="text-body-sm font-semibold text-brand-dark">
                    Illustrative demo price
                  </p>
                  <p className="font-serif text-title text-brand-dark">₹{estimate}</p>
                </div>
              </div>
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
