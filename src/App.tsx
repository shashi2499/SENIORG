import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { HelpSheet } from "@/components/HelpSheet";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useCurrentPerson } from "@/store/StoreContext";
import { isHouseholdMember } from "@/lib/visibility";
import { AppShell } from "@/components/shell/AppShell";
import { NotFound } from "@/pages/NotFound";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Explore } from "@/pages/Explore";
import { EventDetail } from "@/pages/EventDetail";
import { EventBooking } from "@/pages/EventBooking";
import { SmartMinuteDetail } from "@/pages/SmartMinuteDetail";
import { Learn } from "@/pages/Learn";
import { Saved } from "@/pages/Saved";
import { Requests } from "@/pages/Requests";
import { RequestDetail } from "@/pages/RequestDetail";
import { Household } from "@/pages/Household";
import { RemindersList } from "@/pages/RemindersList";
import { ReminderDetail } from "@/pages/ReminderDetail";
import { FamilyCircle } from "@/pages/FamilyCircle";
import { DocumentsPage, TrustedContactsPage, ProfilePage, PaymentsPage } from "@/pages/HouseholdSections";
import { AcRepairBooking } from "@/pages/journeys/AcRepairBooking";
import { GoWithMeBooking } from "@/pages/journeys/GoWithMeBooking";
import { HouseHelpBooking } from "@/pages/journeys/HouseHelpBooking";
import { Landing } from "@/pages/Landing";
import { Join } from "@/pages/onboarding/Join";
import { OnboardingProvider } from "@/onboarding/OnboardingContext";

// Services, Explore and Household belong to the member. Family members only
// get Home and Requests (their shared view), so these routes bounce them home.
// Booking journeys are full-screen task flows outside the tab shell, but Help
// (and the reviewer's role switcher) must still be one tap away.
function JourneyShell() {
  return (
    <MotionConfig reducedMotion="user">
      <Outlet />
      <HelpSheet />
      <RoleSwitcher />
    </MotionConfig>
  );
}

// The front door — landing and join flow — sits before the app shell. It hands
// over to the same app (no parallel product) once the person enters SeniorG.
function OnboardingShell() {
  return (
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  );
}

function MemberAreaGuard() {
  const person = useCurrentPerson();
  return person && !isHouseholdMember(person) ? <Navigate to="/home" replace /> : <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<OnboardingShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/join" element={<Navigate to="/join/details" replace />} />
        <Route path="/join/:step" element={<Join />} />
      </Route>

      {/* Full-screen booking wizards live outside the five-tab shell —
          a focused task flow, not another tab destination. */}
      <Route element={<JourneyShell />}>
      <Route element={<MemberAreaGuard />}>
      <Route path="/services/ac-repair/book" element={<AcRepairBooking />} />
      <Route path="/services/go-with-me/book" element={<GoWithMeBooking />} />
      <Route path="/services/house-help/book" element={<HouseHelpBooking />} />
      </Route>
      </Route>

      <Route element={<AppShell />}>
        <Route path="/home" element={<Home />} />

        <Route element={<MemberAreaGuard />}>
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/learn" element={<Learn />} />
        <Route path="/explore/learn/:videoId" element={<SmartMinuteDetail />} />
        <Route path="/explore/saved" element={<Saved />} />
        <Route path="/explore/:eventId" element={<EventDetail />} />
        <Route path="/explore/:eventId/book" element={<EventBooking />} />
        </Route>

        <Route path="/requests" element={<Requests />} />
        <Route path="/requests/:requestId" element={<RequestDetail />} />

        <Route element={<MemberAreaGuard />}>
        <Route path="/household" element={<Household />} />
        <Route path="/household/reminders" element={<RemindersList />} />
        <Route path="/household/reminders/:reminderId" element={<ReminderDetail />} />
        <Route path="/household/documents" element={<DocumentsPage />} />
<Route path="/household/family" element={<FamilyCircle />} />
        <Route path="/household/trusted-contacts" element={<TrustedContactsPage />} />
        <Route path="/household/profile" element={<ProfilePage />} />
        <Route path="/household/payments" element={<PaymentsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
