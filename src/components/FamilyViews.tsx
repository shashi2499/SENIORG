import { Link } from "react-router-dom";
import { Lock, FileText, CalendarClock, ClipboardList, IndianRupee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaymentCard } from "@/components/journey/PaymentCard";
import { SectionHeader } from "@/components/ds/SectionHeader";
import { StatusPill } from "@/components/ds/StatusPill";
import { ListRow, RowList, DateBlock } from "@/components/ds/ListRow";
import { Photo } from "@/components/ds/Photo";
import { ReminderStatusBadge } from "@/components/ui/ReminderStatusBadge";
import { useStore } from "@/store/StoreContext";
import {
  familyCanPay,
  familyCanSeePayment,
  familyCanSeeStatus,
  getVisibleDocuments,
  getVisibleReminders,
  getVisibleRequests,
  hasAreaGrant,
} from "@/lib/visibility";
import { presentRequest, whenLabel } from "@/lib/presentation";
import { requestImage } from "@/lib/imagery";
import { formatLongDate } from "@/lib/date";
import { PAYMENT_STATUS_LABEL } from "@/lib/labels";
import type { PermissionArea, Person, ServiceRequest } from "@/types/entities";

// Everything here reads the SAME request / reminder / document state the member
// sees, filtered through the family permission model. No family-side copies.

const AREA_LABEL: Record<string, string> = {
  REQUEST_STATUS: "request status",
  REMINDERS: "reminders",
  DOCUMENTS: "documents",
  PAYMENTS: "payments",
};

// "Not shared" — deliberately no titles, counts or hints about what is hidden.
function LockedCard({ area, person }: { area: PermissionArea; person: Person }) {
  const { state, dispatch } = useStore();
  const owner = state.people[state.household.memberIds[0]];
  const asked = state.notifications.some(
    (n) => n.type === "FAMILY_REQUEST" && n.recipientId === owner?.id && n.text.startsWith(person.name) && n.text.includes(AREA_LABEL[area] ?? "")
  );
  return (
    <div className="flex items-start gap-4 rounded-card border border-dashed border-line p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-ink-2">
        <Lock size={20} />
      </span>
      <div>
        <p className="font-semibold text-ink">Not shared with you</p>
        <p className="mt-0.5 text-body-sm text-ink-2">
          {owner?.name.split(" ")[0] ?? "The member"} hasn't shared {AREA_LABEL[area]}. It's their decision.
        </p>
        {owner && (
          <Button variant="secondary" size="sm" className="mt-3" disabled={asked} onClick={() => dispatch({ type: "ASK_TO_SHARE", requesterId: person.id, ownerId: owner.id, area })}>
            {asked ? "Asked — waiting for their reply" : `Ask ${owner.name.split(" ")[0]} to share`}
          </Button>
        )}
      </div>
    </div>
  );
}

function ownerFirstName(request: ServiceRequest, people: Record<string, Person>) {
  return people[request.createdBy]?.name.split(" ")[0] ?? "Member";
}

function amountOf(r: ServiceRequest) {
  return r.price.final ?? r.price.agreed ?? r.price.estimate;
}

function paymentLabel(r: ServiceRequest, people: Record<string, Person>) {
  if (r.payment.status === "PAID_SIMULATED") {
    const payer = r.payment.payerId ? people[r.payment.payerId] : undefined;
    return `Paid (demo)${payer ? ` by ${payer.name.split(" ")[0]}` : ""}`;
  }
  if (r.status === "COMPLETED") return "Payment due";
  return PAYMENT_STATUS_LABEL[r.payment.status];
}

