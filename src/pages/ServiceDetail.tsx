import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink, Check, X, LifeBuoy, HeartPulse, FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/ds/PageHeader";
import { Photo } from "@/components/ds/Photo";
import { PlannedState, EmptyState, DemoTag } from "@/components/ds/States";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/StoreContext";
import { SERVICE_IMAGE } from "@/lib/imagery";

const PARTNER_COPY: Record<string, { partner: string; partnerDoes: string[]; seniorgDoes: string[]; seniorgDoesNot: string[] }> = {
  "SV-BANKING": {
    partner: "your bank's doorstep-banking service",
    partnerDoes: ["Sends an authorised agent for doorstep services, as your bank offers them", "Handles life certificates, deposits and pension queries under the bank's own rules"],
    seniorgDoes: ["Explains what's needed before you start", "Helps you prepare documents and pick a time", "Reminds you of the dates that matter"],
    seniorgDoesNot: ["Ask for or hold your passwords, PINs or OTPs", "Operate your bank account", "Charge for the bank's service"],
  },
  "SV-TAX": {
    partner: "a qualified tax professional",
    partnerDoes: ["Files your ITR and Form 15H", "Advises on will-writing with a qualified professional"],
    seniorgDoes: ["Collects what the professional needs, in plain language", "Keeps your deadlines in Dates & renewals"],
    seniorgDoesNot: ["Give tax or legal advice itself", "File anything on your behalf"],
  },
};

// Partner referral (approved) and "later" services — honest about what
// SeniorG does, and clearly not "Book through SeniorG".
export function ServiceDetail() {
  const { serviceId } = useParams();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState<null | "ask" | "demo">(null);
  const service = serviceId ? state.services[serviceId] : undefined;

  if (!service) {
    return <EmptyState icon={FileQuestion} title="Service not found" action={{ label: "All services", onClick: () => navigate("/services") }} />;
  }

  if (service.scopeTag === "FUTURE") {
    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Services" title={service.name} />
        <PlannedState icon={HeartPulse} title="Not offered yet" body="Support around hospital stays and health paperwork is something members ask for. We'd rather say 'not yet' than promise a date we can't keep.">
          <Button variant="secondary" onClick={() => dispatch({ type: "TOGGLE_HELP_SHEET", open: true })}>
            <LifeBuoy size={18} /> Talk to SeniorG instead
          </Button>
        </PlannedState>
      </div>
    );
  }

  const copy = PARTNER_COPY[service.id];
  return (
    <div className="space-y-8">
      <div className="relative -mx-gutter overflow-hidden sm:mx-0 sm:rounded-card">
        <Photo slot={SERVICE_IMAGE[service.id] ?? "meeting"} className="h-48 sm:h-64" rounded="rounded-none" eager />
        <div className="scrim-bottom absolute inset-0" />
        <div className="absolute bottom-0 p-gutter text-white sm:p-6">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/90 px-3 py-1 text-tag font-semibold text-ink">
            <ExternalLink size={13} /> With a partner
          </span>
          <h1 className="mt-2 font-serif text-title text-white sm:text-display">{service.name}</h1>
        </div>
      </div>

      <p className="max-w-reading text-body text-ink-2">
        This is provided by {copy?.partner ?? "a partner"}, not booked through SeniorG. SeniorG helps you prepare, connects you, and stays your single point of help.
      </p>

      {copy && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Column title="The partner" items={copy.partnerDoes} />
          <Column title="SeniorG helps by" items={copy.seniorgDoes} tone="brand" />
          <Column title="SeniorG never" items={copy.seniorgDoesNot} tone="no" />
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => setLeaving("ask")}>
          <ExternalLink size={20} /> Continue with partner
        </Button>
        <Button variant="secondary" onClick={() => dispatch({ type: "TOGGLE_HELP_SHEET", open: true })}>
          <LifeBuoy size={20} /> Ask the desk to help me prepare
        </Button>
      </div>

      <Sheet open={leaving !== null} onClose={() => setLeaving(null)} title={leaving === "demo" ? "Partner page (demo)" : "You are leaving SeniorG"}>
        {leaving === "ask" ? (
          <div className="space-y-4">
            <p className="text-body text-ink">You're about to continue with {copy?.partner ?? "a partner"}. Their terms, fees and privacy rules apply.</p>
            <p className="text-body-sm text-ink-2">SeniorG will never ask for your PIN, OTP or password, and neither will a genuine partner over the phone.</p>
            <Button fullWidth onClick={() => setLeaving("demo")}>
              <ExternalLink size={18} /> Continue (demo)
            </Button>
            <Button variant="quiet" fullWidth onClick={() => setLeaving(null)}>
              Stay on SeniorG
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-card border-2 border-dashed border-ink/20 p-6 text-center">
              <DemoTag>External partner · simulated</DemoTag>
              <p className="mt-3 font-serif text-section text-ink">{service.name}</p>
              <p className="mt-2 text-body-sm text-ink-2">A placeholder for the partner's own page. No real site is opened and nothing is shared.</p>
            </div>
            <Button fullWidth onClick={() => setLeaving(null)}>
              Back to SeniorG
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function Column({ title, items, tone }: { title: string; items: string[]; tone?: "brand" | "no" }) {
  return (
    <div className={["rounded-card p-5", tone === "brand" ? "bg-brand-tint" : tone === "no" ? "bg-sand" : "border border-card-border bg-card"].join(" ")}>
      <p className="text-subhead text-ink">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-body-sm text-ink-2">
            {tone === "no" ? <X size={17} className="mt-0.5 shrink-0 text-critical" /> : <Check size={17} className="mt-0.5 shrink-0 text-brand" />}
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
