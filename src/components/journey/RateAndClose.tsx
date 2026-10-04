import { useState } from "react";
import { Star, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCurrentPerson } from "@/store/StoreContext";

interface RateAndCloseProps {
  onClose: (rating: number) => void;
}

const WORDS = ["", "Not good", "Could be better", "Fine", "Good", "Excellent"];

export function RateAndClose({ onClose }: RateAndCloseProps) {
  const [rating, setRating] = useState(5);
  const person = useCurrentPerson();

  if (person?.role === "COORDINATOR") {
    return (
      <div className="flex items-start gap-3 rounded-card bg-sand p-5">
        <Hourglass size={20} className="mt-0.5 text-ink-3" />
        <div>
          <p className="font-semibold text-ink">Waiting for the member to rate and close</p>
          <p className="text-body-sm text-ink-2">Everything else is complete. Rating is the member's choice.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-card-border bg-card p-5 shadow-soft">
      <p className="text-subhead text-ink">How did it go?</p>
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={rating === n}
            onClick={() => setRating(n)}
            aria-label={`${n} of 5: ${WORDS[n]}`}
            className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-sand"
          >
            <Star size={30} className={n <= rating ? "fill-accent text-accent" : "text-ink/20"} />
          </button>
        ))}
        <span className="ml-2 text-body-sm font-semibold text-ink-2">{WORDS[rating]}</span>
      </div>
      <Button fullWidth className="mt-4" onClick={() => onClose(rating)}>
        Close request
      </Button>
    </div>
  );
}
