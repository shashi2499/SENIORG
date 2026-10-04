import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ClipboardList, History, LifeBuoy, Users, ShieldCheck } from "lucide-react";
import type { ServiceRequest } from "@/types/entities";
import { Photo } from "@/components/ds/Photo";
import { StatusPill } from "@/components/ds/StatusPill";
import { StatusTimeline } from "@/components/ds/StatusTimeline";
import { ProviderCard } from "@/components/ds/ProviderCard";
import { PriceBlock } from "@/components/ds/PriceBlock";
import { OwnerBanner } from "@/components/ds/OwnerBanner";
import { DemoStrip } from "@/components/ds/DemoStrip";
import { CompletionProof } from "@/components/journey/CompletionProof";
import { StageNow } from "./StageNow";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { presentRequest, humanizeHistory, SERVICE_KIND, TONE_STYLE } from "@/lib/presentation";
import { requestImage } from "@/lib/imagery";
import { formatShortDateTime, formatLongDate, isDateOnly } from "@/lib/date";

// THE LIVING REQUEST RECORD. One component, used by the member's request page
// and the desk workspace alike — the same record, never a copy.
export function RequestRecord({ request, embedded }: { request: ServiceRequest; embedded?: boolean }) {
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const [showHistory, setShowHistory] = useState(false);
  const provider = request.providerId ? state.providers[request.providerId] : undefined;
  const p = presentRequest(request, state.providers, state.people, person?.id);
  const isDesk = person?.role === "COORDINATOR";
  const member = state.people[request.createdBy];
  const closed = request.status === "CLOSED";
  const heroTone = p.tone === "needs" ? "bg-accent text-ink" : closed ? "bg-sand text-ink" : p.tone === "handling" ? "bg-handling text-white" : "bg-brand-deep text-white";
  const onDark = !closed && p.tone !== "needs";

  const spouseId = person && request.createdBy === person.id ? state.household.memberIds.find((id) => id !== person.id) : undefined;
  const spouse = spouseId ? state.people[spouseId] : undefined;
  const sharedWithSpouse = !!spouseId && request.sharedWith.includes(spouseId);

  const stage = <StageNow request={request} />;
  const details = detailRows(request, state.people);

  const left = (
    <div className="space-y-6">
      {/* Now: what is happening, in words, with the one action that matters */}
      <motion.section
        layout
        key={request.status}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        className={["rounded-card p-5 sm:p-6", heroTone, onDark ? "shadow-hero" : ""].join(" ")}
        aria-live="polite"
      >
        <p className={["text-body-sm font-semibold", onDark ? "text-white/75" : "text-ink-2"].join(" ")}>{closed ? "Completed" : "Right now"}</p>
        <p className="mt-1 text-balance font-serif text-title leading-tight">{p.headline}</p>
        {p.detail && <p className={["mt-2 text-body", onDark ? "text-white/85" : "text-ink-2"].join(" ")}>{p.detail}</p>}
        {!closed && (
          <div className="mt-4">
            <StatusTimeline request={request} compact onAccent={p.tone === "needs"} />
          </div>
        )}
      </motion.section>

      {!closed && <div>{stage}</div>}

      <OwnerBanner request={request} />

      <Section icon={ClipboardList} title="Progress">
        <StatusTimeline request={request} currentDetail={!closed ? p.detail : undefined} />
      </Section>

      {request.proof && request.status !== "COMPLETED" && (
        <Section icon={ShieldCheck} title="Proof of work">
          <CompletionProof proof={request.proof} />
        </Section>
      )}

      {details.length > 0 && (
        <Section icon={ClipboardList} title={isDesk ? "What the member asked for" : "What you asked for"}>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt className="text-meta text-ink-3">{k}</dt>
                <dd className="text-body text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <section className="rounded-card border border-card-border bg-card">
        <button
          onClick={() => setShowHistory((s) => !s)}
          aria-expanded={showHistory}
          className="flex w-full items-center justify-between gap-3 p-5 text-left"
        >
          <span className="flex items-center gap-2 text-subhead text-ink">
            <History size={18} className="text-ink-3" /> Everything that happened
            <span className="rounded-pill bg-sand px-2 text-tag font-semibold text-ink-2">{request.history.length}</span>
          </span>
          <ChevronDown size={20} className={["text-ink-3 transition", showHistory ? "rotate-180" : ""].join(" ")} />
        </button>
        <AnimatePresence initial={false}>
          {showHistory && (
            <motion.ol
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-5"
            >
              {[...request.history].reverse().map((h) => (
                <li key={h.id} className="border-t border-line py-3">
                  <p className="text-body-sm text-ink">{humanizeHistory(h)}</p>
                  <p className="text-meta text-ink-3">
                    {formatShortDateTime(h.at)} · {actorName(h.actorId)}
                  </p>
                  {h.note && <p className="text-meta text-ink-2">{h.note}</p>}
                </li>
              ))}
              <li className="h-3" />
            </motion.ol>
          )}
        </AnimatePresence>
      </section>
    </div>
  );

  const right = (
    <div className="space-y-6">
      {provider && (
        <Section title={request.category === "GO_WITH_ME" ? "Who's going with you" : "Who's helping"}>
          <ProviderCard provider={provider} request={request} />
        </Section>
      )}
      {(request.price.estimate !== undefined || request.price.final !== undefined) && (
        <Section title="Price and payment">
          <PriceBlock request={request} people={state.people} />
        </Section>
      )}
      {spouse && person && (
        <div className="flex items-center gap-3 rounded-card bg-sand p-4">
          <Users size={20} className="shrink-0 text-ink-3" />
          <p className="flex-1 text-body-sm text-ink-2">
            {sharedWithSpouse ? `${spouse.name.split(" ")[0]} can see this request.` : `Private to you. ${spouse.name.split(" ")[0]} can't see it.`}
          </p>
          <button
            className="min-h-[44px] shrink-0 rounded-pill px-3 text-body-sm font-semibold text-brand-dark hover:bg-card"
            onClick={() =>
              dispatch({ type: "SET_REQUEST_SHARING", requestId: request.id, personId: spouse.id, shared: !sharedWithSpouse, actorId: person.id })
            }
          >
            {sharedWithSpouse ? "Make private" : `Share with ${spouse.name.split(" ")[0]}`}
          </button>
        </div>
      )}
      {!isDesk && (
        <button
          onClick={() => dispatch({ type: "TOGGLE_HELP_SHEET", open: true })}
          className="flex w-full items-center gap-3 rounded-card border border-card-border bg-card p-4 text-left shadow-soft hover:bg-sand"
        >
          <LifeBuoy size={22} className="shrink-0 text-brand" />
          <span className="flex-1">
            <span className="block font-semibold text-ink">Get help with this</span>
            <span className="block text-body-sm text-ink-2">Talk to the SeniorG desk about this request.</span>
          </span>
        </button>
      )}
      <DemoStrip request={request} />
    </div>
  );

  return (
    <article className="space-y-6">
      {/* Identity: what this is, for whom, with a sense of place */}
      <header className={embedded ? "" : "-mx-gutter sm:mx-0"}>
        <div className="relative overflow-hidden sm:rounded-card">
          <Photo slot={requestImage(request)} className="h-44 sm:h-56" rounded="rounded-none" eager />
          <div className="scrim-bottom absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-gutter sm:p-6">
            <p className="text-body-sm font-semibold text-white/85">
              {SERVICE_KIND[request.category] ?? "Request"} · <span className="tabular">{request.id}</span>
              {isDesk && member ? ` · for ${member.name}` : ""}
            </p>
            <h1 className="mt-0.5 font-serif text-title leading-tight text-white sm:text-display">{request.title}</h1>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 px-gutter sm:px-0">
          <StatusPill tone={p.tone} label={p.pill} />
          {request.owner === "DESK" && <StatusPill tone="handling" label="SeniorG desk" size="sm" />}
          <span className={["text-body-sm", TONE_STYLE.waiting.text].join(" ")}>Requested {formatShortDateTime(request.createdAt)}</span>
        </div>
      </header>

      <div className={embedded ? "space-y-6" : "grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8"}>
        {left}
        {right}
      </div>
    </article>
  );

  function actorName(id: string) {
    if (id === person?.id) return "You";
    return state.people[id]?.name ?? state.providers[id]?.name ?? (id === "P-ADMIN" ? "SeniorG" : id);
  }
}

function Section({ title, icon: Icon, children }: { title: string; icon?: typeof History; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-card-border bg-card p-5 shadow-soft">
      <h2 className="mb-4 flex items-center gap-2 text-subhead text-ink">
        {Icon && <Icon size={18} className="text-ink-3" />}
        {title}
      </h2>
      {children}
    </section>
  );
}

const LABELS: Record<string, string> = {
  symptom: "The problem",
  acType: "Type of AC",
  note: "Your note",
  urgency: "How soon",
  destinationType: "Going to",
  assistance: "Help chosen",
  travellerId: "Traveller",
  pickupAddress: "Pick-up from",
  taskType: "Help needed",
  days: "Days",
  timing: "Time of day",
  preferences: "Preferences",
  startDate: "Starting",
  reason: "Why it matters",
  dueDate: "Due",
  assistanceRequired: "What's needed",
  problem: "The problem",
};
const SKIP = new Set(["date", "slot", "hasPhoto", "reminderId", "reminderTitle"]);

function words(v: string) {
  return v.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function detailRows(request: ServiceRequest, people: Record<string, { name: string }>): [string, string][] {
  const out: [string, string][] = [];
  const d = (request.details ?? {}) as Record<string, unknown>;
  for (const [k, v] of Object.entries(d)) {
    if (SKIP.has(k) || v === undefined || v === null || v === "") continue;
    let val: string;
    if (k === "travellerId") val = people[String(v)]?.name ?? String(v);
    else if (Array.isArray(v)) {
      if (v.length === 0) continue;
      val = v.map((x) => words(String(x))).join(", ");
    } else if (typeof v === "string" && isDateOnly(v)) val = formatLongDate(v);
    else if (typeof v === "string") val = words(v);
    else val = String(v);
    out.push([LABELS[k] ?? words(k), val]);
  }
  return out;
}
