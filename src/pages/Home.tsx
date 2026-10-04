import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, Headset, LifeBuoy, PlayCircle, ShieldCheck, Sun, Users, CheckCircle2, Sparkles } from "lucide-react";
import { DeskHome } from "./DeskHome";
import { FamilyHome } from "./FamilyHome";
import { Photo } from "@/components/ds/Photo";
import { SectionHeader } from "@/components/ds/SectionHeader";
import { ListRow, RowList, DateBlock } from "@/components/ds/ListRow";
import { MediaTile } from "@/components/ds/MediaTile";
import { StatusTimeline } from "@/components/ds/StatusTimeline";
import { PlannedState } from "@/components/ds/States";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { demoToday, formatLongDate, formatShortDateTime, daysUntil } from "@/lib/date";
import { getVisibleReminders, isFamilyRole } from "@/lib/visibility";
import { attentionFor, handledByDesk, spotlightRequest } from "@/lib/attention";
import { presentRequest, SERVICE_KIND } from "@/lib/presentation";
import { activeTickets, categoryMeta, priceLabel } from "@/lib/events";
import { eventImage, requestImage, videoImage, type ImageSlot } from "@/lib/imagery";
import { SM_CATEGORIES, durationLabel, featuredSmartMinute, recentlyWatched, savedSmartMinutes } from "@/lib/smartMinutes";
import { reminderSection } from "@/lib/reminderUrgency";

const ease = [0.2, 0, 0, 1] as const;

