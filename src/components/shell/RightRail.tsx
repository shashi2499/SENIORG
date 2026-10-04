import { Link } from "react-router-dom";
import { AlertCircle, Headset, CheckCircle2, CalendarClock, LifeBuoy, ChevronRight } from "lucide-react";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { attentionFor, handledByDesk } from "@/lib/attention";
import { presentRequest } from "@/lib/presentation";

// The desktop right rail answers two questions only: what needs me, and who is
// helping. Nothing decorative lives here.
export function RightRail() {
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  if (!person) return null;
  const items = attentionFor(state, person);
  const desk = handledByDesk(state, person);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-5">
        <section className="surface-primary p-5">
          <h2 className="flex items-center gap-2 text-subhead text-ink">
            <AlertCircle size={18} className="text-needs" /> Needs your attention
          </h2>
          {items.length === 0 ? (
            <p className="mt-3 flex items-center gap-2 text-body-sm text-ink-2">
              <CheckCircle2 size={18} className="text-success" /> Nothing needs you right now.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {items.slice(0, 5).map((i) => (
                <li key={i.id}>
                  <Link to={i.to} className="group flex items-start gap-3 py-3">
                    {i.kind === "reminder" ? (
                      <CalendarClock size={18} className="mt-0.5 shrink-0 text-ink-3" />
                    ) : (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-body-sm font-semibold text-ink group-hover:underline">{i.title}</span>
                      <span className="block text-meta text-ink-2">{i.reason}</span>
                    </span>
                    <ChevronRight size={16} className="mt-1 shrink-0 text-ink-3" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {desk.length > 0 && (
          <section className="rounded-card bg-handling-tint p-5">
            <h2 className="flex items-center gap-2 text-subhead text-ink">
              <Headset size={18} className="text-handling" /> SeniorG is handling
            </h2>
            <ul className="mt-2 divide-y divide-handling/15">
              {desk.map((r) => (
                <li key={r.id}>
                  <Link to={`/requests/${r.id}`} className="block py-3 hover:underline">
                    <span className="block text-body-sm font-semibold text-ink">{r.title}</span>
                    <span className="block text-meta text-ink-2">{presentRequest(r, state.providers, state.people, person.id).headline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-card bg-brand-deep p-5 text-white">
          <h2 className="flex items-center gap-2 text-subhead text-white">
            <LifeBuoy size={18} className="text-accent" /> SeniorG help
          </h2>
          <p className="mt-2 text-body-sm text-white/80">Talk to a person, request a call-back, or hand over anything you'd rather not do.</p>
          <p className="mt-1 text-meta text-white/60">Desk hours 8 am – 8 pm (demo)</p>
          <button
            onClick={() => dispatch({ type: "TOGGLE_HELP_SHEET", open: true })}
            className="mt-4 min-h-[44px] w-full rounded-pill bg-white text-body-sm font-semibold text-brand-deep hover:bg-brand-tint"
          >
            Talk to SeniorG
          </button>
        </section>
      </div>
    </aside>
  );
}
