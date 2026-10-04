import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Play, BadgeCheck, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ds/PageHeader";
import { SmartMinutePoster, SmartMinuteTile } from "@/components/SmartMinuteCard";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { SM_CATEGORIES, durationLabel, featuredSmartMinute, orderedFeed } from "@/lib/smartMinutes";
import type { SmartMinuteCategory } from "@/types/entities";

export function Learn() {
  const { state } = useStore();
  const person = useCurrentPerson();
  const [category, setCategory] = useState<SmartMinuteCategory | "ALL">("ALL");

  const feed = orderedFeed(state.videos);
  const featured = person ? featuredSmartMinute(state.videos, person) : undefined;
  const shown = feed.filter((v) => (category === "ALL" ? v.id !== featured?.id : v.category === category));
  const watchedCount = person ? feed.filter((v) => v.watchedBy.includes(person.id)).length : 0;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Smart Minutes"
        title="A little something useful, interesting or enjoyable every day."
        actions={
          <Link to="/explore/saved" className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-card px-4 text-body-sm font-semibold text-ink ring-1 ring-line hover:bg-sand">
            <Bookmark size={17} className="text-brand" /> Saved
          </Link>
        }
      />

      {featured && category === "ALL" && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}>
          <Link to={`/explore/learn/${featured.id}`} className="group grid overflow-hidden rounded-card bg-card shadow-hero ring-1 ring-card-border lg:grid-cols-[1.4fr_1fr]">
            <div className="relative">
              <SmartMinutePoster video={featured} className="aspect-video h-full w-full" rounded="rounded-none" showPlay={false} big />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-brand-deep shadow-lift transition duration-settle group-hover:scale-105">
                  <Play size={34} className="ml-1 fill-brand-deep" />
                </span>
              </span>
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-body-sm font-semibold text-needs">Today's Smart Minute · {SM_CATEGORIES[featured.category].label}</p>
              <p className="mt-2 font-serif text-title leading-tight text-ink">{featured.title}</p>
              <p className="mt-2 text-body text-ink-2">{featured.shortDescription}</p>
              <div className="mt-auto space-y-1 pt-5">
                <p className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-success">
                  <BadgeCheck size={17} /> {featured.verificationLabel}
                </p>
                <p className="text-body-sm text-ink-2">
                  {featured.sourceOrganisation} · {durationLabel(featured.durationSec)}
                </p>
              </div>
            </div>
          </Link>
        </motion.section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Categories">
          {(["ALL", ...Object.keys(SM_CATEGORIES)] as (SmartMinuteCategory | "ALL")[]).map((c) => {
            const active = category === c;
            const Icon = c === "ALL" ? null : SM_CATEGORIES[c].icon;
            return (
              <button
                key={c}
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={[
                  "inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-pill px-4 text-body-sm font-semibold transition",
                  active ? "bg-ink text-white" : "bg-card text-ink-2 ring-1 ring-line hover:text-ink",
                ].join(" ")}
              >
                {Icon && <Icon size={16} />}
                {c === "ALL" ? "Everything" : SM_CATEGORIES[c].label}
              </button>
            );
          })}
        </div>
        <p className="inline-flex items-center gap-1.5 text-body-sm text-ink-2">
          <CheckCircle2 size={16} className="text-success" /> {watchedCount} of {feed.length} watched
        </p>
      </div>

      <section aria-label="Smart Minutes" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((v) => (
          <SmartMinuteTile key={v.id} video={v} />
        ))}
      </section>

      <p className="max-w-reading text-meta text-ink-3">
        Curated by SeniorG from official and institutional sources — RBI, CyberDost (I4C), Ministry of Ayush, Sangeet Natak Akademi, Ministry of Tourism and others. Videos play on the source's own YouTube page; SeniorG does not host them.
      </p>
    </div>
  );
}
