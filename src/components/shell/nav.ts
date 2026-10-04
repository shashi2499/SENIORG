import { House, Wrench, Compass, ClipboardList, Users } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: House },
  { to: "/services", label: "Services", icon: Wrench },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/requests", label: "Requests", icon: ClipboardList },
  { to: "/household", label: "Household", icon: Users },
] as const;

// Family members see only Home and Requests — the other tabs are the member's own.
export const FAMILY_NAV_ITEMS = NAV_ITEMS.filter((i) => i.to === "/home" || i.to === "/requests");

export const TOP_LEVEL_PATHS = NAV_ITEMS.map((item) => item.to);
