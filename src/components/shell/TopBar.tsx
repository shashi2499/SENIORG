import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Inbox } from "lucide-react";
import { DirectButton } from "../direct/SeniorGDirect";
import { NAV_ITEMS, TOP_LEVEL_PATHS } from "./nav";
import { useCurrentPerson, useStore } from "@/store/StoreContext";

// Calm top bar: where you came from on the left, updates and SeniorG Direct on
// the right. The bell is reserved for SeniorG Direct (a person), so updates use
// an inbox — the two never look alike.
export function TopBar() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const person = useCurrentPerson();

  const section = NAV_ITEMS.find((i) => location.pathname.startsWith(i.to));
  const isTopLevel = TOP_LEVEL_PATHS.some((p) => location.pathname === p) || location.pathname === "/";
  const unread = state.notifications.filter((n) => !n.read && n.recipientId === state.currentRoleId).length;

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-3 page-gutter">
        <div className="flex min-w-0 items-center gap-1">
          {isTopLevel ? (
            <button className="flex items-center gap-2 lg:hidden" onClick={() => dispatch({ type: "TOGGLE_PROTOTYPE_LENS" })} aria-label="SeniorG">
              <Wordmark />
            </button>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="-ml-2 flex min-h-[44px] items-center gap-1 rounded-pill pl-1 pr-3 font-semibold text-ink-2 hover:bg-sand hover:text-ink"
            >
              <ChevronLeft size={24} />
              <span className="truncate text-body-sm">{section?.label ?? "Back"}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dispatch({ type: "TOGGLE_NOTIFICATIONS", open: true })}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink-2 hover:bg-sand hover:text-ink"
            aria-label={unread ? `Updates, ${unread} new` : "Updates"}
          >
            <Inbox size={22} strokeWidth={1.75} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-tag font-bold text-ink">
                {unread}
              </span>
            )}
          </button>
          <DirectButton variant="header" />
          <button
            onClick={() => dispatch({ type: "TOGGLE_ROLE_SWITCHER", open: true })}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-tag font-bold text-white lg:hidden"
            aria-label={`Viewing as ${person?.name ?? "—"}. Switch role (prototype)`}
          >
            {person?.avatarInitials ?? "?"}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Wordmark({ light }: { light?: boolean }) {
  return (
    <span className={["flex items-baseline font-serif text-[1.375rem] leading-none tracking-tight", light ? "text-white" : "text-ink"].join(" ")}>
      Senior<span className={light ? "text-accent" : "text-brand"}>G</span>
    </span>
  );
}
