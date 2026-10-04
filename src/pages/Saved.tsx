import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { PageHeader } from "@/components/ds/PageHeader";
import { SectionHeader } from "@/components/ds/SectionHeader";
import { EmptyState } from "@/components/ds/States";
import { EventCard } from "@/components/EventCard";
import { SmartMinuteRow } from "@/components/SmartMinuteCard";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { savedSmartMinutes } from "@/lib/smartMinutes";

// One Saved page for everything a member keeps: events and Smart Minutes,
// each read from its own existing state (no second Saved store).
export function Saved() {
  const { state } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const savedEvents = Object.values(state.events).filter((e) => e.saved);
  const savedVideos = person ? savedSmartMinutes(state.videos, person) : [];
  const empty = savedEvents.length === 0 && savedVideos.length === 0;

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Explore" title="Saved" subtitle="Events and Smart Minutes you want to come back to." />
      {empty ? (
        <EmptyState icon={Bookmark} title="Nothing saved yet" body="Tap Save on any event or Smart Minute and it will wait for you here." action={{ label: "Browse what's on", onClick: () => navigate("/explore") }} />
      ) : (
        <>
          {savedVideos.length > 0 && (
            <section>
              <SectionHeader title="Smart Minutes" />
              <div className="space-y-3">
                {savedVideos.map((v) => (
                  <SmartMinuteRow key={v.id} video={v} />
                ))}
              </div>
            </section>
          )}
          {savedEvents.length > 0 && (
            <section>
              <SectionHeader title="Events" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
