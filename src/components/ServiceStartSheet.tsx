import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Sheet } from "./ui/Sheet";
import { Button } from "./ui/Button";
import { BookingTypeBadge } from "./ui/BookingTypeBadge";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { buildServiceRequestFromService } from "@/lib/requestFactory";
import type { Service, ServiceCategory } from "@/types/entities";

const STEP_PREVIEW: Partial<Record<ServiceCategory, string[]>> = {
  HOME_REPAIR: ["Describe issue", "Match provider", "See price", "Confirm", "Track"],
  GO_WITH_ME: ["Destination", "Assistance type", "Date & time", "Companion", "Track"],
  HOUSE_HELP: ["Help type", "Duration", "Preferences", "Helper", "Daily tracker"],
};

interface ServiceStartSheetProps {
  service: Service | null;
  onClose: () => void;
}

export function ServiceStartSheet({ service, onClose }: ServiceStartSheetProps) {
  const { dispatch } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);

  function handleClose() {
    setJustCreatedId(null);
    onClose();
  }

  function handleStart() {
    if (!service || !person) return;
    const request = buildServiceRequestFromService(service, person);
    dispatch({ type: "CREATE_REQUEST", request, actorId: person.id });
    setJustCreatedId(request.id);
    window.setTimeout(() => {
      navigate(`/requests/${request.id}`);
      handleClose();
    }, 650);
  }

  const steps = service ? STEP_PREVIEW[service.category] ?? ["Request", "Match", "Confirm", "Track"] : [];

  return (
    <Sheet open={!!service} onClose={handleClose} title={service?.name ?? ""}>
      {justCreatedId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-8 text-center"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success"
          >
            <Check size={28} />
          </motion.span>
          <p className="font-semibold text-ink">Request started · {justCreatedId}</p>
          <p className="text-body-sm text-ink-2">Taking you to it now…</p>
        </motion.div>
      ) : (
        service && (
          <div className="space-y-5">
            <BookingTypeBadge type={service.bookingType} />
            <p className="text-body-sm text-ink-2">
              SeniorG coordinates this end to end — a verified professional, a published price range, and a
              single request you can track.
            </p>

            <div>
              <p className="mb-2 text-body-sm font-semibold text-ink-2">What happens</p>
              <div className="flex flex-wrap gap-2">
                {steps.map((step, i) => (
                  <span
                    key={step}
                    className="rounded-pill bg-brand-tint px-3 py-1 text-tag font-semibold text-brand-dark"
                  >
                    {i + 1}. {step}
                  </span>
                ))}
              </div>
            </div>

            {(service.visitFee || service.estimateRange) && (
              <div className="rounded-card bg-ink/5 p-4">
                <p className="text-body-sm font-semibold text-ink-2">Illustrative demo price</p>
                <p className="font-semibold text-ink">
                  {service.visitFee ? `Visit fee ₹${service.visitFee}` : null}
                  {service.estimateRange
                    ? `${service.visitFee ? " · " : ""}Typical range ₹${service.estimateRange[0]}–₹${service.estimateRange[1]}`
                    : ""}
                </p>
              </div>
            )}

            <Button fullWidth onClick={handleStart}>
              Start {service.name}
            </Button>
            <p className="text-center text-meta text-ink-3">
              SeniorG creates your request now and matches a verified professional. You'll see who and when before anyone visits.
            </p>
          </div>
        )
      )}
    </Sheet>
  );
}
