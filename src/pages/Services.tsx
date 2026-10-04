import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Wrench,
  Zap,
  Droplet,
  Settings2,
  Hammer,
  Bug,
  Sparkles,
  Plane,
  TrainFront,
  Stethoscope,
  CalendarClock,
  ExternalLink,
  Landmark,
  FileText,
  HeartPulse,
  ShieldCheck,
  KeyRound,
  BadgeIndianRupee,
  UserCheck,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ds/PageHeader";
import { SectionHeader } from "@/components/ds/SectionHeader";
import { Photo } from "@/components/ds/Photo";
import { ListRow, RowList, IconBadge } from "@/components/ds/ListRow";
import { ServiceStartSheet } from "@/components/ServiceStartSheet";
import { ScopeTag } from "@/components/ui/ScopeTag";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { getVisibleReminders } from "@/lib/visibility";
import { reminderUrgency } from "@/lib/reminderUrgency";
import type { Service } from "@/types/entities";

const REPAIRS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "SV-ELECTRICAL", label: "Electrical", icon: Zap },
  { id: "SV-PLUMBING", label: "Plumbing", icon: Droplet },
  { id: "SV-APPLIANCES", label: "Appliances", icon: Settings2 },
  { id: "SV-CARPENTRY", label: "Carpentry", icon: Hammer },
  { id: "SV-PEST", label: "Pest control", icon: Bug },
  { id: "SV-CLEANING", label: "Deep cleaning", icon: Sparkles },
];

const ease = [0.2, 0, 0, 1] as const;

