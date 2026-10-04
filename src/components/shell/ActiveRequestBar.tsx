import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { isFamilyRole } from "@/lib/visibility";
import { spotlightRequest } from "@/lib/attention";
import { presentRequest, TONE_STYLE } from "@/lib/presentation";

// The request in flight, one tap away from anywhere — a calm floating pill on
// phones (above the tabs), hidden where the request is already on screen.
export function ActiveRequestBar() {
  const { state } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const location = useLocation();

  const request = person && !isFamilyRole(person) && person.role !== "COORDINATOR" ? spotlightRequest(state, person) : undefined;
  const hidden = !request || location.pathname === `/requests/${request.id}` || location.pathname === "/home";
  const p = request && person ? presentRequest(request, state.providers, state.people, person.id) : undefined;

  return (
    <AnimatePresence>
      {!hidden && request && p && (
        <motion.button
          key={request.id}
          onClick={() => navigate(`/requests/${request.id}`)}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
          className={[
            "fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-3 rounded-pill px-4 py-2.5 text-left shadow-lift lg:hidden",
            p.tone === "needs" ? "bg-accent text-ink" : "bg-brand-deep text-white",
          ].join(" ")}
          aria-label={`${request.title}: ${p.headline}. Open request`}
        >
          <motion.span
            className={["h-2.5 w-2.5 shrink-0 rounded-full", p.tone === "needs" ? "bg-ink" : TONE_STYLE.needs.dot].join(" ")}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-sm font-semibold">{p.headline}</span>
            <span className={["block truncate text-tag", p.tone === "needs" ? "text-ink/75" : "text-white/75"].join(" ")}>{request.title}</span>
          </span>
          <ChevronRight size={18} className="shrink-0" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
