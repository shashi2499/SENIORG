import { AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AdditionalWork } from "@/types/entities";

interface AdditionalWorkCardProps {
  work: AdditionalWork;
  currentTotal?: number;
  providerFirst?: string;
  onApprove: () => void;
  onDecline: () => void;
}

// The approval sheet: scope, reason, photo, amount and the new total, then
// Approve / Decline — both full width, neither pre-selected.
export function AdditionalWorkCard({ work, currentTotal, providerFirst = "The professional", onApprove, onDecline }: AdditionalWorkCardProps) {
  if (work.status !== "PENDING") return null;
  return (
    <div className="overflow-hidden rounded-card border-2 border-needs-ring bg-card shadow-lift">
      <div className="flex items-center gap-2 bg-needs-tint px-5 py-3 text-needs">
        <AlertCircle size={20} />
        <p className="font-semibold">Added work needs your approval</p>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="font-serif text-section text-ink">{work.description}</p>
          <p className="mt-1 text-body text-ink-2">
            {providerFirst} says: {work.reason}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-tile bg-sand p-3 text-body-sm text-ink-2">
          <Camera size={20} className="shrink-0" /> Photo shared by {providerFirst} (demo placeholder)
        </div>
        <dl className="space-y-1 text-body">
          <div className="flex justify-between">
            <dt className="text-ink-2">This work</dt>
            <dd className="tabular font-semibold text-ink">+ ₹{work.amount}</dd>
          </div>
          {currentTotal !== undefined && (
            <div className="flex justify-between">
              <dt className="text-ink-2">New total if approved</dt>
              <dd className="tabular font-semibold text-ink">₹{currentTotal + work.amount}</dd>
            </div>
          )}
        </dl>
        <p className="text-meta text-ink-3">Illustrative demo price. Nothing is charged unless you approve.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button fullWidth onClick={onApprove}>
            Approve ₹{work.amount}
          </Button>
          <Button variant="secondary" fullWidth onClick={onDecline}>
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