export function Services() {
  const { state } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const [startService, setStartService] = useState<Service | null>(null);
  const ac = state.services["SV-AC"];
  const reminders = person
    ? getVisibleReminders(state.reminders, person)
        .filter((r) => r.status !== "DONE")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3)
    : [];

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Book through SeniorG"
        title="What can we take care of?"
        subtitle="One request, a verified person, a clear price — and SeniorG coordinating until it's done."
      />

      {/* HOME REPAIRS — getting something fixed */}
      <Experience
        slot="ac"
        kicker="Home repairs"
        title="Something not working? Let's get it fixed."
        delay={0}
        points={[
          { icon: UserCheck, text: "ID-checked professionals with a track record" },
          { icon: KeyRound, text: "An arrival code, so you know who's at the door" },
          { icon: BadgeIndianRupee, text: `Visit from ₹${ac?.visitFee ?? 399}; nothing extra without your approval` },
        ]}
        primary={{ label: "Book AC repair", to: "/services/ac-repair/book" }}
      >
        <p className="mb-2 text-body-sm font-semibold text-ink-2">Or something else at home</p>
        <div className="flex flex-wrap gap-2">
          {REPAIRS.map(({ id, label, icon: Icon }) => {
            const s = state.services[id];
            if (!s) return null;
            return (
              <button
                key={id}
                onClick={() => setStartService(s)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-line bg-card px-4 text-body-sm font-semibold text-ink hover:border-brand/40 hover:bg-brand-tint"
              >
                <Icon size={17} className="text-brand" /> {label}
              </button>
            );
          })}
        </div>
      </Experience>

      {/* GO WITH ME — movement, destination, accompaniment */}
      <Experience
        slot="station"
        kicker="Go With Me"
        title="Someone to go with you, there and back."
        delay={0.05}
        reverse
        primary={{ label: "Plan a trip", to: "/services/go-with-me/book" }}
      >
        <ol className="space-y-0">
          {[
            { icon: Plane, title: "Airport", text: "Cab, check-in help and a companion until security" },
            { icon: TrainFront, title: "Railway station", text: "To the right platform, luggage and all" },
            { icon: Stethoscope, title: "Hospital visit", text: "Registration, waiting and the ride home — never medical decisions" },
          ].map((d, i, arr) => (
            <li key={d.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-tint text-needs">
                  <d.icon size={19} />
                </span>
                {i < arr.length - 1 && <span className="my-1 w-0.5 flex-1 bg-line" />}
              </div>
              <div className="pb-4">
                <p className="font-semibold text-ink">{d.title}</p>
                <p className="text-body-sm text-ink-2">{d.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Experience>

      {/* TEMPORARY HOUSE HELP — continuity and schedule */}
      <Experience
        slot="spices"
        kicker="Temporary house help"
        title="When your regular help is away, the house keeps running."
        delay={0.1}
        primary={{ label: "Arrange help", to: "/services/house-help/book" }}
      >
        <div className="rounded-tile bg-sand p-4">
          <p className="mb-3 text-body-sm font-semibold text-ink-2">A week, day by day</p>
          <div className="grid grid-cols-7 gap-1.5">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className={["flex aspect-square flex-col items-center justify-center rounded-tile text-tag font-semibold", i < 3 ? "bg-success-tint text-success" : i === 3 ? "bg-brand text-white" : "bg-card text-ink-3"].join(" ")}>
                {d}
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-1.5 text-body-sm text-ink-2">
            <li className="flex items-center gap-2"><UserCheck size={16} className="text-brand" /> The same helper each day, if you like</li>
            <li className="flex items-center gap-2"><RefreshCcw size={16} className="text-brand" /> A backup if they can't come</li>
            <li className="flex items-center gap-2"><BadgeIndianRupee size={16} className="text-brand" /> Pay only for days served</li>
          </ul>
        </div>
      </Experience>

      {/* REMINDERS — peace of mind */}
      <section className="grid gap-6 overflow-hidden rounded-card bg-brand-deep p-6 text-white sm:p-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="flex items-center gap-2 text-body-sm font-semibold text-accent">
            <CalendarClock size={18} /> Dates & renewals
          </p>
          <h2 className="mt-2 font-serif text-title leading-tight text-white">Nothing important slips by.</h2>
          <p className="mt-2 text-body text-white/80">
            Life certificate, mediclaim, Form 15H, property tax. SeniorG reminds you early — and helps when you want it.
          </p>
          <Link to="/household/reminders" className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-pill bg-white px-5 font-semibold text-brand-deep hover:bg-brand-tint">
            See your dates <ArrowRight size={18} />
          </Link>
        </div>
        <ul className="space-y-2 self-center">
          {reminders.map((r) => {
            const u = reminderUrgency(r);
            return (
              <li key={r.id}>
                <Link to={`/household/reminders/${r.id}`} className="flex items-center justify-between gap-3 rounded-tile bg-white/10 px-4 py-3 hover:bg-white/15">
                  <span className="font-semibold">{r.title}</span>
                  <span className={["shrink-0 text-body-sm", u.tone === "critical" || u.tone === "warning" ? "text-accent" : "text-white/75"].join(" ")}>{u.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* PARTNERS — clearly not booked through SeniorG */}
      <section>
        <SectionHeader title="With trusted partners" subtitle="SeniorG prepares you and connects you. The partner provides the service, under their own terms." />
        <div className="surface-primary px-5">
          <RowList>
            {[
              { id: "SV-BANKING", icon: Landmark, text: "Doorstep banking and pension guidance" },
              { id: "SV-TAX", icon: FileText, text: "ITR, Form 15H and will-writing" },
            ].map((p) => (
              <ListRow
                key={p.id}
                to={`/services/${p.id}`}
                leading={<IconBadge icon={p.icon} tint="bg-indigo-tint text-indigo" />}
                title={state.services[p.id]?.name}
                meta={p.text}
                trailing={
                  <span className="hidden items-center gap-1 rounded-pill border border-line px-3 py-1 text-tag font-semibold text-ink-2 sm:inline-flex">
                    <ExternalLink size={13} /> Continue with partner
                  </span>
                }
              />
            ))}
          </RowList>
        </div>
      </section>

      <section>
        <button onClick={() => navigate("/services/SV-HEALTH")} className="flex w-full items-center gap-4 rounded-card border border-dashed border-line p-5 text-left hover:bg-sand">
          <IconBadge icon={HeartPulse} tint="bg-sand text-ink-3" />
          <span className="flex-1">
            <span className="block font-semibold text-ink-2">Health coordination</span>
            <span className="block text-body-sm text-ink-3">Not offered yet. We won't promise a date we can't keep.</span>
          </span>
          <span className="rounded-pill bg-sand px-3 py-1 text-tag font-semibold text-ink-3">Later</span>
        </button>
      </section>

      <p className="flex items-center gap-2 text-meta text-ink-3">
        <ShieldCheck size={15} /> All prices shown are illustrative demo prices, not SeniorG tariffs.
      </p>

      <ServiceStartSheet service={startService} onClose={() => setStartService(null)} />
    </div>
  );
}

function Experience({
  slot,
  kicker,
  title,
  points,
  primary,
  children,
  reverse,
  delay,
}: {
  slot: "ac" | "station" | "spices";
  kicker: string;
  title: string;
  points?: { icon: LucideIcon; text: string }[];
  primary: { label: string; to: string };
  children?: React.ReactNode;
  reverse?: boolean;
  delay: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease, delay }}
      className="overflow-hidden rounded-card border border-card-border bg-card shadow-soft lg:grid lg:grid-cols-2"
    >
      <Photo slot={slot} className={["h-52 sm:h-64 lg:h-full lg:min-h-[26rem]", reverse ? "lg:order-2" : ""].join(" ")} rounded="rounded-none" />
      <div className="flex flex-col p-6 sm:p-8">
        <p className="flex flex-wrap items-center gap-2 text-body-sm font-semibold text-brand-dark">
          {kicker} <ScopeTag tag={slot === "ac" ? "CORE" : "SHOWCASE"} />
        </p>
        <h2 className="mt-1 text-balance font-serif text-title leading-tight text-ink">{title}</h2>
        {points && (
          <ul className="mt-4 space-y-2.5">
            {points.map((p) => (
              <li key={p.text} className="flex items-start gap-3 text-body-sm text-ink-2">
                <p.icon size={18} className="mt-0.5 shrink-0 text-brand" /> {p.text}
              </li>
            ))}
          </ul>
        )}
        {children && <div className="mt-5">{children}</div>}
        <div className="mt-6 lg:mt-auto lg:pt-6">
          <Link to={primary.to} className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-pill bg-brand px-6 text-label font-semibold text-white shadow-soft hover:bg-brand-dark sm:w-auto">
            {primary.label} <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
