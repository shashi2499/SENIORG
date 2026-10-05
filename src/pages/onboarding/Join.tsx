import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronLeft,
  FlaskConical,
  Hand,
  HandHelping,
  Headset,
  Home,
  Languages,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { Wordmark } from "@/components/shell/TopBar";
import { DIRECT_NAME, DIRECT_TAGLINE, DirectMark, DirectProspectSheet } from "@/components/direct/SeniorGDirect";
import { useOnboarding } from "@/onboarding/OnboardingContext";
import {
  ASSISTANCE_LABEL,
  DEMO_DETAILS,
  FOCUS_LABEL,
  MEMBERSHIP_PRICE,
  MEMBERSHIP_PRICE_LABEL,
  MUMBAI_PREVIEW_NOTE,
  CHECKOUT_NOTE,
  PRICE_NOTE,
  PHASES,
  STEPS,
  TRIAL_DAYS,
  firstIncomplete,
  formatDay,
  trialEndDate,
  validEmail,
  validMobile,
  validName,
  type Step,
} from "@/lib/onboarding";
import type { AssistanceStyle, HelpFocus, HelpLanguage } from "@/store/types";
import { ChoiceCard, DemoBadge, Field, PhaseProgress, StepFrame, inputClass } from "./JoinParts";
import { Brief } from "./Brief";

const ease = [0.2, 0, 0, 1] as const;

const primaryBtn =
  "inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-pill bg-brand px-6 text-label font-semibold text-white shadow-soft transition hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 sm:w-auto sm:min-w-[16rem]";

const ASIDE: Record<string, { title: string; body: string }> = {
  "About you": { title: "Only what we need.", body: "Your details help SeniorG reach you and find help near you. Nothing is shared with family unless you choose." },
  Verify: { title: "A demonstration, honestly labelled.", body: "This prototype shows how verification would feel. No real Aadhaar number, OTP or identity check is used." },
  Membership: { title: "One membership. Everything SeniorG does.", body: "Home services, Go With Me, reminders, local life — and a person at SeniorG whenever you need one." },
  Personalise: { title: "SeniorG works your way.", body: "Four quick questions. You can change any of these later in Household → Profile." },
};

