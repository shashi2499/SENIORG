import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle, Bookmark, MapPin, ArrowRight, Users } from "lucide-react";
import { PageHeader } from "@/components/ds/PageHeader";
import { CityPreviewNote, useJoinedProfile } from "@/components/direct/CityPreviewNote";
import { SectionHeader } from "@/components/ds/SectionHeader";
import { Photo } from "@/components/ds/Photo";
import { ListRow, RowList, DateBlock } from "@/components/ds/ListRow";
import { EmptyState } from "@/components/ds/States";
import { EventCard } from "@/components/EventCard";
import { BookingTypeBadge } from "@/components/ui/BookingTypeBadge";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { CATEGORY_META, activeTickets, categoryMeta, priceLabel } from "@/lib/events";
import { eventImage } from "@/lib/imagery";
import { demoToday, formatShortDateTime } from "@/lib/date";
import type { SeniorGEvent } from "@/types/entities";

type Filters = { category: string; free: boolean; stepFree: boolean; thisWeek: boolean; couples: boolean };
const NO_FILTERS: Filters = { category: "ALL", free: false, stepFree: false, thisWeek: false, couples: false };

function chip(active: boolean) {
  return [
    "inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-pill px-4 text-body-sm font-semibold transition",
    active ? "bg-ink text-white" : "bg-card text-ink-2 ring-1 ring-line hover:text-ink",
  ].join(" ");
}

