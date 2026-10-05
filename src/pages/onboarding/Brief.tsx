import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight, CalendarClock, FlaskConical, Clock3, Home, Languages, MapPin, PlayCircle, Ticket, User, Users, Wrench, HandHelping } from "lucide-react";
import { Wordmark } from "@/components/shell/TopBar";
import { DIRECT_NAME, DIRECT_TAGLINE, DirectMark } from "@/components/direct/SeniorGDirect";
import { useOnboarding } from "@/onboarding/OnboardingContext";
import { useStore } from "@/store/StoreContext";
import { demoToday } from "@/lib/date";
import { ASSISTANCE_LABEL, MUMBAI_PREVIEW_NOTE, planSummary, toProfile } from "@/lib/onboarding";
import type { HelpFocus } from "@/store/types";

const ease = [0.2, 0, 0, 1] as const;

const rise = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease, delay: 0.15 + i * 0.09 },
});

interface Item {
  label: string;
  icon: React.ReactNode;
  focus?: HelpFocus;
}

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Get things done",
    items: [
      { label: "Home Repairs", icon: <Wrench size={18} />, focus: "HOME_SERVICES" },
      { label: "Temporary House Help", icon: <Clock3 size={18} />, focus: "HOME_SERVICES" },
      { label: "Go With Me", icon: <Users size={18} />, focus: "GO_WITH_ME" },
    ],
  },
  { title: "Stay on top", items: [{ label: "Reminders & Renewals", icon: <CalendarClock size={18} />, focus: "REMINDERS" }] },
  { title: "Stay connected", items: [{ label: "Events & Activities", icon: <Ticket size={18} />, focus: "LOCAL_ACTIVITIES" }] },
  { title: "Stay smart", items: [{ label: "Smart Minutes", icon: <PlayCircle size={18} /> }] },
];