export function Home() {
  const person = useCurrentPerson();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  if (!person) return null;
  if (person.role === "COORDINATOR") return <DeskHome />;
  if (isFamilyRole(person)) return <FamilyHome />;
  if (person.role !== "MEMBER" && person.role !== "SPOUSE") {
    return (
      <PlannedState
        title="Admin and organiser views"
        body="Operations, the provider roster and the reminder-rules register are planned for a later release. Switch to Suresh, Asha, Meera, Rohan or Priya to explore SeniorG."
      />
    );
  }

  const firstName = person.name.split(" ")[0];
  const partnerId = state.household.memberIds.find((id) => id !== person.id);
  const partner = partnerId ? state.people[partnerId] : undefined;
  const hour = demoToday().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const spotlight = spotlightRequest(state, person);
  const sp = spotlight ? presentRequest(spotlight, state.providers, state.people, person.id) : undefined;
  const attention = attentionFor(state, person).filter((a) => a.id !== spotlight?.id);
  const desk = handledByDesk(state, person).filter((r) => r.id !== spotlight?.id);

  // Coming up: plans you've booked, scheduled visits, and dates on your calendar.
  const today = demoToday().getTime();
  const agenda = [
    ...activeTickets(state.tickets, person)
      .map((t) => ({ t, e: state.events[t.eventId] }))
      .filter(({ e }) => e && new Date(e.dateTime).getTime() >= today)
      .map(({ t, e }) => ({ id: t.id, at: e.dateTime, title: e.title, meta: t.inCalendarFor.includes(person.id) ? "Booked · in your calendar" : e.bookingType === "ASSOCIATION" ? "Registered" : "Booked", to: `/explore/${e.id}` })),
    ...getVisibleReminders(state.reminders, person)
      .filter((r) => reminderSection(r) === "upcoming" && daysUntil(r.dueDate) >= 0 && daysUntil(r.dueDate) <= 60)
      .map((r) => ({ id: r.id, at: r.dueDate, title: r.title, meta: r.ownerId === person.id ? "Reminder" : `Shared reminder`, to: `/household/reminders/${r.id}` })),
  ]
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
    .slice(0, 4);

  const nearYou = Object.values(state.events)
    .filter((e) => e.status === "ON_SALE" && new Date(e.dateTime).getTime() >= today)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);

  const minute = featuredSmartMinute(state.videos, person);
  const watched = recentlyWatched(state.videos, person);
  const saved = savedSmartMinutes(state.videos, person);
  const sharing = Object.values(state.people).filter(
    (p) => (p.role === "FAMILY_VIEWER" || p.role === "FAMILY_PAYER") && (p.permissions ?? []).some((g) => g.grantedBy === person.id && g.scope !== "NONE")
  );
  const family = Object.values(state.people).filter((p) => p.role === "FAMILY_VIEWER" || p.role === "FAMILY_PAYER");

  const calm = !spotlight && attention.length === 0;

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Greeting: who, where, when */}
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
        <p className="flex items-center gap-2 text-body-sm font-semibold text-brand-dark">
          <Sun size={16} /> {formatLongDate(demoToday().toISOString())}
        </p>
        <h1 className="mt-1 font-serif text-title text-ink sm:text-display">
          {greeting}, {firstName}
        </h1>
        <p className="mt-1 text-body text-ink-2">
          {partner ? `${person.name.split(" ")[0]} & ${partner.name.split(" ")[0]}` : firstName} · {state.household.address.split(",").slice(-2).join(",").trim()}
        </p>
      </motion.header>

      {/* TODAY: the one thing that matters most, or a calm day */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease, delay: 0.05 }} aria-label="Today">
        {spotlight && sp ? (
          <Link
            to={`/requests/${spotlight.id}`}
            className={[
              "group grid overflow-hidden rounded-card shadow-hero transition duration-calm hover:shadow-lift sm:grid-cols-[1fr_14rem]",
              sp.tone === "needs" ? "bg-accent text-ink" : "bg-brand-deep text-white",
            ].join(" ")}
          >
            <div className="p-6 sm:p-7">
              <p className={["text-body-sm font-semibold", sp.tone === "needs" ? "text-ink/75" : "text-white/75"].join(" ")}>
                {sp.tone === "needs" ? "Needs you today" : "Happening now"} · {SERVICE_KIND[spotlight.category]}
              </p>
              <p className="mt-2 text-balance font-serif text-title leading-tight sm:text-display">{sp.headline}</p>
              {sp.detail && <p className={["mt-2 text-body", sp.tone === "needs" ? "text-ink/80" : "text-white/85"].join(" ")}>{sp.detail}</p>}
              <div className="mt-5 max-w-sm">
                <StatusTimeline request={spotlight} compact onAccent={sp.tone === "needs"} />
              </div>
              <span
                className={[
                  "mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-pill px-5 font-semibold",
                  sp.tone === "needs" ? "bg-ink text-white" : "bg-white text-brand-deep",
                ].join(" ")}
              >
                {sp.tone === "needs" ? "Take a look" : "Open request"} <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
              </span>
            </div>
            <Photo slot={requestImage(spotlight)} className="hidden h-full min-h-[14rem] sm:block" rounded="rounded-none" eager />
          </Link>
        ) : (
          <Link to={attention[0]?.to ?? "/household"} className="relative block overflow-hidden rounded-card">
            <Photo slot="home" className="h-56 sm:h-72" rounded="rounded-card" eager />
            <div className="scrim-bottom absolute inset-0 rounded-card" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
              <p className="flex items-center gap-2 text-body-sm font-semibold text-white/85">
                <CheckCircle2 size={16} /> {calm ? "All calm today" : "When you're ready"}
              </p>
              <p className="mt-1 max-w-md font-serif text-title leading-tight">
                {calm ? "Nothing needs you right now. Enjoy your day." : `${attention[0].title}: ${attention[0].reason.charAt(0).toLowerCase()}${attention[0].reason.slice(1)}`}
              </p>
              {!calm && (
                <span className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-white px-5 text-body-sm font-semibold text-brand-deep">
                  Take a look <ArrowRight size={16} />
                </span>
              )}
            </div>
          </Link>
        )}
      </motion.section>

      {/* What needs you, and what SeniorG is handling */}
      {(attention.length > 0 || desk.length > 0) && (
        <section className="grid gap-6 xl:hidden">
          {attention.length > 0 && (
            <div>
              <SectionHeader title="Needs your attention" />
              <div className="surface-primary px-5">
                <RowList>
                  {attention.map((a) => (
                    <ListRow
                      key={a.id}
                      to={a.to}
                      leading={<span className="flex h-11 w-11 items-center justify-center rounded-full bg-needs-tint text-needs">{a.kind === "reminder" ? <CalendarClock size={20} /> : <Sparkles size={20} />}</span>}
                      title={a.title}
                      meta={a.reason}
                    />
                  ))}
                </RowList>
              </div>
            </div>
          )}
          {desk.length > 0 && (
            <div>
              <SectionHeader title="SeniorG is handling" icon={<Headset size={20} className="text-handling" />} />
              <div className="rounded-card bg-handling-tint px-5">
                <RowList className="divide-handling/15">
                  {desk.map((r) => (
                    <ListRow key={r.id} to={`/requests/${r.id}`} title={r.title} meta={presentRequest(r, state.providers, state.people, person.id).headline} />
                  ))}
                </RowList>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Coming up */}
      <section>
        <SectionHeader title="Coming up" action={{ label: "Your calendar", to: "/household/reminders" }} />
        {agenda.length === 0 ? (
          <p className="surface-secondary p-5 text-body-sm text-ink-2">A clear few weeks. Explore what's on nearby when you feel like it.</p>
        ) : (
          <div className="surface-primary px-5">
            <RowList>
              {agenda.map((a) => (
                <ListRow key={a.id} to={a.to} leading={<DateBlock iso={a.at} tone={a.meta.startsWith("Booked") || a.meta === "Registered" ? "brand" : "default"} />} title={a.title} meta={`${formatShortDateTime(a.at)} · ${a.meta}`} />
              ))}
            </RowList>
          </div>
        )}
      </section>

      {/* What SeniorG can do */}
      <section>
        <SectionHeader title="What can we take care of?" subtitle="One request, and SeniorG coordinates the rest." action={{ label: "All services", to: "/services" }} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {(
            [
              { slot: "ac", title: "Home repairs", meta: "AC, plumbing, electrical", to: "/services/ac-repair/book" },
              { slot: "station", title: "Go With Me", meta: "Airport, station, hospital", to: "/services/go-with-me/book" },
              { slot: "spices", title: "House help", meta: "While yours is away", to: "/services/house-help/book" },
            ] as { slot: ImageSlot; title: string; meta: string; to: string }[]
          ).map((s) => (
            <MediaTile key={s.title} slot={s.slot} to={s.to} title={s.title} meta={s.meta} ratio="square" overlay compact />
          ))}
          <button
            onClick={() => dispatch({ type: "TOGGLE_HELP_SHEET", open: true })}
            className="flex aspect-square flex-col rounded-card bg-brand-deep p-3.5 text-left text-white shadow-soft transition hover:shadow-lift"
          >
            <LifeBuoy size={26} className="text-accent" />
            <span className="mt-auto font-serif text-subhead leading-tight">Talk to SeniorG</span>
            <span className="mt-1 text-meta text-white/80">Anything else — a person helps</span>
          </button>
        </div>
      </section>

      {/* Near you */}
      {nearYou.length > 0 && (
        <section>
          <SectionHeader title="Near you this week" subtitle="Talks, music, walks and your association's events." action={{ label: "Explore", to: "/explore" }} />
          <div className="no-scrollbar -mx-gutter flex snap-x gap-3 overflow-x-auto px-gutter pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 2xl:grid-cols-4">
            {nearYou.map((e) => (
              <div key={e.id} className="w-64 shrink-0 snap-start sm:w-auto">
                <MediaTile
                  slot={eventImage(e)}
                  to={`/explore/${e.id}`}
                  eyebrow={`${categoryMeta(e.category).label} · ${e.distanceKm} km`}
                  title={e.title}
                  meta={
                    <>
                      {formatShortDateTime(e.dateTime)}
                      <span className="block font-semibold text-ink">{priceLabel(e).replace(" (illustrative demo price)", "")}</span>
                    </>
                  }
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Smart Minute */}
      {minute && (
        <section>
          <SectionHeader title="A Smart Minute for you" action={{ label: "All Smart Minutes", to: "/explore/learn" }} />
          <Link to={`/explore/learn/${minute.id}`} className="group grid overflow-hidden rounded-card border border-card-border bg-card shadow-soft transition hover:shadow-lift sm:grid-cols-[16rem_1fr]">
            <div className="relative">
              <Photo slot={videoImage(minute)} className="aspect-[16/9] h-full sm:aspect-auto" rounded="rounded-none" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-deep shadow-lift transition group-hover:scale-105">
                  <PlayCircle size={30} />
                </span>
              </span>
            </div>
            <div className="p-5">
              <p className="text-meta font-semibold text-ink-3">
                {SM_CATEGORIES[minute.category].label} · {durationLabel(minute.durationSec)}
              </p>
              <p className="mt-1 font-serif text-section leading-snug text-ink">{minute.title}</p>
              <p className="mt-1 text-body-sm text-ink-2">{minute.shortDescription}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-meta font-semibold text-success">
                <ShieldCheck size={15} /> {minute.verificationLabel} · {minute.sourceOrganisation.split(",")[0]}
              </p>
              {(watched || saved.length > 0) && (
                <p className="mt-3 border-t border-line pt-3 text-body-sm text-ink-2">
                  {watched && (
                    <>
                      Recently watched: <span className="font-semibold text-ink">{watched.title}</span>
                    </>
                  )}
                  {watched && saved.length > 0 && " · "}
                  {saved.length > 0 && (
                    <span>
                      Saved: <span className="font-semibold text-ink">{saved.length} Smart Minute{saved.length === 1 ? "" : "s"}</span>
                    </span>
                  )}
                </p>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Your circle */}
      <section>
        <button
          onClick={() => navigate("/household/family")}
          className="flex w-full items-center gap-4 rounded-card bg-sand p-5 text-left transition hover:bg-sand-deep"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-card text-brand-dark shadow-soft">
            <Users size={22} />
          </span>
          <span className="flex-1">
            <span className="block font-semibold text-ink">Your family circle</span>
            <span className="block text-body-sm text-ink-2">
              {sharing.length === 0
                ? `Nothing is shared with ${family.map((f) => f.name.split(" ")[0]).join(" or ") || "family"}. You decide what they see.`
                : `${sharing.map((f) => f.name.split(" ")[0]).join(" and ")} can see what you've chosen to share.`}
            </span>
          </span>
          <ArrowRight size={20} className="shrink-0 text-ink-3" />
        </button>
      </section>
    </div>
  );
}
