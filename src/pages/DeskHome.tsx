import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headset, Inbox, Clock } from "lucide-react";
import { EmptyState } from "@/components/ds/States";
import { RequestCard } from "@/components/record/RequestCard";
import { RequestRecord } from "@/components/record/RequestRecord";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { getVisibleRequests } from "@/lib/visibility";
import { presentRequest } from "@/lib/presentation";
import { formatShortDateTime } from "@/lib/date";
import type { ServiceRequest } from "@/types/entities";

const TERMINAL = new Set(["CLOSED", "CANCELLED"]);

function handoverAt(request: ServiceRequest): string {
  const event = [...request.history].reverse().find((h) => h.to === "DESK" || h.action === "Assigned to SeniorG Desk");
  return event?.at ?? request.createdAt;
}

function sinceLabel(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return formatShortDateTime(iso);
}

// The desk workspace: queue on the left, the SAME living request record on the
// right. Selecting a request never copies it — it renders the member's record.
export function DeskHome() {
  const { state } = useStore();
  const person = useCurrentPerson();
  const [selected, setSelected] = useState<string | null>(null);
  if (!person) return null;

  const queue = getVisibleRequests(state.requests, person)
    .filter((r) => !TERMINAL.has(r.status))
    .sort((a, b) => new Date(handoverAt(b)).getTime() - new Date(handoverAt(a)).getTime());
  const waitingOnMember = queue.filter((r) => ["AWAITING_APPROVAL", "COMPLETED", "PAID"].includes(r.status));
  const deskToAct = queue.filter((r) => !waitingOnMember.includes(r));
  const current = queue.find((r) => r.id === selected) ?? queue[0];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-body-sm font-semibold text-handling">
            <Headset size={17} /> SeniorG desk · {person.name}
          </p>
          <h1 className="mt-1 font-serif text-title text-ink sm:text-display">SeniorG has this.</h1>
          <p className="mt-1 text-body text-ink-2">Requests members have handed over. Same records they see — every step you take appears in their timeline.</p>
        </div>
        <div className="flex gap-3">
          <Stat value={deskToAct.length} label="for the desk" tone="bg-handling text-white" />
          <Stat value={waitingOnMember.length} label="waiting on members" tone="bg-sand text-ink" />
        </div>
      </header>

      {queue.length === 0 ? (
        <EmptyState icon={Inbox} title="The queue is clear" body={'Nothing is with the desk right now. Switch to Suresh or Asha, open a request and choose "Have SeniorG handle this".'} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-8">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            <QueueGroup title="For the desk" items={deskToAct} current={current} onSelect={setSelected} />
            <QueueGroup title="Waiting on the member" items={waitingOnMember} current={current} onSelect={setSelected} />
          </aside>
          <div className="hidden min-w-0 lg:block">
            <AnimatePresence mode="wait">
              {current && (
                <motion.div key={current.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <RequestRecord request={current} embedded />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function QueueGroup({ title, items, current, onSelect }: { title: string; items: ServiceRequest[]; current?: ServiceRequest; onSelect: (id: string) => void }) {
  const { state } = useStore();
  const person = useCurrentPerson();
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-subhead text-ink">
        {title} <span className="ml-1 rounded-pill bg-sand px-2 text-tag text-ink-2">{items.length}</span>
      </h2>
      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id}>
            {/* On phones each request opens as its own page; on desktop it opens in the workspace. */}
            <div className="lg:hidden">
              <RequestCard request={r} />
            </div>
            <div className="hidden lg:block">
              <RequestCard request={r} compact active={current?.id === r.id} onSelect={() => onSelect(r.id)} />
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 pl-1 text-meta text-ink-3">
              <Clock size={13} /> With the desk {sinceLabel(handoverAt(r))} · {presentRequest(r, state.providers, state.people, person?.id).pill}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className={["min-w-[7.5rem] rounded-card px-4 py-3", tone].join(" ")}>
      <p className="tabular font-serif text-title leading-none">{value}</p>
      <p className="mt-1 text-meta opacity-80">{label}</p>
    </div>
  );
}
