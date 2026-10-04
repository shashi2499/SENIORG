import React from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

interface ConfirmSheetProps {
  open: boolean;
  title: string;
  body?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

// One consistent way to confirm anything that matters.
export function ConfirmSheet({ open, title, body, confirmLabel, cancelLabel = "Cancel", tone = "primary", onConfirm, onCancel, children }: ConfirmSheetProps) {
  return (
    <Sheet open={open} onClose={onCancel} title={title}>
      {body && <div className="text-body text-ink-2">{body}</div>}
      {children}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
        <Button variant={tone === "danger" ? "danger" : "primary"} fullWidth onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="quiet" fullWidth onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </Sheet>
  );
}