export function Join() {
  const { step: param } = useParams();
  const navigate = useNavigate();
  const { draft } = useOnboarding();
  const [directOpen, setDirectOpen] = useState(false);

  // Each step starts at the top, one decision at a time.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [param]);

  const step = (STEPS as readonly string[]).includes(param ?? "") ? (param as Step) : undefined;
  if (!step) return <Navigate to="/join/details" replace />;

  // Deep links can't skip ahead of what's been filled in.
  const ready = firstIncomplete(draft);
  if (STEPS.indexOf(step) > STEPS.indexOf(ready)) return <Navigate to={`/join/${ready}`} replace />;

  if (step === "brief") return <Brief />;

  const index = STEPS.indexOf(step);
  const go = (s: Step) => navigate(`/join/${s}`);
  const next = () => go(STEPS[index + 1]!);
  const back = () => {
    const hasHistory = ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0;
    if (hasHistory) navigate(-1);
    else navigate(index === 0 ? "/" : `/join/${STEPS[index - 1]}`);
  };
  const phase = PHASES.find((p) => p.steps.includes(step))!;
  const aside = ASIDE[phase.label]!;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[minmax(0,26rem)_1fr]">
        {/* Desktop: a calm companion panel that explains this phase */}
        <aside className="relative hidden overflow-hidden bg-brand-deep text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-10">
          <Link to="/" aria-label="SeniorG home">
            <Wordmark light />
          </Link>
          <AnimatePresence mode="wait">
            <motion.div key={phase.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }}>
              <p className="text-tag font-semibold uppercase tracking-[0.14em] text-accent">{phase.label}</p>
              <p className="mt-3 font-serif text-[2rem] leading-tight">{aside.title}</p>
              <p className="mt-3 text-body text-white/80">{aside.body}</p>
            </motion.div>
          </AnimatePresence>
          <button onClick={() => setDirectOpen(true)} className="flex items-center gap-3 rounded-card bg-white/[0.07] p-4 text-left ring-1 ring-white/10 hover:bg-white/[0.12]">
            <DirectMark size="md" />
            <span>
              <span className="block font-semibold">Questions? {DIRECT_NAME}</span>
              <span className="block text-body-sm text-white/75">{DIRECT_TAGLINE} — call or chat with a person.</span>
            </span>
          </button>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-line/60 bg-surface/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between gap-2 page-gutter">
              <button onClick={back} className="-ml-2 flex min-h-[44px] items-center gap-1 rounded-pill pl-1 pr-3 font-semibold text-ink-2 hover:bg-sand hover:text-ink">
                <ChevronLeft size={24} /> <span className="text-body-sm">Back</span>
              </button>
              <span className="lg:hidden">
                <Wordmark />
              </span>
              <button
                onClick={() => setDirectOpen(true)}
                className="flex h-11 items-center gap-2 rounded-pill bg-brand-tint pl-1.5 pr-4 text-body-sm font-semibold text-brand-dark hover:bg-brand-soft"
                aria-label={`${DIRECT_NAME} — need a hand?`}
              >
                <DirectMark size="sm" /> Help
              </button>
            </div>
            <div className="mx-auto w-full max-w-2xl pb-3 page-gutter">
              <PhaseProgress step={step} />
            </div>
          </header>

          <main className="mx-auto w-full max-w-2xl flex-1 page-gutter pb-40 pt-8 sm:pb-16 sm:pt-10">
            <motion.div key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease }}>
              {step === "details" && <DetailsStep onNext={next} />}
              {step === "city" && <CityStep onNext={next} />}
              {step === "dob" && <DobStep onNext={next} />}
              {step === "aadhaar" && <AadhaarStep onNext={next} />}
              {step === "otp" && <OtpStep onNext={next} />}
              {step === "plan" && <PlanStep onNext={next} />}
              {step === "checkout" && <CheckoutStep onNext={next} onChangePlan={() => go("plan")} />}
              {step === "support" && <SupportStep onNext={next} />}
              {step === "focus" && <FocusStep onNext={next} />}
              {step === "language" && <LanguageStep onNext={next} />}
              {step === "style" && <StyleStep onNext={next} />}
            </motion.div>
          </main>
        </div>
        <DirectProspectSheet open={directOpen} onClose={() => setDirectOpen(false)} />
      </div>
    </MotionConfig>
  );
}

type StepProps = { onNext: () => void };

// ── Step 1 · Basic details ────────────────────────────────────────────
function DetailsStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  const [tried, setTried] = useState(false);
  const ok = validName(draft.name) && validMobile(draft.mobile) && validEmail(draft.email);

  return (
    <StepFrame
      title="Let's start with you"
      subtitle="Three details so SeniorG can reach you."
      action={
        <button
          className={primaryBtn}
          onClick={() => {
            setTried(true);
            if (ok) onNext();
          }}
        >
          Continue <ArrowRight size={20} />
        </button>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()} noValidate>
        <Field label="Your name" htmlFor="name" error={tried && !validName(draft.name) && "Please enter your name."}>
          <input id="name" autoComplete="name" className={inputClass} value={draft.name} onChange={(e) => update({ name: e.target.value, demoPersona: draft.demoPersona && e.target.value.trim() === DEMO_DETAILS.name })} placeholder="e.g. Asha Sharma" />
        </Field>
        <Field label="Mobile number" htmlFor="mobile" error={tried && !validMobile(draft.mobile) && "Please enter a 10-digit Indian mobile number."}>
          <div className="flex">
            <span className="flex min-h-[56px] items-center rounded-l-tile border-2 border-r-0 border-card-border bg-sand px-4 text-body font-semibold text-ink-2">+91</span>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              className={`${inputClass} rounded-l-none`}
              value={draft.mobile}
              onChange={(e) => update({ mobile: e.target.value.replace(/[^\d ]/g, "").slice(0, 11) })}
              placeholder="98xxx xxxxx"
            />
          </div>
        </Field>
        <Field label="Email ID" htmlFor="email" error={tried && !validEmail(draft.email) && "Please enter a valid email address."}>
          <input id="email" type="email" inputMode="email" autoComplete="email" className={inputClass} value={draft.email} onChange={(e) => update({ email: e.target.value })} placeholder="name@example.com" />
        </Field>
      </form>
      <button
        onClick={() => update({ ...DEMO_DETAILS, demoPersona: true })}
        className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-dashed border-ink/20 px-4 text-body-sm font-semibold text-ink-2 hover:bg-sand"
      >
        <FlaskConical size={16} /> Fill demo details
      </button>
    </StepFrame>
  );
}

