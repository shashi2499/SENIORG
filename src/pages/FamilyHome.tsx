import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Photo } from "@/components/ds/Photo";
import { PageHeader } from "@/components/ds/PageHeader";
import { FamilySections } from "@/components/FamilyViews";
import { useCurrentPerson, useStore } from "@/store/StoreContext";

// Home for a family viewer or payer: what parents chose to share, and nothing more.
export function FamilyHome({ onlyRequests }: { onlyRequests?: boolean }) {
  const person = useCurrentPerson();
  const { state } = useStore();
  if (!person) return null;
  const parents = state.household.memberIds.map((id) => state.people[id]?.name.split(" ")[0]).join(" & ");
  const isPayer = person.role === "FAMILY_PAYER";

  if (onlyRequests) {
    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Shared with you" title="Requests" subtitle={`What ${parents} have chosen to share with you.`} />
        <FamilySections person={person} only="requests" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative -mx-gutter overflow-hidden sm:mx-0 sm:rounded-card">
        <Photo slot="lane" className="h-56 sm:h-72" rounded="rounded-none" eager />
        <div className="scrim-bottom absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-gutter text-white sm:p-8">
          <p className="flex items-center gap-2 text-body-sm font-semibold text-accent">
            <Heart size={16} /> Family view · {person.relation ?? "Family"}
          </p>
          <h1 className="mt-1 font-serif text-title text-white sm:text-display">Hello, {person.name.split(" ")[0]}</h1>
          <p className="mt-1 max-w-lg text-body-sm text-white/85">
            You see only what {parents} choose to share. Nothing is shared by default, and they can change it at any time.
          </p>
        </div>
      </motion.header>
      {isPayer && (
        <p className="rounded-card bg-brand-tint p-5 text-body-sm text-brand-dark">
          You can pay for a service when {parents.split(" & ")[0]} allows it. The request always stays theirs.
        </p>
      )}
      <FamilySections person={person} />
    </div>
  );
}
