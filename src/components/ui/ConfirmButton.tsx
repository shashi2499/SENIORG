import { useState } from "react";
import { Check } from "lucide-react";

interface ConfirmButtonProps {
  onConfirm: () => void;
  className: string;
  children: React.ReactNode;
  confirmLabel: string;
}

// A two-step inline confirmation, used instead of window.confirm() so the
// prototype never relies on a native browser dialog (keeps the calm, premium
// feel from the design brief, and never blocks automated testing).
export function ConfirmButton({ onConfirm, className, children, confirmLabel }: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);

  if (armed) {
    return (
      <button
        className={className}
        onClick={() => {
          setArmed(false);
          onConfirm();
        }}
        onBlur={() => setArmed(false)}
      >
        <Check size={16} />
        {confirmLabel}
      </button>
    );
  }

  return (
    <button className={className} onClick={() => setArmed(true)}>
      {children}
    </button>
  );
}
