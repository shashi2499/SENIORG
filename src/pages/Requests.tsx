import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, Ticket, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ds/PageHeader";
import { EmptyState } from "@/components/ds/States";
import { ListRow, RowList, DateBlock } from "@/components/ds/ListRow";
import { RequestCard } from "@/components/record/RequestCard";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { getVisibleRequests, isFamilyRole } from "@/lib/visibility";
import { presentRequest } from "@/lib/presentation";
import { FamilyHome } from "./FamilyHome";
import { myTickets } from "@/lib/events";
import { TICKET_STATUS_LABEL } from "@/lib/labels";
import { formatShortDateTime } from "@/lib/date";

type Tab = "needs" | "active" | "done" | "tickets";

export function Requests() {
  const { state } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const [chosen, setChosen] = useState<Tab | null>(null);

  if (!person) return null;
  if (isFamilyRole(person)) return <FamilyHome onlyRequests />;

  const visible = getVisibleRequests(state.requests, person).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const finished = (s: string) => s === "CLOSED" || s === "CANCELLED" || s === "RESOLVED";
  const needs = visible.filter((r) => !finished(r.status) && presentRequest(r, state.providers, state.people, person.id).needsYou && r.createdBy === person.id);
  const active = visible.filter((r) => !finished(r.status) && !needs.includes(r));
  const done = visible.filter((r) => finished(r.status));
  const tickets = myTickets(state.tickets, person);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "needs", label: "Needs you", count: needs.length },
    { id: "active", label: "In progress", count: active.length },
    { id: "done", label: "Done", count: done.length },
    { id: "tickets", label: "Tickets", count: tickets.length },
  ];
  const tab: Tab = chosen ?? (needs.length ? "needs" : "active");
  const list = tab === "needs" ? needs : tab === "active" ? active : done;
  const isDesk = person.role === "COORDINATOR";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Requests"
        subtitle={isDesk ? "Requests members have handed to the SeniorG desk." : "Everything SeniorG is doing for you, in one place."}
      />

      <div className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter sm:mx-0 sm:px-0" role="tablist" aria-label="Request groups">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setChosen(t.id)}
            className={[
              "relative flex min-h-[48px] shrink-0 items-center gap-2 rounded-pill px-5 text-body-sm font-semibold transition",
              tab === t.id ? "text-white" : "bg-card text-ink-2 ring-1 ring-line hover:text-ink",
            ].join(" ")}
          >
            {tab === t.id && <motion.span layoutId="req-tab" className="absolute inset-0 rounded-pill bg-brand" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">{t.label}</span>
            {t.count > 0 && (
              <span
                className={[
                  "relative rounded-pill px-2 text-tag",
                  tab === t.id ? "bg-white/20 text-white" : t.id === "needs" ? "bg-accent text-ink" : "bg-sand text-ink-2",
                ].join(" ")}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "tickets" ? (
        tickets.length === 0 ? (
          <EmptyState icon={Ticket} title="No tickets yet" body="Book or register for something nearby and your tickets will live here." action={{ label: "Explore what's on", onClick: () => navigate("/explore") }} />
        ) : (
          <div className="surface-primary px-5">
            <RowList>
              {tickets.map((t) => {
                const ev = state.events[t.eventId];
                return (
                  <ListRow
                    key={t.id}
                    to={`/explore/${t.eventId}`}
                    leading={ev ? <DateBlock iso={ev.dateTime} tone={t.status.startsWith("CANCELLED") ? "default" : "brand"} /> : undefined}
                    title={ev?.title}
                    meta={
                      <>
                        {ev ? formatShortDateTime(ev.dateTime) : ""} · {TICKET_STATUS_LABEL[t.status]}
                        <span className="block text-meta text-ink-3">
                          {t.id} · {t.source === "ASSOCIATION" ? "Registration" : "Ticket"} · {t.attendees.length} {t.attendees.length === 1 ? "person" : "people"}
                        </span>
                      </>
                    }
                  />
                );
              })}
            </RowList>
          </div>
        )
      ) : list.length === 0 ? (
        tab === "needs" ? (
          <EmptyState icon={CheckCircle2} title="Nothing needs you" body="When something needs your approval, payment or a decision, it will appear here first." />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title={tab === "active" ? "Nothing in progress" : "No finished requests yet"}
            body={tab === "active" ? "Start something from Services, or ask SeniorG to handle it for you." : "Completed requests stay here as your service history."}
            action={!isDesk && tab === "active" ? { label: "Browse services", onClick: () => navigate("/services") } : undefined}
          />
        )
      ) : (
        <motion.div layout className="grid gap-3 lg:grid-cols-2 [&>*]:min-w-0">
          {list.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