// ── Step 2 · City ─────────────────────────────────────────────────────
const CITIES = [
  { id: "Pune" as const, local: "पुणे", line: "Kothrud, Aundh, Baner, Koregaon Park and more" },
  { id: "Mumbai" as const, local: "मुंबई", line: "Dadar, Bandra, Andheri, Thane and more" },
];

function CityStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  return (
    <StepFrame
      title="Which city are you in?"
      subtitle="SeniorG is piloting in two cities."
      action={
        <button className={primaryBtn} disabled={!draft.city} onClick={onNext}>
          Continue <ArrowRight size={20} />
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="City">
        {CITIES.map((c) => {
          const selected = draft.city === c.id;
          return (
            <button
              key={c.id}
              role="radio"
              aria-checked={selected}
              onClick={() => update({ city: c.id })}
              className={[
                "relative flex min-h-[10rem] flex-col justify-end overflow-hidden rounded-[1.5rem] border-2 p-6 text-left transition duration-calm",
                selected ? "border-brand bg-brand-deep text-white shadow-hero" : "border-card-border bg-card text-ink hover:border-brand/40",
              ].join(" ")}
            >
              <span className={["absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border-2", selected ? "border-accent bg-accent text-ink" : "border-ink/25"].join(" ")} aria-hidden="true">
                {selected && <Check size={18} strokeWidth={3} />}
              </span>
              <span className={["font-serif text-[1.25rem]", selected ? "text-accent" : "text-ink-3"].join(" ")} lang="mr">
                {c.local}
              </span>
              <span className="font-serif text-[2.25rem] leading-none">{c.id}</span>
              <span className={["mt-2 text-body-sm", selected ? "text-white/80" : "text-ink-2"].join(" ")}>{c.line}</span>
            </button>
          );
        })}
      </div>
      {draft.city === "Mumbai" && (
        <p className="mt-4 flex items-center gap-2 text-meta text-ink-2">
          <FlaskConical size={15} className="shrink-0 text-accent-deep" /> {MUMBAI_PREVIEW_NOTE}
        </p>
      )}
    </StepFrame>
  );
}

