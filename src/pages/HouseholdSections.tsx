import { FolderOpen, ShieldCheck, Receipt, Type, Check } from "lucide-react";
import { PageHeader } from "@/components/ds/PageHeader";
import { PlannedState, EmptyState, DemoTag } from "@/components/ds/States";
import { Avatar } from "@/components/ds/Avatar";
import { ListRow, RowList } from "@/components/ds/ListRow";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { getVisibleRequests } from "@/lib/visibility";
import { myTickets } from "@/lib/events";
import { useTextSize, type TextSize } from "@/lib/textSize";
import { formatShortDateTime } from "@/lib/date";

// Household areas from the approved IA. Where a capability isn't built yet the
// page says so plainly; where SeniorG already holds the data, it shows it.

export function DocumentsPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Household" title="Documents" />
      <PlannedState icon={FolderOpen} title="SeniorG will help you keep this organised here." body="An index of where each important paper lives — pension order, policies, property receipts — with the last four digits at most. Never the documents themselves, and never passwords.">
        <ul className="space-y-2 text-body-sm text-ink-2">
          {["Know where every paper is, in seconds", "Link a document to its renewal date", "Share an entry with family only if you choose"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check size={16} className="text-brand" /> {t}
            </li>
          ))}
        </ul>
      </PlannedState>
    </div>
  );
}

export function TrustedContactsPage() {
  const { state } = useStore();
  const contacts = state.household.trustedContactIds.map((id) => state.people[id]).filter(Boolean);
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Household" title="Trusted contacts" subtitle="The people SeniorG's Pause button suggests you call when a phone call feels wrong." />
      <div className="surface-primary px-5">
        <RowList>
          {contacts.map((c) => (
            <ListRow key={c.id} leading={<Avatar initials={c.avatarInitials} seed={c.id} />} title={c.name} meta={c.relation ?? (c.role === "SPOUSE" ? "Spouse" : "Household")} chevron={false} />
          ))}
        </RowList>
      </div>
      <PlannedState icon={ShieldCheck} title="Changing your trusted contacts" body="Adding, removing and ordering trusted contacts from here is coming to SeniorG. Until then, the desk can update them for you." />
    </div>
  );
}

const SIZES: { id: TextSize; label: string; sample: string }[] = [
  { id: "standard", label: "Standard", sample: "text-[1.125rem]" },
  { id: "large", label: "Large", sample: "text-[1.3rem]" },
  { id: "xlarge", label: "Extra large", sample: "text-[1.45rem]" },
];

export function ProfilePage() {
  const person = useCurrentPerson();
  const [size, setSize] = useTextSize();
  const prefs = person?.preferences;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Household" title="Profile & preferences" />

      <section className="surface-primary p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-serif text-section text-ink">
          <Type size={20} className="text-brand" /> Reading comfort
        </h2>
        <p className="mt-1 text-body-sm text-ink-2">Make everything in SeniorG larger. Pages reflow — nothing gets cut off.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Text size">
          {SIZES.map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={size === s.id}
              onClick={() => setSize(s.id)}
              className={["flex min-h-[72px] items-center justify-between gap-3 rounded-tile border-2 px-4 text-left", size === s.id ? "border-brand bg-brand-tint" : "border-line hover:bg-sand"].join(" ")}
            >
              <span>
                <span className={["block font-serif leading-none text-ink", s.sample].join(" ")}>Aa</span>
                <span className="mt-1 block text-body-sm font-semibold text-ink">{s.label}</span>
              </span>
              {size === s.id && <Check size={22} className="text-brand" />}
            </button>
          ))}
        </div>
      </section>

      {prefs && (
        <section className="surface-primary p-5 sm:p-6">
          <h2 className="font-serif text-section text-ink">What SeniorG remembers about you</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Languages", prefs.languages?.join(", ")],
              ["Visitors", prefs.visitorGender === "any" ? "No preference" : prefs.visitorGender === "female" ? "Women visitors preferred" : "Men visitors preferred"],
              ["Food", prefs.diet],
              ["Usual pick-up", prefs.pickupAddress],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="text-meta text-ink-3">{k}</dt>
                  <dd className="text-body text-ink">{v}</dd>
                </div>
              ))}
          </dl>
          <p className="mt-4 text-meta text-ink-3">Used to match the right person and prefill bookings. Editing these here is coming to SeniorG.</p>
        </section>
      )}
    </div>
  );
}

export function PaymentsPage() {
  const { state } = useStore();
  const person = useCurrentPerson();
  if (!person) return null;
  const rows = [
    ...getVisibleRequests(state.requests, person)
      .filter((r) => r.payment.status === "PAID_SIMULATED" && (r.payment.amount ?? 0) > 0)
      .map((r) => ({ id: r.id, title: r.title, amount: r.payment.amount ?? 0, payer: r.payment.payerId, at: r.history[r.history.length - 1]?.at ?? r.createdAt, to: `/requests/${r.id}` })),
    ...myTickets(state.tickets, person)
      .filter((t) => t.bookedBy === person.id && (t.payment.status === "PAID_SIMULATED" || t.payment.status === "REFUNDED") && (t.payment.amount ?? 0) > 0)
      .map((t) => ({ id: t.id, title: `${state.events[t.eventId]?.title}${t.payment.status === "REFUNDED" ? " · refunded" : ""}`, amount: t.payment.amount ?? 0, payer: t.payment.payerId, at: t.createdAt, to: `/explore/${t.eventId}` })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Household" title="Payments & receipts" subtitle="Every payment made through SeniorG, in one place." actions={<DemoTag>All payments are simulated</DemoTag>} />
      {rows.length === 0 ? (
        <EmptyState icon={Receipt} title="No payments yet" body="When you pay for a service or a ticket, the receipt will appear here." />
      ) : (
        <div className="surface-primary px-5">
          <RowList>
            {rows.map((r) => (
              <ListRow
                key={r.id}
                to={r.to}
                title={r.title}
                meta={`${formatShortDateTime(r.at)} · ${r.id}${r.payer && r.payer !== person.id ? ` · paid by ${state.people[r.payer]?.name.split(" ")[0]}` : ""}`}
                trailing={<span className="tabular font-semibold text-ink">₹{r.amount}</span>}
              />
            ))}
          </RowList>
        </div>
      )}
    </div>
  );
}
