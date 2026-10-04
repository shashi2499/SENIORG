import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoTag } from "@/components/ds/States";
import { useCurrentPerson } from "@/store/StoreContext";

interface PaymentCardProps {
  amount: number;
  onPay: () => void;
  paid?: boolean;
  payLabel?: string;
}

// A simulated payment, clearly labelled: amount up front, no PIN, OTP or card field.
export function PaymentCard({ amount, onPay, paid, payLabel }: PaymentCardProps) {
  const [paying, setPaying] = useState(false);
  const person = useCurrentPerson();

  if (paid) {
    return (
      <div className="flex items-center gap-3 rounded-card bg-success-tint p-5">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-white"
        >
          <Check size={20} />
        </motion.span>
        <p className="font-semibold text-success">Paid ₹{amount} (demo)</p>
      </div>
    );
  }

  // Payments are always made by the member, never by the desk.
  if (person?.role === "COORDINATOR") {
    return (
      <div className="flex items-start gap-3 rounded-card bg-sand p-5">
        <Hourglass size={20} className="mt-0.5 text-ink-3" />
        <div>
          <p className="font-semibold text-ink">Waiting for the member to pay · ₹{amount} (demo)</p>
          <p className="text-body-sm text-ink-2">The desk does not handle payments. The member will be reminded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-card-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-ink-2">Amount to pay</p>
        <DemoTag>Demo payment</DemoTag>
      </div>
      <p className="tabular mt-1 font-serif text-display text-ink">₹{amount}</p>
      <p className="text-meta text-ink-3">Illustrative demo price</p>
      <Button
        fullWidth
        className="mt-4"
        disabled={paying}
        onClick={() => {
          setPaying(true);
          window.setTimeout(onPay, 500);
        }}
      >
        <ShieldCheck size={20} />
        {paying ? "Processing…" : payLabel ?? "Pay securely (demo)"}
      </Button>
      <p className="mt-2 text-center text-meta text-ink-3">No PIN, OTP or card details are ever asked for here.</p>
    </div>
  );
}
