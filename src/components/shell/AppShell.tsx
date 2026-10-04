import { Outlet, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { RightRail } from "./RightRail";
import { ActiveRequestBar } from "./ActiveRequestBar";
import { PageTransition } from "./PageTransition";
import { RoleSwitcher } from "../RoleSwitcher";
import { HelpSheet } from "../HelpSheet";
import { PrototypeLens } from "../PrototypeLens";
import { NotificationsPanel } from "../NotificationsPanel";
import { useCurrentPerson } from "@/store/StoreContext";
import { isFamilyRole } from "@/lib/visibility";

// Routes where the desktop right rail ("Needs your attention", "SeniorG help")
// earns its space. Detail pages and editorial pages use the full width.
const RAIL_ROUTES = ["/home", "/requests", "/household", "/household/reminders"];

export function AppShell() {
  const location = useLocation();
  const person = useCurrentPerson();
  const member = !!person && !isFamilyRole(person) && person.role !== "COORDINATOR" && person.role !== "ADMIN";
  const rail = member && RAIL_ROUTES.includes(location.pathname);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 pb-36 lg:pb-16">
            <div className="mx-auto w-full max-w-page page-gutter pt-6 sm:pt-8 lg:pt-10">
              <div className={rail ? "xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-10" : ""}>
                <div className="min-w-0">
                  <PageTransition>
                    <Outlet />
                  </PageTransition>
                </div>
                {rail && <RightRail />}
              </div>
            </div>
          </main>
          <ActiveRequestBar />
          <BottomNav />
        </div>
        <RoleSwitcher />
        <HelpSheet />
        <PrototypeLens />
        <NotificationsPanel />
      </div>
    </MotionConfig>
  );
}
