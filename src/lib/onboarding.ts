import type { AssistanceStyle, HelpFocus, HelpLanguage, OnboardingPlan, OnboardingProfile, SupportScope } from "@/store/types";
import { demoToday } from "./date";

// The new front door: landing → registration → demo verification →
// membership/trial → personalisation → SeniorG Brief → the existing app.

export const MEMBERSHIP_PRICE = "₹999";
export const MEMBERSHIP_PRICE_LABEL = "₹999 / month";
export const TRIAL_DAYS = 7;
export const PRICE_NOTE = "₹999/month — illustrative prototype price";
export const CHECKOUT_NOTE = "Demo checkout · no payment is taken";
export const MUMBAI_PREVIEW_NOTE = "Mumbai preview — sample listings shown for demonstration.";

// The registration personalises the principal member's own account.
export const PRINCIPAL_MEMBER_ID = "P-SURESH";

export const STEPS = [
  "details",
  "city",
  "dob",
  "aadhaar",
  "otp",
  "plan",
  "checkout",
  "support",
  "focus",
  "language",
  "style",
  "brief",
] as const;
export type Step = (typeof STEPS)[number];

export const PHASES: { label: string; steps: Step[] }[] = [
  { label: "About you", steps: ["details", "city", "dob"] },
  { label: "Verify", steps: ["aadhaar", "otp"] },
  { label: "Membership", steps: ["plan", "checkout"] },
  { label: "Personalise", steps: ["support", "focus", "language", "style"] },
];

export interface OnboardingDraft {
  name: string;
  mobile: string;
  email: string;
  city?: "Pune" | "Mumbai";
  dob?: string;
  aadhaarLast4: string;
  verified: boolean;
  plan?: OnboardingPlan;
  planConfirmed: boolean;
  supportScope?: SupportScope;
  focus: HelpFocus[];
  language?: HelpLanguage;
  assistance?: AssistanceStyle;
  demoPersona: boolean;
}

export const EMPTY_DRAFT: OnboardingDraft = {
  name: "",
  mobile: "",
  email: "",
  aadhaarLast4: "1234",
  verified: false,
  planConfirmed: false,
  focus: [],
  demoPersona: false,
};

export const DEMO_DETAILS = {
  name: "Suresh Kulkarni",
  mobile: "98220 41187",
  email: "suresh.k@example.com",
};

export function validName(v: string) {
  return v.trim().length >= 2;
}
export function validMobile(v: string) {
  return /^[6-9]\d{9}$/.test(v.replace(/\D/g, ""));
}
export function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

// Which steps are already satisfied — used to keep deep links honest.
export function stepComplete(step: Step, d: OnboardingDraft): boolean {
  switch (step) {
    case "details":
      return validName(d.name) && validMobile(d.mobile) && validEmail(d.email);
    case "city":
      return !!d.city;
    case "dob":
      return !!d.dob;
    case "aadhaar":
      return /^\d{4}$/.test(d.aadhaarLast4);
    case "otp":
      return d.verified;
    case "plan":
      return !!d.plan;
    case "checkout":
      return d.planConfirmed;
    case "support":
      return !!d.supportScope;
    case "focus":
      return d.focus.length > 0;
    case "language":
      return !!d.language;
    case "style":
      return !!d.assistance;
    case "brief":
      return false;
  }
}

export function firstIncomplete(d: OnboardingDraft): Step {
  return STEPS.find((s) => !stepComplete(s, d)) ?? "brief";
}

export function toProfile(d: OnboardingDraft): OnboardingProfile {
  return {
    personId: PRINCIPAL_MEMBER_ID,
    name: d.name.trim(),
    mobile: d.mobile,
    email: d.email.trim(),
    city: d.city ?? "Pune",
    dob: d.dob ?? "",
    aadhaarLast4: d.aadhaarLast4,
    plan: d.plan ?? "TRIAL",
    supportScope: d.supportScope ?? "JUST_ME",
    focus: d.focus,
    language: d.language ?? "English",
    assistance: d.assistance ?? "HELP_ME_BOOK",
    demoPersona: d.demoPersona && d.name.trim() === DEMO_DETAILS.name,
    completedAt: new Date().toISOString(),
  };
}

export function trialEndDate(): Date {
  const d = demoToday();
  d.setDate(d.getDate() + TRIAL_DAYS);
  return d;
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export const FOCUS_LABEL: Record<HelpFocus, string> = {
  HOME_SERVICES: "Home services",
  GO_WITH_ME: "Go With Me / appointments",
  REMINDERS: "Reminders",
  LOCAL_ACTIVITIES: "Local activities",
};

export const ASSISTANCE_LABEL: Record<AssistanceStyle, { title: string; body: string; brief: string }> = {
  SELF: {
    title: "I'll do things myself",
    body: "Show me the options. I'll book and decide.",
    brief: "You'll do things yourself — SeniorG keeps options clear and stays one tap away.",
  },
  HELP_ME_BOOK: {
    title: "Help me book",
    body: "Suggest the right option and book it with my OK.",
    brief: "SeniorG will suggest and book — nothing happens without your OK.",
  },
  HANDLE_IT: {
    title: "Handle it for me",
    body: "Hand it to SeniorG. I'll approve anything that costs more.",
    brief: "SeniorG will handle things for you — you approve anything that costs more.",
  },
};

export function planSummary(plan: OnboardingPlan): string {
  return plan === "MEMBERSHIP"
    ? `Membership · ${MEMBERSHIP_PRICE_LABEL}`
    : `Free trial until ${formatDay(trialEndDate())}, then ${MEMBERSHIP_PRICE_LABEL}`;
}
