import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { EMPTY_DRAFT, type OnboardingDraft } from "@/lib/onboarding";

// The in-progress registration. Kept apart from the app store until the person
// enters SeniorG, and saved for the session so Back and refresh never lose it.
const KEY = "seniorg-onboarding-draft-v1";

function load(): OnboardingDraft {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? { ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<OnboardingDraft>) } : EMPTY_DRAFT;
  } catch {
    return EMPTY_DRAFT;
  }
}

interface Ctx {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft> | ((d: OnboardingDraft) => Partial<OnboardingDraft>)) => void;
  clear: () => void;
}

const OnboardingContext = createContext<Ctx | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(load);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify(draft));
    } catch {
      // storage unavailable — the flow still works for this page view.
    }
  }, [draft]);

  const value = useMemo<Ctx>(
    () => ({
      draft,
      update: (patch) => setDraft((d) => ({ ...d, ...(typeof patch === "function" ? patch(d) : patch) })),
      clear: () => {
        // Remove directly too: entering the app unmounts this provider before
        // the save effect could run.
        try {
          window.sessionStorage.removeItem(KEY);
        } catch {
          // ignore
        }
        setDraft(EMPTY_DRAFT);
      },
    }),
    [draft]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): Ctx {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within an OnboardingProvider");
  return ctx;
}
