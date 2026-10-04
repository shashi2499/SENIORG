import { Sheet } from "./ui/Sheet";
import { useStore } from "@/store/StoreContext";

const ROLE_ORDER = ["P-SURESH", "P-ASHA", "P-MEERA", "P-ROHAN", "P-PRIYA", "P-ADMIN"];

const ROLE_SUBTITLE: Record<string, string> = {
  "P-SURESH": "Member · Household principal",
  "P-ASHA": "Spouse · Equal account",
  "P-MEERA": "Family · Viewer (Toronto)",
  "P-ROHAN": "Family · Payer (Bengaluru)",
  "P-PRIYA": "SeniorG desk coordinator",
  "P-ADMIN": "Operations / admin",
};

export function RoleSwitcher() {
  const { state, dispatch } = useStore();
  const open = state.ui.roleSwitcherOpen;

  return (
    <Sheet open={open} onClose={() => dispatch({ type: "TOGGLE_ROLE_SWITCHER", open: false })} title="Choose who you are">
      <p className="mb-4 rounded-tile border-2 border-dashed border-ink/15 px-4 py-3 text-body-sm text-ink-2">
        This switches the whole prototype to that person's view. Suresh and Asha are equal, independent
        household members — not a principal and a dependant.
      </p>
      <ul className="space-y-2">
        {[...ROLE_ORDER, ...Object.keys(state.people).filter((id) => !ROLE_ORDER.includes(id))].map((id) => {
          const person = state.people[id];
          if (!person) return null;
          const active = state.currentRoleId === id;
          return (
            <li key={id}>
              <button
                onClick={() => {
                  dispatch({ type: "SET_CURRENT_ROLE", personId: id });
                  dispatch({ type: "TOGGLE_ROLE_SWITCHER", open: false });
                }}
                className={[
                  "flex w-full items-center gap-3 rounded-card border px-4 py-3 text-left",
                  active ? "border-brand bg-brand-tint" : "border-card-border hover:bg-ink/5",
                ].join(" ")}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {person.avatarInitials}
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold text-ink">{person.name}</span>
                  <span className="text-meta text-ink-2">{ROLE_SUBTITLE[id] ?? `${person.relation ?? "Family"} · invited (demo)`}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}
