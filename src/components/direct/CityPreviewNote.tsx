import { FlaskConical } from "lucide-react";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { MUMBAI_PREVIEW_NOTE } from "@/lib/onboarding";

// The onboarding profile of the person currently viewed, if they joined via the front door.
export function useJoinedProfile() {
  const { state } = useStore();
  const person = useCurrentPerson();
  return person && state.onboarding?.personId === person.id ? state.onboarding : undefined;
}

// Provider and event data are Pune samples. A Mumbai member sees their city,
// with an honest note wherever listings appear.
export function CityPreviewNote({ className = "" }: { className?: string }) {
  const joined = useJoinedProfile();
  if (joined?.city !== "Mumbai") return null;
  return (
    <p className={["inline-flex items-center gap-2 rounded-pill border border-dashed border-accent-deep/40 bg-accent-tint px-3 py-1 text-meta text-ink", className].join(" ")}>
      <FlaskConical size={14} className="shrink-0 text-accent-deep" /> {MUMBAI_PREVIEW_NOTE}
    </p>
  );
}