export function Explore() {
  const { state } = useStore();
  const person = useCurrentPerson();
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);

  const today = demoToday().getTime();
  const weekEnd = today + 7 * 24 * 60 * 60 * 1000;
  const upcoming = Object.values(state.events)
    .filter((e) => e.status !== "CANCELLED" && new Date(e.dateTime).getTime() >= today)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  const present = new Set(upcoming.map((e) => e.category));
  const categories = Object.keys(CATEGORY_META).filter((c) => present.has(c));

  const matches = (e: SeniorGEvent) =>
    (filters.category === "ALL" || e.category === filters.category) &&
    (!filters.free || e.priceFrom === 0) &&
    (!filters.stepFree || e.accessibility.stepFree) &&
    (!filters.thisWeek || new Date(e.dateTime).getTime() <= weekEnd) &&
    (!filters.couples || e.goodForCouples);
  const filtered = upcoming.filter(matches);
  const pristine = JSON.stringify(filters) === JSON.stringify(NO_FILTERS);
  const featured = upcoming.find((e) => e.id === "EV-THEATRE-01" && e.status === "ON_SALE") ?? upcoming.find((e) => e.status === "ON_SALE");
  const thisWeek = upcoming.filter((e) => e.status === "ON_SALE" && new Date(e.dateTime).getTime() <= weekEnd && e.id !== featured?.id);
  const association = upcoming.filter((e) => e.bookingType === "ASSOCIATION");
  const plans = person ? activeTickets(state.tickets, person) : [];
  const joined = useJoinedProfile();

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} /> {joined?.city === "Mumbai" ? "Mumbai preview" : "Near Kothrud, Pune"}
          </span>
        }
        title="What can I do nearby?"
        subtitle="Theatre, music, talks, walks, hobbies and your association's own events."
        actions={
          <>
            <Link to="/explore/saved" className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-card px-4 text-body-sm font-semibold text-ink ring-1 ring-line hover:bg-sand">
              <Bookmark size={17} className="text-brand" /> Saved
            </Link>
          </>
        }
      />
      <CityPreviewNote className="-mt-8" />

      {/* Your plans */}
      {plans.length > 0 && (
        <section>
          <SectionHeader title="Your plans" />
          <div className="surface-primary px-5">
            <RowList>
              {plans.map((t) => {
                const e = state.events[t.eventId];
                return (
                  <ListRow
                    key={t.id}
                    to={`/explore/${e.id}`}
                    leading={<DateBlock iso={e.dateTime} tone="brand" />}
                    title={e.title}
                    meta={`${formatShortDateTime(e.dateTime)} · ${t.attendees.map((id) => state.people[id]?.name.split(" ")[0]).join(" & ")}${t.inCalendarFor.includes(person!.id) ? " · in your calendar" : ""}`}
                  />
                );
              })}
            </RowList>
          </div>
        </section>
      )}

      {/* Featured */}
      {pristine && featured && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}>
          <Link to={`/explore/${featured.id}`} className="group relative block overflow-hidden rounded-card shadow-hero">
            <Photo slot={eventImage(featured)} className="h-72 sm:h-[26rem]" rounded="rounded-card" eager />
            <div className="scrim-bottom absolute inset-0" />
            <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
              <BookingTypeBadge type={featured.bookingType} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              <p className="text-body-sm font-semibold text-accent">This weekend · {categoryMeta(featured.category).label}</p>
              <p className="mt-1 max-w-xl font-serif text-title leading-tight sm:text-display">{featured.title}</p>
              <p className="mt-2 text-body-sm text-white/85">
                {formatShortDateTime(featured.dateTime)} · {featured.venue} · {priceLabel(featured).replace(" (illustrative demo price)", "")}
              </p>
              <span className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-white px-5 text-body-sm font-semibold text-brand-deep">
                See the details <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </motion.section>
      )}

      {/* Browse */}
      <section aria-label="Categories and filters" className="space-y-3">
        <div className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter sm:mx-0 sm:flex-wrap sm:px-0">
          <button className={chip(filters.category === "ALL")} aria-pressed={filters.category === "ALL"} onClick={() => setFilters({ ...filters, category: "ALL" })}>
            Everything
          </button>
          {categories.map((c) => {
            const Icon = CATEGORY_META[c].icon;
            return (
              <button key={c} className={chip(filters.category === c)} aria-pressed={filters.category === c} onClick={() => setFilters({ ...filters, category: c })}>
                <Icon size={16} /> {CATEGORY_META[c].label}
              </button>
            );
          })}
        </div>
        <div className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter sm:mx-0 sm:px-0">
          {(
            [
              ["free", "Free"],
              ["stepFree", "Step-free"],
              ["thisWeek", "This week"],
              ["couples", "Good for couples"],
            ] as [keyof Filters, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              aria-pressed={!!filters[k]}
              onClick={() => setFilters({ ...filters, [k]: !filters[k] })}
              className={[
                "inline-flex min-h-[40px] shrink-0 items-center rounded-pill border px-4 text-body-sm font-semibold",
                filters[k] ? "border-brand bg-brand-tint text-brand-dark" : "border-line text-ink-2 hover:bg-sand",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
          {!pristine && (
            <button className="shrink-0 px-3 text-body-sm font-semibold text-brand-dark underline-offset-4 hover:underline" onClick={() => setFilters(NO_FILTERS)}>
              Clear
            </button>
          )}
        </div>
      </section>

      {pristine && thisWeek.length > 0 && (
        <section>
          <SectionHeader title="This week near you" />
          <div className="no-scrollbar -mx-gutter flex snap-x gap-3 overflow-x-auto px-gutter pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {thisWeek.map((e) => (
              <div key={e.id} className="w-72 shrink-0 snap-start sm:w-auto">
                <EventCard event={e} />
              </div>
            ))}
          </div>
        </section>
      )}

      {pristine && association.length > 0 && (
        <section className="overflow-hidden rounded-card bg-accent-tint">
          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            <div className="relative">
              <Photo slot="meeting" className="h-48 lg:h-full" rounded="rounded-none" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="flex items-center gap-2 text-body-sm font-semibold text-needs">
                <Users size={18} /> From your association
              </p>
              <h2 className="mt-1 font-serif text-title leading-tight text-ink">Retired Bankers' Pune chapter</h2>
              <p className="mt-1 text-body text-ink-2">Meets, talks, mentoring and volunteering — free to register, spouses welcome.</p>
              <ul className="mt-4 divide-y divide-needs/15">
                {association.map((e) => (
                  <li key={e.id}>
                    <Link to={`/explore/${e.id}`} className="flex items-center gap-4 py-3 hover:underline">
                      <DateBlock iso={e.dateTime} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{e.title.replace(/ \(fictional\)$/, "")}</span>
                        <span className="block text-body-sm text-ink-2">
                          {formatShortDateTime(e.dateTime)} · {e.priceFrom === 0 ? "Free" : `₹${e.priceFrom}`}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {pristine && (
        <Link to="/explore/learn" className="group grid items-center gap-5 overflow-hidden rounded-card bg-brand-deep text-white shadow-hero sm:grid-cols-[1fr_16rem]">
          <div className="p-6 sm:p-8">
            <p className="flex items-center gap-2 text-body-sm font-semibold text-accent">
              <PlayCircle size={18} /> Smart Minutes
            </p>
            <p className="mt-1 font-serif text-title leading-tight">A little something useful, interesting or enjoyable every day.</p>
            <p className="mt-2 text-body-sm text-white/80">Short videos from RBI, Ministry of Ayush, Sangeet Natak Akademi and more.</p>
          </div>
          <Photo slot="diya" className="hidden h-full min-h-[12rem] sm:block" rounded="rounded-none" />
        </Link>
      )}

      <section>
        <SectionHeader title={pristine ? "Everything coming up" : `${filtered.length} event${filtered.length === 1 ? "" : "s"} match`} />
        {filtered.length === 0 ? (
          <EmptyState title="Nothing matches these filters" body="Try fewer filters, or look at everything coming up." action={{ label: "Clear filters", onClick: () => setFilters(NO_FILTERS) }} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