export function FamilyRequestsSection({ person }: { person: Person }) {
  const { state } = useStore();
  if (!hasAreaGrant(person, "REQUEST_STATUS")) return <LockedCard area="REQUEST_STATUS" person={person} />;
  const items = getVisibleRequests(state.requests, person).filter((r) => familyCanSeeStatus(r, person));
  if (items.length === 0) return <p className="surface-secondary p-5 text-body-sm text-ink-2">Nothing shared with you yet.</p>;
  return (
    <div className="surface-primary px-5">
      <RowList>
        {items.map((r) => {
          const p = presentRequest(r, state.providers, state.people, person.id);
          return (
            <ListRow
              key={r.id}
              to={`/requests/${r.id}`}
              leading={<Photo slot={requestImage(r)} className="h-14 w-14" rounded="rounded-tile" />}
              title={r.title}
              meta={
                <span className="mt-1 flex flex-wrap items-center gap-2">
                  <StatusPill tone={p.tone} label={p.pill} size="sm" />
                  <span className="text-tag text-ink-3">{ownerFirstName(r, state.people)}'s request</span>
                </span>
              }
            />
          );
        })}
      </RowList>
    </div>
  );
}

export function FamilyPaymentsSection({ person }: { person: Person }) {
  const { state, dispatch } = useStore();
  if (!hasAreaGrant(person, "PAYMENTS")) return <LockedCard area="PAYMENTS" person={person} />;
  const items = getVisibleRequests(state.requests, person).filter((r) => familyCanSeePayment(r, person));
  if (items.length === 0) return <p className="surface-secondary p-5 text-body-sm text-ink-2">No payments shared with you yet.</p>;
  return (
    <div className="space-y-3">
      {items.map((r) => (
        <div key={r.id} className="surface-primary p-5">
          <Link to={`/requests/${r.id}`} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-ink">{r.title}</p>
              <p className="text-body-sm text-ink-2">
                {ownerFirstName(r, state.people)}'s request · {paymentLabel(r, state.people)}
              </p>
            </div>
            <p className="tabular shrink-0 font-serif text-section text-ink">{amountOf(r) ? `₹${amountOf(r)}` : "—"}</p>
          </Link>
          <p className="mt-1 text-meta text-ink-3">Illustrative demo price</p>
          {familyCanPay(r, person) && (
            <Button fullWidth className="mt-4" onClick={() => dispatch({ type: "FAMILY_PAY", requestId: r.id, payerId: person.id })}>
              <IndianRupee size={18} /> Pay ₹{r.price.final} for {ownerFirstName(r, state.people)} (demo)
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export function FamilyRemindersSection({ person }: { person: Person }) {
  const { state } = useStore();
  if (!hasAreaGrant(person, "REMINDERS")) return <LockedCard area="REMINDERS" person={person} />;
  const items = getVisibleReminders(state.reminders, person).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  if (items.length === 0) return <p className="surface-secondary p-5 text-body-sm text-ink-2">No reminders shared with you yet.</p>;
  return (
    <div className="surface-primary px-5">
      <RowList>
        {items.map((r) => (
          <ListRow
            key={r.id}
            leading={<DateBlock iso={r.dueDate} />}
            title={r.title}
            meta={
              <span className="mt-1 flex flex-wrap items-center gap-2">
                <ReminderStatusBadge reminder={r} />
                <span className="text-tag text-ink-3">Due {formatLongDate(r.dueDate)}</span>
              </span>
            }
            chevron={false}
          />
        ))}
      </RowList>
    </div>
  );
}

// The document INDEX only: name, kind, last-4 reference and renewal date.
export function FamilyDocumentsSection({ person }: { person: Person }) {
  const { state } = useStore();
  if (!hasAreaGrant(person, "DOCUMENTS")) return <LockedCard area="DOCUMENTS" person={person} />;
  const items = getVisibleDocuments(state.documents, person);
  if (items.length === 0) return <p className="surface-secondary p-5 text-body-sm text-ink-2">No documents shared with you yet.</p>;
  return (
    <div className="surface-primary px-5">
      <RowList>
        {items.map((d) => (
          <ListRow
            key={d.id}
            leading={
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-tint text-indigo">
                <FileText size={20} />
              </span>
            }
            title={d.name}
            meta={
              <>
                {d.category.charAt(0) + d.category.slice(1).toLowerCase()}
                {d.refLast4 ? ` · ending ${d.refLast4}` : ""}
                {d.expiryOrRenewal ? ` · renews ${formatLongDate(d.expiryOrRenewal)}` : ""}
                <span className="block text-tag text-ink-3">Index only — the document itself isn't shared.</span>
              </>
            }
            chevron={false}
          />
        ))}
      </RowList>
    </div>
  );
}

export function FamilySections({ person, only }: { person: Person; only?: "requests" }) {
  return (
    <div className="space-y-10">
      <section>
        <SectionHeader title="Requests" icon={<ClipboardList size={20} className="text-brand" />} />
        <FamilyRequestsSection person={person} />
      </section>
      <section>
        <SectionHeader title="Payments" icon={<IndianRupee size={20} className="text-brand" />} />
        <FamilyPaymentsSection person={person} />
      </section>
      {only !== "requests" && (
        <>
          <section>
            <SectionHeader title="Reminders" icon={<CalendarClock size={20} className="text-brand" />} />
            <FamilyRemindersSection person={person} />
          </section>
          <section>
            <SectionHeader title="Documents" icon={<FileText size={20} className="text-brand" />} />
            <FamilyDocumentsSection person={person} />
          </section>
        </>
      )}
    </div>
  );
}

// The restricted request page a family member gets: only what the member granted.
// No history, notes, provider contact, extra-work detail, proof or ownership controls.
export function FamilyRequestView({ request, person }: { request: ServiceRequest; person: Person }) {
  const { state, dispatch } = useStore();
  const showStatus = familyCanSeeStatus(request, person);
  const showPayment = familyCanSeePayment(request, person);
  const provider = request.providerId ? state.providers[request.providerId] : undefined;
  const owner = state.people[request.createdBy];
  const p = presentRequest(request, state.providers, state.people, person.id);

  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="relative -mx-gutter overflow-hidden sm:mx-0 sm:rounded-card">
        <Photo slot={requestImage(request)} className="h-44 sm:h-56" rounded="rounded-none" eager />
        <div className="scrim-bottom absolute inset-0" />
        <div className="absolute bottom-0 p-gutter text-white sm:p-6">
          <p className="text-body-sm font-semibold text-white/85">{owner?.name.split(" ")[0]}'s request · {request.id}</p>
          <h1 className="font-serif text-title text-white">{request.title}</h1>
        </div>
      </header>
      <p className="text-body-sm text-ink-2">You see only what {owner?.name.split(" ")[0]} chose to share.</p>

      {showStatus && (
        <section className="rounded-card bg-brand-deep p-5 text-white">
          <p className="text-body-sm font-semibold text-white/75">Right now</p>
          <p className="mt-1 font-serif text-title leading-tight">{p.headline}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-white/85">
            {whenLabel(request) && <span>{whenLabel(request)}</span>}
            {provider && <span>{provider.name} · {provider.business}</span>}
          </div>
        </section>
      )}

      {showPayment && (
        <div className="space-y-3">
          <section className="surface-primary p-5">
            <p className="text-subhead text-ink">Payment summary</p>
            <dl className="mt-3 space-y-2 text-body-sm">
              <div className="flex justify-between">
                <dt className="text-ink-2">Amount</dt>
                <dd className="tabular font-semibold text-ink">{amountOf(request) ? `₹${amountOf(request)} (illustrative demo price)` : "Not yet set"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-2">Payment</dt>
                <dd className="text-ink">{paymentLabel(request, state.people)}</dd>
              </div>
              {request.payment.status === "PAID_SIMULATED" && request.payment.payerId && (
                <div className="flex justify-between">
                  <dt className="text-ink-2">Paid by</dt>
                  <dd className="text-ink">{state.people[request.payment.payerId]?.name}</dd>
                </div>
              )}
            </dl>
          </section>
          {familyCanPay(request, person) && <PaymentCard amount={request.price.final ?? 0} onPay={() => dispatch({ type: "FAMILY_PAY", requestId: request.id, payerId: person.id })} />}
        </div>
      )}

      <Link to="/home" className="inline-flex min-h-[48px] items-center gap-2 font-semibold text-brand-dark hover:underline">
        <ArrowLeft size={18} /> Back to home
      </Link>
    </div>
  );
}
