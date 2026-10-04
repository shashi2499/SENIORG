import { CheckCircle2 } from "lucide-react";
import type { Person, ServiceRequest } from "@/types/entities";
import { PAYMENT_STATUS_LABEL } from "@/lib/labels";
import { DemoTag } from "./States";

// Transparent price: what you were told, what changed and why, what you pay.
export function PriceBlock({ request, people }: { request: ServiceRequest; people: Record<string, Person> }) {
  const { estimate, agreed, final } = request.price;
  const approved = request.additionalWork.filter((w) => w.status === "APPROVED");
  const pending = request.additionalWork.filter((w) => w.status === "PENDING");
  const declined = request.additionalWork.filter((w) => w.status === "DECLINED");
  const base = agreed ?? estimate;
  const payer = request.payment.payerId ? people[request.payment.payerId] : undefined;
  const paid = request.payment.status === "PAID_SIMULATED";

  return (
    <div className="space-y-3">
      <dl className="space-y-2 text-body-sm">
        {base !== undefined && (
          <Row label={final ? "Visit and agreed work" : request.category === "HOME_REPAIR" ? "Visit fee (from)" : "Estimate"} value={`₹${base}`} />
        )}
        {approved.map((w) => (
          <Row key={w.id} label={`Added work · ${w.description}`} value={`+ ₹${w.amount}`} highlight />
        ))}
        {pending.map((w) => (
          <Row key={w.id} label={`Waiting for your approval · ${w.description}`} value={`₹${w.amount}`} muted />
        ))}
        {declined.map((w) => (
          <Row key={w.id} label={`Declined · ${w.description}`} value="not charged" muted />
        ))}
      </dl>
      <div className="flex items-end justify-between border-t border-line pt-3">
        <div>
          <p className="text-body-sm text-ink-2">{final ? "Total" : "Expected"}</p>
          <p className="text-meta text-ink-3">Illustrative demo price</p>
        </div>
        <p className="tabular font-serif text-title text-ink">{final ? `₹${final}` : base !== undefined ? `₹${base}` : "—"}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-tile bg-sand px-4 py-3 text-body-sm">
        <span className={["inline-flex items-center gap-1.5 font-semibold", paid ? "text-success" : "text-ink"].join(" ")}>
          {paid && <CheckCircle2 size={16} />}
          {PAYMENT_STATUS_LABEL[request.payment.status]}
          {paid && payer ? ` · by ${payer.name.split(" ")[0]}` : ""}
        </span>
        <DemoTag>Simulated payment</DemoTag>
      </div>
    </div>
  );
}

function Row({ label, value, highlight, muted }: { label: string; value: string; highlight?: boolean; muted?: boolean }) {
  return (
    <div className={["flex items-start justify-between gap-4", highlight ? "rounded-tile bg-needs-tint px-3 py-2" : ""].join(" ")}>
      <dt className={muted ? "text-ink-3" : "text-ink-2"}>{label}</dt>
      <dd className={["tabular shrink-0 font-semibold", muted ? "text-ink-3" : "text-ink"].join(" ")}>{value}</dd>
    </div>
  );
}
