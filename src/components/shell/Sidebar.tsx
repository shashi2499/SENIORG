import { NavLink } from "react-router-dom";
import { FlaskConical, RotateCcw, Repeat } from "lucide-react";
import { DirectButton } from "../direct/SeniorGDirect";
import { NAV_ITEMS, FAMILY_NAV_ITEMS } from "./nav";
import { Wordmark } from "./TopBar";
import { isFamilyRole, isHouseholdMember } from "@/lib/visibility";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { ConfirmButton } from "../ui/ConfirmButton";

export function Sidebar() {
  const { dispatch } = useStore();
  const person = useCurrentPerson();
  const items = person && !isHouseholdMember(person) ? FAMILY_NAV_ITEMS : NAV_ITEMS;

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-line lg:bg-card">
      <div className="px-7 pb-8 pt-7">
        <Wordmark />
        <p className="mt-1.5 text-meta text-ink-3">Your everyday-life service desk</p>
      </div>

      <nav className="space-y-1 px-4" aria-label="Primary">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex min-h-[48px] items-center gap-3 rounded-pill px-4 text-body font-medium transition duration-calm",
                isActive ? "bg-brand-tint font-semibold text-brand-dark" : "text-ink-2 hover:bg-sand hover:text-ink",
              ].join(" ")
            }
          >
            <Icon size={21} strokeWidth={1.85} />
            {label}
          </NavLink>
        ))}
      </nav>

      {!isFamilyRole(person) && person?.role !== "COORDINATOR" && (
        <DirectButton variant="sidebar" className="mx-4 mt-6" />
      )}

      {/* Reviewer tooling — kept visibly apart from the product. */}
      <div className="mt-auto px-4 pb-6 pt-8">
        <div className="rounded-card border-2 border-dashed border-ink/15 p-3">
          <p className="px-2 pb-2 font-mono text-[0.75rem] font-semibold uppercase tracking-wider text-ink-3">Prototype</p>
          <button
            onClick={() => dispatch({ type: "TOGGLE_ROLE_SWITCHER", open: true })}
            className="flex w-full items-center gap-3 rounded-tile px-2 py-2 text-left hover:bg-sand"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-tag font-bold text-white">
              {person?.avatarInitials ?? "?"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-sm font-semibold text-ink">{person?.name ?? "Choose a role"}</span>
              <span className="flex items-center gap-1 text-tag text-ink-3">
                <Repeat size={12} /> Switch role
              </span>
            </span>
          </button>
          <button
            onClick={() => dispatch({ type: "TOGGLE_PROTOTYPE_LENS", open: true })}
            className="mt-1 flex w-full items-center gap-2 rounded-tile px-2 py-2 text-tag font-semibold text-ink-2 hover:bg-sand"
          >
            <FlaskConical size={15} /> Prototype lens
          </button>
          <ConfirmButton
            onConfirm={() => dispatch({ type: "RESET_DEMO" })}
            confirmLabel="Click again to confirm reset"
            className="flex w-full items-center gap-2 rounded-tile px-2 py-2 text-tag font-semibold text-critical hover:bg-critical-tint"
          >
            <RotateCcw size={15} /> Reset demo
          </ConfirmButton>
        </div>
      </div>
    </aside>
  );
}
