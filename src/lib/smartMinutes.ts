import { ShieldCheck, BookOpen, HeartPulse, Palette, Music, Compass, type LucideIcon } from "lucide-react";
import type { LearningVideo, Person, SmartMinuteCategory } from "@/types/entities";

export interface SmartMinuteCategoryMeta {
  label: string;
  icon: LucideIcon;
  tint: string; // existing design tokens
}

export const SM_CATEGORIES: Record<SmartMinuteCategory, SmartMinuteCategoryMeta> = {
  STAY_SAFE: { label: "Stay Safe", icon: ShieldCheck, tint: "bg-brand-tint text-brand-dark" },
  LEARN_SOMETHING: { label: "Learn Something", icon: BookOpen, tint: "bg-indigo-tint text-indigo" },
  STAY_ACTIVE: { label: "Stay Active", icon: HeartPulse, tint: "bg-clay-tint text-clay" },
  CREATE_ENJOY: { label: "Create & Enjoy", icon: Palette, tint: "bg-plum-tint text-plum" },
  BHAKTI_MUSIC: { label: "Bhakti & Music", icon: Music, tint: "bg-accent-tint text-warning" },
  TRAVEL_EXPLORE: { label: "Travel & Explore", icon: Compass, tint: "bg-infotint text-ink" },
};

// A fixed, hand-ordered feed that deliberately mixes practical and enjoyable
// content. No algorithm: "Next Smart Minute" simply follows this order.
export const FEED_ORDER = [
  "SM-01", "SM-07", "SM-11", "SM-02", "SM-13", "SM-08", "SM-03",
  "SM-09", "SM-12", "SM-04", "SM-14", "SM-05", "SM-10", "SM-06",
];

export function orderedFeed(videos: Record<string, LearningVideo>): LearningVideo[] {
  return FEED_ORDER.map((id) => videos[id]).filter(Boolean);
}

export function durationLabel(sec: number): string {
  if (sec < 90) return `${sec} sec`;
  const m = Math.round(sec / 60);
  return `${m} min`;
}

export function nextSmartMinute(videos: Record<string, LearningVideo>, currentId: string): LearningVideo | undefined {
  const feed = orderedFeed(videos);
  if (feed.length === 0) return undefined;
  const i = feed.findIndex((v) => v.id === currentId);
  return feed[(i + 1) % feed.length];
}

// Today's featured Smart Minute: first one in the feed this person hasn't
// watched that has a real, verified link.
export function featuredSmartMinute(videos: Record<string, LearningVideo>, person: Person): LearningVideo | undefined {
  const feed = orderedFeed(videos);
  return feed.find((v) => v.videoUrl && !v.watchedBy.includes(person.id)) ?? feed.find((v) => v.videoUrl);
}

export function recentlyWatched(videos: Record<string, LearningVideo>, person: Person): LearningVideo | undefined {
  const mine = orderedFeed(videos).filter((v) => v.watchedBy.includes(person.id));
  // watchedBy is oldest-first per video, so rank by position within each list is not
  // comparable across videos; use the last one in feed order as a stable demo choice.
  return mine[mine.length - 1];
}

export function savedSmartMinutes(videos: Record<string, LearningVideo>, person: Person): LearningVideo[] {
  return orderedFeed(videos).filter((v) => v.savedBy.includes(person.id));
}
