import { BadgeCheck, Building2, ShieldCheck, Star } from "lucide-react";
import type { Provider, ServiceRequest } from "@/types/entities";
import { Avatar } from "./Avatar";

const ROLE_WORD: Record<string, string> = {
  REPAIR: "Professional",
  COMPANION: "Companion",
  HOUSE_HELP: "Helper",
};

// Three names, three responsibilities: the person who visits, the business that
// employs and invoices, and SeniorG who coordinates and stands behind it.
export function ProviderCard({ provider, request }: { provider: Provider; request: ServiceRequest }) {
  const role = ROLE_WORD[provider.type] ?? "Professional";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar initials={provider.avatarInitials} seed={provider.id} size={60} ring={provider.idChecked} />
        <div className="min-w-0">
          <p className="text-meta font-semibold text-ink-3">{role}</p>
          <p className="font-serif text-section leading-tight text-ink">{provider.name}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-ink-2">
            <span className="inline-flex items-center gap-1">
              <Star size={15} className="fill-accent text-accent" /> {provider.rating}
            </span>
            <span>{provider.jobsWithMembers} jobs with members</span>
            {provider.idChecked && (
              <span className="inline-flex items-center gap-1 text-success">
                <BadgeCheck size={16} /> ID checked
              </span>
            )}
          </p>
        </div>
      </div>
      <ul className="space-y-2.5 rounded-tile bg-sand p-4 text-body-sm">
        <li className="flex gap-3">
          <UserDot />
          <span>
            <strong className="font-semibold text-ink">{provider.name.split(" ")[0]}</strong>
            <span className="text-ink-2"> {request.category === "GO_WITH_ME" ? "travels with you" : request.category === "HOUSE_HELP" ? "helps at home" : "visits and does the work"}</span>
          </span>
        </li>
        <li className="flex gap-3">
          <Building2 size={18} className="mt-0.5 shrink-0 text-ink-3" />
          <span>
            <strong className="font-semibold text-ink">{provider.business}</strong>
            <span className="text-ink-2"> employs {provider.name.split(" ")[0]} and sends the invoice</span>
          </span>
        </li>
        <li className="flex gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" />
          <span>
            <strong className="font-semibold text-ink">SeniorG</strong>
            <span className="text-ink-2"> coordinates, checks quality and is your single point of help</span>
          </span>
        </li>
      </ul>
      {provider.languages?.length > 0 && <p className="text-meta text-ink-3">Speaks {provider.languages.join(", ")}</p>}
    </div>
  );
}

function UserDot() {
  return <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />;
}