// The intentional moment between joining and using SeniorG: a short, personal
// brief that shows the person their SeniorG is set up — then one way in.
export function Brief() {
  const { draft, clear } = useOnboarding();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const profile = toProfile(draft);
  const first = profile.name.split(/\s+/)[0] ?? profile.name;
  const withSpouse = profile.supportScope === "WITH_SPOUSE";
  // Only the coherent demo couple is named together; a typed name never gets a seeded spouse.
  const partnerId = state.household.memberIds.find((id) => id !== profile.personId);
  const partnerFirst = withSpouse && profile.demoPersona && partnerId ? state.people[partnerId]?.name.split(" ")[0] : undefined;
  const headline = partnerFirst
    ? `SeniorG is ready for ${first} & ${partnerFirst}.`
    : withSpouse
      ? "Your SeniorG household is ready."
      : `SeniorG is ready for you, ${first}.`;
  const mumbai = profile.city === "Mumbai";

  const today = demoToday().getTime();
  const week = today + 7 * 24 * 60 * 60 * 1000;
  const eventsThisWeek = Object.values(state.events).filter((e) => {
    const t = new Date(e.dateTime).getTime();
    return e.status === "ON_SALE" && t >= today && t <= week;
  }).length;

  const enter = () => {
    dispatch({ type: "COMPLETE_ONBOARDING", profile: { ...profile, completedAt: new Date().toISOString() } });
    clear();
    navigate("/home", { replace: true });
    window.scrollTo(0, 0);
  };

  const things = [
    {
      icon: <Home size={18} />,
      text: mumbai ? "Home services for Mumbai — previewed with sample listings." : `Home services are available near you in ${profile.city}.`,
    },
    {
      icon: <Ticket size={18} />,
      text: mumbai
        ? "Events and activities — previewed with sample listings."
        : eventsThisWeek > 0
          ? `${eventsThisWeek} events and activities this week.`
          : "New events and activities every week.",
    },
    { icon: null, text: `${DIRECT_NAME} is available whenever you need help.` },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-surface pb-36 sm:pb-16">
        {/* Header band */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="mx-auto max-w-content page-gutter pb-14 pt-6 sm:pb-16">
            <Wordmark light />
            <motion.p {...rise(0)} className="mt-10 text-tag font-semibold uppercase tracking-[0.18em] text-accent">
              Your SeniorG Brief
            </motion.p>
            <motion.p {...rise(1)} className="mt-3 break-words text-[1.5rem] font-semibold uppercase tracking-[0.08em] sm:text-[1.75rem]">
              {profile.name}
            </motion.p>
            <motion.p {...rise(1)} className="mt-1 flex items-center gap-1.5 text-body text-white/80">
              <MapPin size={18} /> {profile.city}
            </motion.p>
            <motion.h1 {...rise(2)} className="mt-6 font-serif text-[2.25rem] leading-tight sm:text-[3rem]">
              {headline}
            </motion.h1>
            <motion.p {...rise(3)} className="mt-4 inline-block rounded-tile bg-white/10 px-4 py-2 text-body-sm text-white/90">
              {planSummary(profile.plan)} <span className="whitespace-nowrap text-white/60">· illustrative prototype price</span>
            </motion.p>
          </div>
        </section>

        <div className="relative z-10 mx-auto -mt-8 max-w-content space-y-8 page-gutter">
          {/* Three things worth knowing */}
          <motion.section {...rise(4)} className="rounded-[1.5rem] bg-card p-5 shadow-lift ring-1 ring-card-border sm:p-7">
            <h2 className="flex items-center gap-3 text-subhead text-ink">
              <DirectMark size="md" /> 3 things worth knowing
            </h2>
            <ul className="mt-4 space-y-3">
              {things.map((t) => (
                <li key={t.text} className="flex items-start gap-3 text-body text-ink">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                    {t.icon ?? <DirectMark size="sm" />}
                  </span>
                  {t.text}
                </li>
              ))}
            </ul>
            {mumbai && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-pill border border-dashed border-accent-deep/40 bg-accent-tint px-3 py-1 text-meta text-ink">
                <FlaskConical size={14} className="shrink-0 text-accent-deep" /> {MUMBAI_PREVIEW_NOTE}
              </p>
            )}
          </motion.section>

          {/* Your SeniorG, at a glance */}
          <section>
            <motion.h2 {...rise(5)} className="font-serif text-section text-ink">
              Your SeniorG
            </motion.h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {GROUPS.map((g, gi) => (
                <motion.div key={g.title} {...rise(6 + gi)} className={["rounded-card bg-card p-5 ring-1 ring-card-border", gi === 0 ? "sm:row-span-2" : ""].join(" ")}>
                  <p className="text-tag font-semibold uppercase tracking-[0.14em] text-brand">{g.title}</p>
                  <ul className="mt-3 space-y-2.5">
                    {g.items.map((it) => {
                      const mine = !!it.focus && profile.focus.includes(it.focus);
                      return (
                        <li key={it.label} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-brand-dark">{it.icon}</span>
                          <span className="font-semibold text-ink">{it.label}</span>
                          {mine && <span className="rounded-pill bg-accent-tint px-2.5 py-0.5 text-tag font-semibold text-accent-deep">Your focus</span>}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
              <motion.div {...rise(10)} className="flex items-center gap-4 rounded-card bg-brand-deep p-5 text-white sm:col-span-2">
                <DirectMark size="lg" pulse />
                <div>
                  <p className="text-tag font-semibold uppercase tracking-[0.14em] text-accent">Connect</p>
                  <p className="mt-1 font-serif text-subhead">{DIRECT_NAME}</p>
                  <p className="text-body-sm text-white/80">{DIRECT_TAGLINE} — call or chat with a person. Look for the bell.</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* How SeniorG will work for you */}
          <motion.section {...rise(11)} className="rounded-card bg-sand p-5 sm:p-6">
            <h2 className="text-subhead text-ink">How SeniorG will work for you</h2>
            <ul className="mt-3 space-y-2.5 text-body-sm text-ink">
              <li className="flex items-start gap-3">
                {profile.supportScope === "WITH_SPOUSE" ? <Users size={18} className="mt-0.5 shrink-0 text-brand" /> : <User size={18} className="mt-0.5 shrink-0 text-brand" />}
                {partnerFirst
                  ? `Supporting you and ${partnerFirst} — each with an independent account.`
                  : withSpouse
                    ? "Supporting your household — your spouse can join with their own independent account."
                    : "Supporting you. Your account is yours alone."}
              </li>
              <li className="flex items-start gap-3">
                <Languages size={18} className="mt-0.5 shrink-0 text-brand" /> Help in {profile.language}, where possible.
              </li>
              <li className="flex items-start gap-3">
                <HandHelping size={18} className="mt-0.5 shrink-0 text-brand" /> {ASSISTANCE_LABEL[profile.assistance].brief}
              </li>
            </ul>
          </motion.section>
        </div>

        {/* One way in */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-gutter pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:mx-auto sm:mt-10 sm:max-w-content sm:border-0 sm:bg-transparent sm:px-6 sm:pt-0 sm:backdrop-blur-none lg:px-10">
          <button
            onClick={enter}
            className="group inline-flex min-h-[60px] w-full items-center justify-center gap-2 rounded-pill bg-brand px-8 text-label font-bold uppercase tracking-wide text-white shadow-hero transition hover:bg-brand-dark active:scale-[0.98] sm:w-auto"
          >
            Enter SeniorG <ArrowRight size={20} className="transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </MotionConfig>
  );
}
