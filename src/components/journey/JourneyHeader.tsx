import { ChevronLeft, LifeBuoy } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { useStore } from "@/store/StoreContext";

interface JourneyHeaderProps {
  title: string;
  stepIndex: number; // 0-based
  stepCount: number;
  onBack: () => void;
  onHelp?: () => void;
}

// The top of every booking journey: where you are, how far along, and a person
// one tap away — Help is never hidden inside a task.
export function JourneyHeader({ title, stepIndex, stepCount, onBack, onHelp }: JourneyHeaderProps) {
  const { dispatch } = useStore();
  return (
    <div className="sticky top-0 z-30 -mx-gutter mb-6 border-b border-line/70 bg-surface/95 px-gutter pb-3 pt-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <button onClick={onBack} aria-label="Back" className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-sand">
            <ChevronLeft size={26} />
          </button>
          <div className="min-w-0">
            <p className="text-meta font-semibold text-brand-dark">
              Step {stepIndex + 1} of {stepCount}
            </p>
            <h1 className="truncate font-serif text-section text-ink">{title}</h1>
          </div>
        </div>
        <button
          onClick={onHelp ?? (() => dispatch({ type: "TOGGLE_HELP_SHEET", open: true }))}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-pill bg-brand-tint px-4 text-body-sm font-semibold text-brand-dark hover:bg-brand-soft"
        >
          <LifeBuoy size={18} /> Help
        </button>
      </div>
      <div className="mt-3">
        <StepIndicator current={stepIndex} total={stepCount} />
      </div>
    </div>
  );
}
