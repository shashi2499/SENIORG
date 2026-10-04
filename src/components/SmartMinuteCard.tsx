import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, CheckCircle2, Bookmark, Play, ShieldCheck } from "lucide-react";
import { Photo } from "@/components/ds/Photo";
import { useCurrentPerson } from "@/store/StoreContext";
import { SM_CATEGORIES, durationLabel } from "@/lib/smartMinutes";
import { videoImage } from "@/lib/imagery";
import type { LearningVideo } from "@/types/entities";

const SOURCE_SHORT: Record<string, string> = {
  "Reserve Bank of India": "RBI",
  "Indian Cybercrime Coordination Centre (I4C), Ministry of Home Affairs": "I4C · CyberDost",
};

// The poster for a Smart Minute. Safety pieces get a typographic poster
// naming the official source (so six safety films never repeat one stock photo);
// everything else is photographic.
export function SmartMinutePoster({ video, className = "", rounded = "rounded-card", showPlay = true, big }: { video: LearningVideo; className?: string; rounded?: string; showPlay?: boolean; big?: boolean }) {
  const safety = video.category === "STAY_SAFE";
  return (
    <div className={["relative overflow-hidden", rounded, className].join(" ")}>
      {safety ? (
        <div className="absolute inset-0 flex flex-col justify-between bg-brand-deep p-4 text-white sm:p-5">
          <ShieldCheck size={big ? 36 : 24} className="text-accent" />
          <div>
            <p className={["font-serif leading-none text-white/95", big ? "text-[3.5rem]" : "text-[2rem]"].join(" ")}>{SOURCE_SHORT[video.sourceOrganisation] ?? video.sourceOrganisation.split(",")[0]}</p>
            <p className="mt-1 text-meta text-white/70">Official guidance</p>
          </div>
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border-[18px] border-white/5" />
        </div>
      ) : (
        <Photo slot={videoImage(video)} className="absolute inset-0 h-full w-full" rounded="rounded-none" />
      )}
      {showPlay && (
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-pill bg-white/95 px-3 py-1.5 text-tag font-semibold text-ink shadow-soft">
          <Play size={13} className="fill-ink" /> {durationLabel(video.durationSec)}
        </span>
      )}
    </div>
  );
}

// Kept for older imports: the small square visual used in lists.
export function SmartMinuteThumb({ video, tall }: { video: LearningVideo; tall?: boolean }) {
  return <SmartMinutePoster video={video} className={tall ? "aspect-video w-full" : "h-16 w-16"} showPlay={!!tall} />;
}

export function SourceBadge({ video }: { video: LearningVideo }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-meta font-semibold text-success">
      <BadgeCheck size={15} /> {video.verificationLabel}
    </span>
  );
}

export function SmartMinuteTile({ video }: { video: LearningVideo }) {
  const person = useCurrentPerson();
  const watched = !!person && video.watchedBy.includes(person.id);
  const saved = !!person && video.savedBy.includes(person.id);
  return (
    <motion.div whileTap={{ scale: 0.985 }} className="h-full">
      <Link to={`/explore/learn/${video.id}`} className="group flex h-full flex-col overflow-hidden rounded-card border border-card-border bg-card shadow-soft transition hover:shadow-lift">
        <div className="relative">
          <SmartMinutePoster video={video} className="aspect-video" rounded="rounded-none" />
          {watched && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-pill bg-success px-2.5 py-1 text-tag font-semibold text-white">
              <CheckCircle2 size={13} /> Watched
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-meta font-semibold text-ink-3">{SM_CATEGORIES[video.category].label}</p>
          <p className={["text-body font-semibold leading-snug", watched ? "text-ink-2" : "text-ink"].join(" ")}>{video.title}</p>
          <p className="text-body-sm text-ink-2">{video.sourceOrganisation.split(",")[0]}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <SourceBadge video={video} />
            {saved && <Bookmark size={17} className="fill-brand text-brand" aria-label="Saved" />}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Compact row form, used in Saved.
export function SmartMinuteRow({ video }: { video: LearningVideo }) {
  const person = useCurrentPerson();
  const watched = !!person && video.watchedBy.includes(person.id);
  return (
    <Link to={`/explore/learn/${video.id}`} className="flex items-center gap-4 rounded-card border border-card-border bg-card p-3 pr-4 shadow-soft hover:shadow-lift">
      <SmartMinutePoster video={video} className="aspect-video w-32 shrink-0 sm:w-40" rounded="rounded-tile" showPlay={false} />
      <div className="min-w-0 flex-1">
        <p className="text-meta font-semibold text-ink-3">
          {SM_CATEGORIES[video.category].label} · {durationLabel(video.durationSec)}
        </p>
        <p className="font-semibold text-ink">{video.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3">
          <SourceBadge video={video} />
          {watched && (
            <span className="inline-flex items-center gap-1 text-meta font-semibold text-success">
              <CheckCircle2 size={14} /> Watched
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