// ── Step 3 · Date of birth ────────────────────────────────────────────
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function DobStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  const [initY, initM, initD] = (draft.dob ?? "").split("-");
  const [day, setDay] = useState(initD ? String(Number(initD)) : "");
  const [month, setMonth] = useState(initM ? String(Number(initM)) : "");
  const [year, setYear] = useState(initY ?? "");
  const [tried, setTried] = useState(false);

  const d = Number(day), m = Number(month), y = Number(year);
  const date = new Date(y, m - 1, d);
  const thisYear = new Date().getFullYear();
  const valid = y >= 1920 && y <= thisYear - 18 && m >= 1 && m <= 12 && date.getDate() === d && date.getMonth() === m - 1;
  const iso = valid ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` : undefined;

  return (
    <StepFrame
      title="Your date of birth"
      subtitle="Used for age-based benefits and reminders like the life certificate."
      action={
        <button
          className={primaryBtn}
          onClick={() => {
            setTried(true);
            if (iso) {
              update({ dob: iso });
              onNext();
            }
          }}
        >
          Continue <ArrowRight size={20} />
        </button>
      }
    >
      <fieldset>
        <legend className="sr-only">Date of birth</legend>
        <div className="grid grid-cols-[4.75rem_1fr_6rem] gap-2.5 sm:grid-cols-[5.5rem_1fr_7rem] sm:gap-3">
          <Field label="Day" htmlFor="dob-day">
            <input id="dob-day" inputMode="numeric" autoComplete="bday-day" className={`${inputClass} text-center`} value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="DD" />
          </Field>
          <Field label="Month" htmlFor="dob-month">
            <select id="dob-month" autoComplete="bday-month" className={`${inputClass} appearance-none`} value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Month</option>
              {MONTHS.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Year" htmlFor="dob-year">
            <input id="dob-year" inputMode="numeric" autoComplete="bday-year" className={`${inputClass} text-center`} value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="YYYY" />
          </Field>
        </div>
      </fieldset>
      {valid ? (
        <p className="mt-5 flex items-center gap-2 rounded-tile bg-brand-tint px-4 py-3 text-body-sm font-semibold text-brand-dark">
          <CalendarClock size={18} /> {date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      ) : (
        tried && (
          <p className="mt-4 text-body-sm font-semibold text-critical" role="alert">
            Please check the day, month and year.
          </p>
        )
      )}
    </StepFrame>
  );
}

// ── Step 4 · Aadhaar (dummy) ──────────────────────────────────────────
function AadhaarStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  const ok = /^\d{4}$/.test(draft.aadhaarLast4);
  return (
    <StepFrame
      eyebrow={<DemoBadge />}
      title="Verify your identity"
      subtitle="Members are verified once, so SeniorG and its providers know who they're helping."
      action={
        <button className={primaryBtn} disabled={!ok} onClick={onNext}>
          <ShieldCheck size={20} /> Verify with OTP
        </button>
      }
      note="Prototype only — no real Aadhaar verification occurs."
    >
      <Field label="Aadhaar number" hint="Dummy number for demonstration" htmlFor="aadhaar">
        <div className="flex min-h-[56px] items-center rounded-tile border-2 border-dashed border-accent-deep/40 bg-card px-4">
          <span className="font-mono text-[1.25rem] tracking-[0.18em] text-ink-3" aria-hidden="true">
            XXXX XXXX&nbsp;
          </span>
          <input
            id="aadhaar"
            inputMode="numeric"
            aria-label="Last four digits of the dummy Aadhaar number"
            className="w-[4.5em] bg-transparent font-mono text-[1.25rem] tracking-[0.18em] text-ink focus:outline-none"
            value={draft.aadhaarLast4}
            onChange={(e) => update({ aadhaarLast4: e.target.value.replace(/\D/g, "").slice(0, 4), verified: false })}
          />
          <Lock size={18} className="ml-auto shrink-0 text-ink-3" />
        </div>
      </Field>
      <div className="mt-5 flex items-start gap-3 rounded-card bg-accent-tint p-4 text-body-sm text-ink">
        <FlaskConical size={20} className="mt-0.5 shrink-0 text-accent-deep" />
        <p>
          <span className="font-semibold">This is a demonstration prototype.</span> Please don't enter a real Aadhaar number. No identity data is collected, sent or stored.
        </p>
      </div>
    </StepFrame>
  );
}

// ── Step 5 · OTP (auto-filled demo) ───────────────────────────────────
const DEMO_OTP = "482916";

function OtpStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  const [filled, setFilled] = useState(draft.verified ? 6 : 0);
  const [phase, setPhase] = useState<"filling" | "ready" | "verifying" | "done">(draft.verified ? "done" : "filling");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (draft.verified) return;
    // Wait a beat (as if an SMS arrived), then fill one digit at a time.
    for (let i = 1; i <= 6; i++) {
      timers.current.push(window.setTimeout(() => setFilled(i), 900 + i * 160));
    }
    timers.current.push(window.setTimeout(() => setPhase("ready"), 900 + 6 * 160 + 120));
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function verify() {
    setPhase("verifying");
    timers.current.push(
      window.setTimeout(() => {
        setPhase("done");
        update({ verified: true });
      }, 1000)
    );
  }

  return (
    <StepFrame
      eyebrow={<DemoBadge />}
      title="Enter the OTP"
      subtitle={<>In the real product, an OTP would go to the mobile linked with Aadhaar XXXX XXXX {draft.aadhaarLast4}.</>}
      action={
        phase === "done" ? (
          <button className={primaryBtn} onClick={onNext}>
            Continue <ArrowRight size={20} />
          </button>
        ) : (
          <button className={primaryBtn} disabled={phase !== "ready"} onClick={verify}>
            {phase === "verifying" ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Verifying…
              </>
            ) : (
              <>Verify & continue</>
            )}
          </button>
        )
      }
      note="No real OTP is sent. No real Aadhaar verification occurs."
    >
      <div className="flex justify-between gap-2 sm:justify-start sm:gap-3" aria-label={filled === 6 ? "OTP auto-filled" : "Waiting for OTP"} role="group">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            className={[
              "flex aspect-square w-full max-w-[3.75rem] items-center justify-center rounded-tile border-2 font-mono text-[1.5rem] font-semibold",
              i < filled ? "border-brand bg-brand-tint text-ink" : "border-card-border bg-card text-ink-3",
            ].join(" ")}
            animate={i < filled ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.22 }}
          >
            {i < filled ? DEMO_OTP[i] : "●"}
          </motion.span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-3 rounded-card bg-success-tint p-4 text-success">
            <CheckCircle2 size={24} className="shrink-0" />
            <p className="font-semibold">Verified — demo only. No real identity check took place.</p>
          </motion.div>
        ) : filled === 6 ? (
          <motion.p key="auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center gap-2 rounded-tile bg-accent-tint px-4 py-3 text-body-sm text-ink">
            <FlaskConical size={18} className="shrink-0 text-accent-deep" /> Demo OTP auto-filled for prototype demonstration.
          </motion.p>
        ) : (
          <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 flex items-center gap-2 text-body-sm text-ink-2">
            <Loader2 size={18} className="animate-spin text-brand" /> Waiting for the demo OTP…
          </motion.p>
        )}
      </AnimatePresence>
      <p className="mt-4 text-meta text-ink-3">SeniorG will never ask you to read out an OTP, password or UPI PIN on a call.</p>
    </StepFrame>
  );
}

// ── Step 6 · Membership (₹999/month first) ────────────────────────────
const BENEFITS: { label: string; icon: React.ReactNode }[] = [
  { label: "Home services", icon: <Wrench size={18} /> },
  { label: "Go With Me", icon: <Users size={18} /> },
  { label: DIRECT_NAME, icon: <BellRing size={18} /> },
  { label: "Reminders", icon: <CalendarClock size={18} /> },
  { label: "Local Events", icon: <Ticket size={18} /> },
  { label: "Smart Minutes", icon: <Sparkles size={18} /> },
];

function PlanStep({ onNext }: StepProps) {
  const { update } = useOnboarding();
  const choose = (plan: "MEMBERSHIP" | "TRIAL") => {
    update({ plan, planConfirmed: false });
    onNext();
  };
  return (
    <div>
      <h1 className="sr-only">Choose your SeniorG membership</h1>
      {/* The proposition */}
      <section className="overflow-hidden rounded-[1.75rem] bg-card shadow-hero ring-1 ring-card-border">
        <div className="bg-brand-deep p-6 text-white sm:p-8">
          <p className="text-tag font-semibold uppercase tracking-[0.14em] text-accent">SeniorG Membership</p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
            <span className="font-serif text-[3.5rem] leading-none sm:text-[4.25rem]">{MEMBERSHIP_PRICE}</span>
            <span className="text-section text-white/80">/ month</span>
          </p>
          <p className="mt-1 text-meta text-white/65">{PRICE_NOTE}</p>
          <p className="mt-3 text-body text-white/85">Your trusted household service desk + local life companion.</p>
        </div>
        <div className="p-6 sm:p-8">
          <ul className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b.label} className="flex items-center gap-3 text-body-sm font-semibold text-ink">
                {b.label === DIRECT_NAME ? (
                  <DirectMark size="sm" />
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">{b.icon}</span>
                )}
                {b.label}
              </li>
            ))}
          </ul>
          <button onClick={() => choose("MEMBERSHIP")} className="mt-7 inline-flex min-h-[60px] w-full items-center justify-center gap-2 rounded-pill bg-brand px-5 py-3 text-label font-bold text-white shadow-soft transition hover:bg-brand-dark active:scale-[0.98]">
            Start membership — {MEMBERSHIP_PRICE}/month
          </button>
          <p className="mt-2 text-center text-meta text-ink-3">{CHECKOUT_NOTE}</p>
        </div>
      </section>

      {/* The quieter alternative */}
      <section className="mt-8 rounded-card border border-dashed border-ink/20 px-5 py-6 text-center sm:px-8">
        <p className="font-serif text-section text-ink">Not ready yet?</p>
        <p className="mt-1 text-body-sm font-semibold uppercase tracking-wide text-ink-2">Try SeniorG free for {TRIAL_DAYS} days</p>
        <button onClick={() => choose("TRIAL")} className="mt-4 inline-flex min-h-[52px] items-center justify-center rounded-pill border border-brand/30 bg-card px-6 text-body-sm font-semibold text-brand-dark hover:border-brand/60 hover:bg-brand-tint">
          Start {TRIAL_DAYS}-day free trial
        </button>
        <p className="mt-3 text-meta text-ink-3">After the trial, membership continues at {MEMBERSHIP_PRICE_LABEL} unless cancelled.</p>
      </section>
    </div>
  );
}

// ── Step 7 · Demo checkout / confirmation ─────────────────────────────
function CheckoutStep({ onNext, onChangePlan }: StepProps & { onChangePlan: () => void }) {
  const { draft, update } = useOnboarding();
  const [busy, setBusy] = useState(false);
  const trial = draft.plan === "TRIAL";
  const ends = formatDay(trialEndDate());

  function confirm() {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      update({ planConfirmed: true });
    }, 1200);
  }

  if (draft.planConfirmed) {
    return (
      <StepFrame
        title={trial ? "Your free trial has started" : "Welcome to SeniorG Membership"}
        subtitle={trial ? `Enjoy everything SeniorG does until ${ends}.` : `Your membership is active at ${MEMBERSHIP_PRICE_LABEL}.`}
        action={
          <button className={primaryBtn} onClick={onNext}>
            Personalise SeniorG <ArrowRight size={20} />
          </button>
        }
      >
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease }} className="rounded-card bg-success-tint p-5">
          <p className="flex items-center gap-2 text-subhead text-success">
            <CheckCircle2 size={22} /> {trial ? "Trial confirmed" : "Membership confirmed"}
          </p>
          <p className="mt-2 text-body-sm text-ink">
            <span className="font-semibold">Demo only — no money was taken</span> and no payment method was charged.
          </p>
        </motion.div>
      </StepFrame>
    );
  }

  const rows: [string, string][] = trial
    ? [
        ["Plan", `${TRIAL_DAYS}-day free trial`],
        ["Due today", "₹0"],
        [`From ${ends}`, `${MEMBERSHIP_PRICE_LABEL} unless cancelled`],
      ]
    : [
        ["Plan", "SeniorG Membership"],
        ["Billed monthly", MEMBERSHIP_PRICE_LABEL],
        ["Due today", MEMBERSHIP_PRICE],
      ];

  return (
    <StepFrame
      eyebrow={<DemoBadge>Demo checkout</DemoBadge>}
      title={trial ? "Start your free trial" : "Confirm your membership"}
      action={
        <button className={primaryBtn} disabled={busy} onClick={confirm}>
          {busy ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Confirming…
            </>
          ) : trial ? (
            "Start free trial — demo"
          ) : (
            `Pay ${MEMBERSHIP_PRICE} — demo`
          )}
        </button>
      }
      note={`${CHECKOUT_NOTE}. ${PRICE_NOTE}.`}
    >
      <dl className="divide-y divide-line rounded-card border border-card-border bg-card px-5 shadow-soft">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 py-4">
            <dt className="text-body-sm text-ink-2">{k}</dt>
            <dd className="text-right font-semibold text-ink">{v}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-4">
          <dt className="text-body-sm text-ink-2">Payment method</dt>
          <dd className="flex items-center gap-1.5 rounded-pill bg-accent-tint px-3 py-1 text-tag font-bold uppercase tracking-wider text-accent-deep">
            <FlaskConical size={13} /> Demo
          </dd>
        </div>
      </dl>
      <button onClick={onChangePlan} className="mt-4 inline-flex min-h-[44px] items-center px-1 text-body-sm font-semibold text-brand-dark underline-offset-4 hover:underline">
        {trial ? `Choose membership — ${MEMBERSHIP_PRICE}/month instead` : `Change plan`}
      </button>
    </StepFrame>
  );
}

// ── Steps 8–11 · Personalisation ──────────────────────────────────────
function SupportStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  return (
    <StepFrame
      title="Who should SeniorG support?"
      action={
        <button className={primaryBtn} disabled={!draft.supportScope} onClick={onNext}>
          Continue <ArrowRight size={20} />
        </button>
      }
    >
      <div className="space-y-3" role="radiogroup" aria-label="Who should SeniorG support?">
        <ChoiceCard selected={draft.supportScope === "JUST_ME"} onClick={() => update({ supportScope: "JUST_ME" })} icon={<User size={22} />} title="Just me" />
        <ChoiceCard
          selected={draft.supportScope === "WITH_SPOUSE"}
          onClick={() => update({ supportScope: "WITH_SPOUSE" })}
          icon={<Users size={22} />}
          title="Me & my spouse"
          body="Each of you keeps an independent account. You choose what to share."
        />
      </div>
    </StepFrame>
  );
}

const FOCUS_OPTIONS: { id: HelpFocus; icon: React.ReactNode }[] = [
  { id: "HOME_SERVICES", icon: <Home size={22} /> },
  { id: "GO_WITH_ME", icon: <Users size={22} /> },
  { id: "REMINDERS", icon: <CalendarClock size={22} /> },
  { id: "LOCAL_ACTIVITIES", icon: <Ticket size={22} /> },
];

function FocusStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  const toggle = (id: HelpFocus) => update((d) => ({ focus: d.focus.includes(id) ? d.focus.filter((f) => f !== id) : [...d.focus, id] }));
  return (
    <StepFrame
      title="What would you like help with most?"
      subtitle="Choose any that apply."
      action={
        <button className={primaryBtn} disabled={draft.focus.length === 0} onClick={onNext}>
          Continue <ArrowRight size={20} />
        </button>
      }
    >
      <div className="space-y-3">
        {FOCUS_OPTIONS.map((o) => (
          <ChoiceCard key={o.id} multi selected={draft.focus.includes(o.id)} onClick={() => toggle(o.id)} icon={o.icon} title={FOCUS_LABEL[o.id]} />
        ))}
      </div>
    </StepFrame>
  );
}

const LANGUAGES: { id: HelpLanguage; native: string; lang: string }[] = [
  { id: "English", native: "English", lang: "en" },
  { id: "Hindi", native: "हिन्दी", lang: "hi" },
  { id: "Marathi", native: "मराठी", lang: "mr" },
];

function LanguageStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  return (
    <StepFrame
      title="Preferred help language"
      subtitle="SeniorG Direct and your providers will speak with you in this language where possible."
      action={
        <button className={primaryBtn} disabled={!draft.language} onClick={onNext}>
          Continue <ArrowRight size={20} />
        </button>
      }
    >
      <div className="space-y-3" role="radiogroup" aria-label="Preferred help language">
        {LANGUAGES.map((l) => (
          <ChoiceCard
            key={l.id}
            selected={draft.language === l.id}
            onClick={() => update({ language: l.id })}
            icon={<Languages size={22} />}
            title={
              <span>
                <span lang={l.lang}>{l.native}</span>
                {l.native !== l.id && <span className="ml-2 text-body-sm font-normal text-ink-2">{l.id}</span>}
              </span>
            }
          />
        ))}
      </div>
    </StepFrame>
  );
}

const STYLE_ICON: Record<AssistanceStyle, React.ReactNode> = {
  SELF: <Hand size={22} />,
  HELP_ME_BOOK: <HandHelping size={22} />,
  HANDLE_IT: <Headset size={22} />,
};

function StyleStep({ onNext }: StepProps) {
  const { draft, update } = useOnboarding();
  return (
    <StepFrame
      title="How would you like SeniorG to help?"
      subtitle="You can choose differently for any request."
      action={
        <button className={primaryBtn} disabled={!draft.assistance} onClick={onNext}>
          See my SeniorG Brief <ArrowRight size={20} />
        </button>
      }
    >
      <div className="space-y-3" role="radiogroup" aria-label="How would you like SeniorG to help?">
        {(Object.keys(ASSISTANCE_LABEL) as AssistanceStyle[]).map((id) => (
          <ChoiceCard key={id} selected={draft.assistance === id} onClick={() => update({ assistance: id })} icon={STYLE_ICON[id]} title={ASSISTANCE_LABEL[id].title} body={ASSISTANCE_LABEL[id].body} />
        ))}
      </div>
    </StepFrame>
  );
}
