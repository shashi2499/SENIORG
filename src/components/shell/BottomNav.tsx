import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { NAV_ITEMS, FAMILY_NAV_ITEMS } from "./nav";
import { useCurrentPerson } from "@/store/StoreContext";
import { isFamilyRole, isHouseholdMember } from "@/lib/visibility";

export function BottomNav() {
  const person = useCurrentPerson();
  const items = person && !isHouseholdMember(person) ? FAMILY_NAV_ITEMS : NAV_ITEMS;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 shadow-bar backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-xl">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink to={to} className="flex min-h-[64px] flex-col items-center justify-center gap-1 pt-1">
              {({ isActive }) => (
                <>
                  <span className="relative flex h-8 w-14 items-center justify-center">
                    {isActive && (
                      <motion.span
                        layoutId="tab-pill"
                        className="absolute inset-0 rounded-pill bg-brand-tint"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Icon size={22} strokeWidth={isActive ? 2.2 : 1.75} className={["relative", isActive ? "text-brand-dark" : "text-ink-3"].join(" ")} />
                  </span>
                  <span className={["text-tag", isActive ? "font-bold text-brand-dark" : "font-medium text-ink-2"].join(" ")}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
