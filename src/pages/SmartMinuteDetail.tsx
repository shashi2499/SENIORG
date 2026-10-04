import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, CheckCircle2, Circle, ExternalLink, Lightbulb, Play, Share2, ArrowRight, Languages, Clock, BadgeCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { EmptyState } from "@/components/ds/States";
import { SmartMinutePoster } from "@/components/SmartMinuteCard";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { SM_CATEGORIES, durationLabel, nextSmartMinute } from "@/lib/smartMinutes";

type SheetMode = null | "leaving" | "share";

export function SmartMinuteDetail() {
  const { videoId } = useParams();
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const [mode, setMode] = useState<SheetMode>(null);
  const [openedExternal, setOpenedExternal] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const video = videoId ? state.videos[videoId] : undefined;

  if (!video || !person) {
    return <EmptyState title="We can't find that Smart Minute" action={{ label: "All Smart Minutes", onClick: () => navigate("/explore/learn") }} />;
  }

  const saved = video.savedBy.includes(person.id);
  const watched = video.watchedBy.includes(person.id);
  const next = nextSmartMinute(state.videos, video.id);
  const meta = SM_CATEGORIES[video.category];
  // Share with the household and with family already in Family Circle.
  const contacts = Object.values(state.people).filter((p) => p.id !== person.id && ["MEMBER", "SPOUSE", "FAMILY_VIEWER", "FAMILY_PAYER"].includes(p.role));

  function continueToYouTube() {
    if (video?.videoUrl) window.open(video.videoUrl, "_blank", "noopener,noreferrer");
    setOpenedExternal(true);
    setMode(null);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Player area: honest about where the video plays */}
        <div className="space-y-3">
          <button onClick={() => setMode("leaving")} className="group relative block w-full overflow-hidden rounded-card shadow-hero" aria-label={`Watch ${video.title} on YouTube`}>
            <SmartMinutePoster video={video} className="aspect-video w-full" rounded="rounded-none" showPlay={false} big />
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/15 transition group-hover:bg-ink/25">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-brand-deep shadow-lift transition duration-settle group-hover:scale-105">
                <Play size={36} className="ml-1 fill-brand-deep" />
              </span>
              <span className="rounded-pill bg-ink/70 px-3 py-1 text-tag font-semibold text-white">Plays on YouTube</span>
            </span>
          </button>
          <AnimatePresence>
            {openedExternal && !watched && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 rounded-card bg-success-tint p-4 sm:flex-row sm:items-center">
                <p className="flex-1 text-body-sm text-ink">
                  <strong className="font-semibold">Back from YouTube?</strong> If you watched it, mark it so you can find it later.
                </p>
                <Button size="md" onClick={() => dispatch({ type: "TOGGLE_VIDEO_WATCHED", videoId: video.id, personId: person.id })}>
                  <CheckCircle2 size={18} /> Yes, mark as watched
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-body-sm font-semibold text-brand-dark">{meta.label}</p>
            <h1 className="mt-1 text-balance font-serif text-title leading-tight text-ink sm:text-display">{video.title}</h1>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-ink-2">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={16} /> {durationLabel(video.durationSec)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Languages size={16} /> {video.language}
              </span>
              {watched && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-success">
                  <CheckCircle2 size={16} /> Watched
                </span>
              )}
            </div>
          </div>
          <div className="rounded-card border border-card-border bg-card p-4">
            <p className="flex items-start gap-2 text-body-sm font-semibold text-ink">
              <Building2 size={18} className="mt-0.5 shrink-0 text-ink-3" /> {video.sourceOrganisation}
            </p>
            <p className="ml-[26px] text-meta text-ink-3">{video.sourceChannel}</p>
            <p className="ml-[26px] mt-2 inline-flex items-center gap-1.5 text-body-sm font-semibold text-success">
              <BadgeCheck size={17} /> {video.verificationLabel}
            </p>
          </div>
          <p className="text-body text-ink-2">{video.shortDescription}</p>
          <div className="grid grid-cols-3 gap-2">
            <ActionChip active={saved} onClick={() => dispatch({ type: "TOGGLE_SAVE_VIDEO", videoId: video.id, personId: person.id })} icon={<Bookmark size={20} className={saved ? "fill-brand text-brand" : ""} />} label={saved ? "Saved" : "Save"} />
            <ActionChip active={watched} onClick={() => dispatch({ type: "TOGGLE_VIDEO_WATCHED", videoId: video.id, personId: person.id })} icon={watched ? <CheckCircle2 size={20} className="text-success" /> : <Circle size={20} />} label={watched ? "Watched" : "Mark watched"} />
            <ActionChip onClick={() => setMode("share")} icon={<Share2 size={20} />} label="Share" />
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-card bg-sand p-6">
          <p className="text-body-sm font-semibold text-brand-dark">Why this matters</p>
          <p className="mt-2 font-serif text-section leading-snug text-ink">{video.whyItMatters}</p>
        </div>
        <div className="rounded-card bg-brand-deep p-6 text-white">
          <p className="flex items-center gap-1.5 text-body-sm font-semibold text-accent">
            <Lightbulb size={17} /> Key takeaway
          </p>
          <p className="mt-2 font-serif text-section leading-snug">{video.keyTakeaway}</p>
        </div>
      </section>
      <p className="text-meta text-ink-3">Summary written by SeniorG. The video itself is by {video.sourceOrganisation.split(",")[0]}.</p>

      {next && (
        <Link to={`/explore/learn/${next.id}`} className="group flex items-center gap-4 rounded-card border border-card-border bg-card p-3 pr-5 shadow-soft hover:shadow-lift">
          <SmartMinutePoster video={next} className="aspect-video w-36 shrink-0 sm:w-48" rounded="rounded-tile" showPlay={false} />
          <span className="min-w-0 flex-1">
            <span className="block text-meta font-semibold text-ink-3">Next Smart Minute · {SM_CATEGORIES[next.category].label}</span>
            <span className="block font-semibold text-ink">{next.title}</span>
            <span className="block text-body-sm text-ink-2">{durationLabel(next.durationSec)}</span>
          </span>
          <ArrowRight size={22} className="shrink-0 text-brand transition group-hover:translate-x-0.5" />
        </Link>
      )}

      <Sheet open={mode !== null} onClose={() => setMode(null)} title={mode === "share" ? "Share this Smart Minute" : "You are leaving SeniorG"}>
        {mode === "leaving" && (
          <div className="space-y-4">
            <p className="text-body text-ink">
              <strong>You're leaving SeniorG to watch this video on YouTube.</strong>
            </p>
            <p className="text-body-sm text-ink-2">It is published by {video.sourceChannel}. YouTube's own terms and privacy rules apply there, and SeniorG cannot see what you watch.</p>
            <Button fullWidth onClick={continueToYouTube}>
              <ExternalLink size={18} /> Continue to YouTube
            </Button>
            <Button variant="quiet" fullWidth onClick={() => setMode(null)}>
              Stay on SeniorG
            </Button>
          </div>
        )}
        {mode === "share" && (
          <div className="space-y-3">
            <p className="text-body-sm text-ink-2">They'll get a notification in SeniorG (demo). Nothing leaves the app.</p>
            <ul className="space-y-2">
              {contacts.map((c) => {
                const done = sharedWith.includes(c.id);
                return (
                  <li key={c.id}>
                    <button
                      disabled={done}
                      onClick={() => {
                        dispatch({ type: "SHARE_VIDEO", videoId: video.id, fromId: person.id, toId: c.id });
                        setSharedWith([...sharedWith, c.id]);
                      }}
                      className="flex min-h-[56px] w-full items-center justify-between rounded-tile border border-line px-4 py-3 text-left font-medium text-ink hover:bg-sand disabled:opacity-70"
                    >
                      <span>
                        {c.name}
                        <span className="block text-meta font-normal text-ink-2">{c.relation ?? (c.role === "SPOUSE" ? "Spouse" : "Household")}</span>
                      </span>
                      {done ? (
                        <span className="flex items-center gap-1 text-body-sm font-semibold text-success">
                          <CheckCircle2 size={16} /> Shared
                        </span>
                      ) : (
                        <Share2 size={18} className="text-brand" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <Button variant="quiet" fullWidth onClick={() => setMode(null)}>
              Done
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function ActionChip({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={["flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-tile border text-body-sm font-semibold transition", active ? "border-brand/40 bg-brand-tint text-brand-dark" : "border-line bg-card text-ink hover:bg-sand"].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
