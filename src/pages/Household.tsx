import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarClock, FolderOpen, Users, ShieldCheck, UserCog, Receipt, History, ArrowRight, Lock, Eye } from "lucide-react";
import { Photo } from "@/components/ds/Photo";
import { SectionHeader } from "@/components/ds/SectionHeader";
import { ListRow, RowList, DateBlock, IconBadge } from "@/components/ds/ListRow";
import { Avatar } from "@/components/ds/Avatar";
import { StatusPill } from "@/components/ds/StatusPill";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { getVisibleRequests, getVisibleReminders } from "@/lib/visibility";
import { reminderUrgency } from "@/lib/reminderUrgency";
import { formatShortDateTime } from "@/lib/date";
import { requestImage } from "@/lib/imagery";
import type { Tone } from "@/lib/presentation";

const URGENCY_TONE: Record<string, Tone> = { critical: "problem", warning: "needs", info: "handling", success: "done", neutral: "waiting" };

export function Household() {
  const { state } = useStore();
  const person = useCurrentPerson();
  if (!person) return null;

  const members = state.household.memberIds.map((id) => state.people[id]).filter(Boolean);
  const family = Object.values(state.people).filter((p) => p.role === "FAMILY_VIEWER" || p.role === "FAMILY_PAYER");
  const reminders = getVisibleReminders(state.reminders, person)
    .filter((r) => r.status !== "DONE")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const history = getVisibleRequests(state.requests, person)
    .filter((r) => r.status === "CLOSED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const myGrants = (id: string) => (state.people[id]?.permissions ?? []).filter((g) => g.grantedBy === person.id && g.scope !== "NONE");

  return (
    <div className="space-y-10">
      {/* OUR HOME */}
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }} className="relative -mx-gutter overflow-hidden sm:mx-0 sm:rounded-card">
        <Photo slot="home" className="h-64 sm:h-80" rounded="rounded-none" eager />
        <div className="scrim-bottom absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-gutter text-white sm:p-8">
          <p className="text-body-sm font-semibold text-accent">Our home</p>
          <h1 className="mt-1 font-serif text-title leading-tight text-white sm:text-display">{members.map((m) => m.name.split(" ")[0]).join(" & ")}</h1>
          <p className="mt-1 text-body-sm text-white/85">
            {state.household.address} · {state.household.associationChapter}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {members.map((m) => (
              <span key={m.id} className="inline-flex items-center gap-2 rounded-pill bg-white/15 py-1 pl-1 pr-3 text-body-sm font-semibold backdrop-blur">
                <Avatar initials={m.avatarInitials} seed={m.id} size={32} />
                {m.id === person.id ? "You" : m.name.split(" ")[0]}
                <span className="font-normal text-white/75">· own account</span>
              </span>
            ))}
          </div>
        </div>
      </motion.header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
        <div className="space-y-10">
          {/* Dates & renewals */}
          <section>
            <SectionHeader title="Dates & renewals" subtitle="SeniorG reminds you from what you've told us — it never reads your SMS, email or bank." action={{ label: "All dates", to: "/household/reminders" }} />
            <div className="surface-primary px-5">
              <RowList>
                {reminders.slice(0, 5).map((r) => {
                  const u = reminderUrgency(r);
                  return (
                    <ListRow
                      key={r.id}
                      to={`/household/reminders/${r.id}`}
                      leading={<DateBlock iso={r.dueDate} />}
                      title={r.title}
                      meta={
                        <span className="mt-1 flex flex-wrap items-center gap-2">
                          <StatusPill tone={URGENCY_TONE[u.tone]} label={u.label} size="sm" />
                          {r.ownerId !== person.id && <span className="text-tag text-ink-3">Shared with you</span>}
                        </span>
                      }
                    />
                  );
                })}
              </RowList>
            </div>
          </section>

          {/* Service history */}
          <section>
            <SectionHeader title="Service history" action={{ label: "All requests", to: "/requests" }} />
            {history.length === 0 ? (
              <p className="surface-secondary p-5 text-body-sm text-ink-2">Finished requests are kept here, with their receipts and ratings.</p>
            ) : (
              <div className="surface-primary px-5">
                <RowList>
                  {history.map((r) => (
                    <ListRow
                      key={r.id}
                      to={`/requests/${r.id}`}
                      leading={<Photo slot={requestImage(r)} className="h-14 w-14" rounded="rounded-tile" />}
                      title={r.title}
                      meta={`${formatShortDateTime(r.createdAt)}${r.price.final ? ` · ₹${r.price.final}` : ""}${r.rating ? ` · rated ${r.rating}/5` : ""}`}
                    />
                  ))}
                </RowList>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {/* Family circle — you are in control */}
          <Link to="/household/family" className="group block overflow-hidden rounded-card bg-brand-deep text-white shadow-hero">
            <div className="p-6">
              <p className="flex items-center gap-2 text-body-sm font-semibold text-accent">
                <Users size={18} /> Family circle
              </p>
              <p className="mt-1 font-serif text-section leading-snug">You decide what family can see.</p>
              <ul className="mt-4 space-y-2">
                {family.map((f) => {
                  const g = myGrants(f.id);
                  return (
                    <li key={f.id} className="flex items-center gap-3 rounded-tile bg-white/10 px-3 py-2.5">
                      <Avatar initials={f.avatarInitials} seed={f.id} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{f.name.split(" ")[0]}</span>
                        <span className="block text-meta text-white/75">{f.relation} · {f.role === "FAMILY_PAYER" ? "can help pay" : "viewer"}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-tag font-semibold text-white/85">
                        {g.length ? <Eye size={14} /> : <Lock size={14} />} {g.length ? `Sees ${g.length}` : "Nothing shared"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <span className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold">
                Manage sharing <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          <div className="surface-primary px-5">
            <RowList>
              <ListRow to="/household/documents" leading={<IconBadge icon={FolderOpen} tint="bg-indigo-tint text-indigo" />} title="Documents" meta="Where each paper is kept — coming to SeniorG" />
              <ListRow to="/household/trusted-contacts" leading={<IconBadge icon={ShieldCheck} tint="bg-brand-tint text-brand-dark" />} title="Trusted contacts" meta={state.household.trustedContactIds.map((id) => state.people[id]?.name.split(" ")[0]).join(" and ")} />
              <ListRow to="/household/profile" leading={<IconBadge icon={UserCog} tint="bg-sand text-ink-2" />} title="Profile & preferences" meta="Language, visitors, reading size" />
              <ListRow to="/household/payments" leading={<IconBadge icon={Receipt} tint="bg-success-tint text-success" />} title="Payments & receipts" meta="Every simulated payment, in one place" />
              <ListRow to="/household/reminders" leading={<IconBadge icon={CalendarClock} tint="bg-accent-tint text-needs" />} title="Dates & renewals" meta={`${reminders.length} upcoming`} />
              <ListRow to="/requests" leading={<IconBadge icon={History} tint="bg-sand text-ink-2" />} title="Service history" meta="Everything SeniorG has done for you" />
            </RowList>
          </div>
        </div>
      </div>
    </div>
  );
}
