import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const panelTransition = { type: "spring" as const, damping: 30, stiffness: 320 };

// Bottom sheet on phones, centred dialog on larger screens.
export function Sheet({ open, onClose, title, subtitle, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            aria-label="Close"
            className="absolute inset-0 bg-ink/45"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-t-[1.75rem] bg-card px-gutter pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 shadow-lift sm:max-w-lg sm:rounded-[1.75rem] sm:px-7 sm:pb-7"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={panelTransition}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-pill bg-ink/15 sm:hidden" aria-hidden="true" />
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-section text-ink">{title}</h2>
                {subtitle && <p className="mt-1 text-body-sm text-ink-2">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-sand"
              >
                <X size={22} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
