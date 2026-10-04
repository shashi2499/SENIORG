import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, UserCheck, Headset, Info, CheckCircle2, CalendarClock, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ReminderStatusBadge } from "@/components/ui/ReminderStatusBadge";
import { EmptyState } from "@/components/ds/States";
import { RequestCard } from "@/components/record/RequestCard";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { getVisibleReminders } from "@/lib/visibility";
import { assistWithReminder } from "@/lib/reminderActions";
import { daysUntil, demoToday, formatLongDate } from "@/lib/date";

export function ReminderDetail() {
  const { reminderId } = useParams();
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const reminder = reminderId ? state.reminders[reminderId] : undefined;

  if (!reminder) {
    return <EmptyState icon={CalendarClock} title="We can't find that reminder" body="It may have been cleared when the demo was reset." action={{ label: "All dates", onClick: () => navigate("/household/reminders") }} />;
  }
  if (person && !getVisibleReminders(state.reminders, person).some((r) => r.id === reminder.id)) {
    return <EmptyState icon={Lock} title="This reminder isn't available to you" body="It hasn't been shared with you." action={{ label: "Back to home", onClick: () => navigate("/home") }} />;
  }

  const linkedRequest = reminder.linkedRequestId ? state.requests[reminder.linkedRequestId] : undefined;
  const notYetActioned = ["UPCOMING", "DUE_SOON", "EXPLAINED", "SNOOZED", "OVERDUE"].includes(reminder.status);
  const doingItMyself = reminder.status === "IN_PROGRESS_SELF";
  const days = daysUntil(reminder.dueDate);

  // The window this has to happen in, with today marked on it.
  const start = reminder.windowStart ? new Date(reminder.windowStart + "T00:00:00").getTime() : undefined;
  const end = new Date(reminder.dueDate + "T00:00:00").getTime();
  const now = demoToday().getTime();
  const span = start ? end - start : 0;
  const todayPct = start ? Math.min(100, Math.max(0, ((now - start) / span) * 100)) : 0;

  function handleAssist() {
    if (!person) return;
    const request = assistWithReminder(dispatch, reminder!, person);
    navigate(`/requests/${request.id}`);
  }

  return (
    <div className="mx-auto max-w-content space-y-8">
      <header>
        <p className="text-body-sm font-semibold text-brand-dark">{reminder.category.charAt(0) + reminder.category.slice(1).toLowerCase()}</p>
        <h1 className="mt-1 font-serif text-title text-ink sm:text-display">{reminder.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <ReminderStatusBadge reminder={reminder} />
          <span className="text-body-sm text-ink-2">Due {formatLongDate(reminder.dueDate)}</span>
        </div>
      </header>

      {start && reminder.status !== "DONE" && (
        <section className="surface-primary p-5">
          <div className="flex justify-between text-meta text-ink-3">
            <span>Window opens {formatLongDate(reminder.windowStart!)}</span>
            <span>Last day {formatLongDate(reminder.dueDate)}</span>
          </div>
          <div className="relative mt-3 h-3 rounded-pill bg-sand">
            <div className="absolute inset-y-0 left-0 rounded-pill bg-brand-soft" style={{ width: "100%" }} />
            {now >= start ? (
              <motion.div initial={{ width: 0 }} animate={{ width: `${todayPct}%` }} transition={{ duration: 0.6 }} className="absolute inset-y-0 left-0 rounded-pill bg-brand" />
            ) : null}
          </div>
          <p className="mt-3 text-body-sm text-ink-2">
            {now < start ? `The window opens in ${Math.ceil((start - now) / 86400000)} days. You can prepare now.` : days >= 0 ? `${days} days left in the window.` : "The window has closed."}
          </p>
        </section>
      )}

      <section className="rounded-card bg-sand p-6">
        <p className="text-body-sm font-semibold text-brand-dark">Why it matters</p>
        <p className="mt-2 font-serif text-section leading-snug text-ink">{reminder.whyItMatters}</p>
      </section>

      {reminder.whatYouNeed.length > 0 && (
        <section className="surface-primary p-5">
          <h2 className="text-subhead text-ink">What you'll need</h2>
          <ul className="mt-3 space-y-2.5">
            {reminder.whatYouNeed.map((item) => (
              <li key={item} className="flex items-start gap-3 text-body text-ink">
                <Check size={20} className="mt-1 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {linkedRequest && (
        <section>
          <p className="mb-2 text-body-sm font-semibold text-ink-2">SeniorG is helping with this</p>
          <RequestCard request={linkedRequest} />
        </section>
      )}

      {reminder.status === "DONE" && (
        <div className="flex items-center gap-3 rounded-card bg-success-tint p-5 text-success">
          <CheckCircle2 size={24} />
          <p className="font-semibold">Done for this year. Next year's reminder will be created for you.</p>
        </div>
      )}

      {(notYetActioned || doingItMyself) && (
        <section className="space-y-3">
          <h2 className="font-serif text-section text-ink">How would you like to handle it?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {doingItMyself ? (
              <div className="rounded-card border-2 border-brand bg-brand-tint p-5">
                <UserCheck size={24} className="text-brand-dark" />
                <p className="mt-3 font-semibold text-ink">You're doing this yourself</p>
                <p className="mt-1 text-body-sm text-ink-2">Mark it done once it's finished, and we'll stop reminding you.</p>
                <Button className="mt-4" fullWidth onClick={() => dispatch({ type: "SET_REMINDER_STATUS", reminderId: reminder.id, status: "DONE" })}>
                  <Check size={18} /> Mark as done
                </Button>
              </div>
            ) : (
              <button
                onClick={() => dispatch({ type: "SET_REMINDER_STATUS", reminderId: reminder.id, status: "IN_PROGRESS_SELF" })}
                className="flex flex-col rounded-card border border-card-border bg-card p-5 text-left shadow-soft transition hover:shadow-lift"
              >
                <UserCheck size={24} className="text-brand" />
                <span className="mt-3 font-semibold text-ink">I'll do it myself</span>
                <span className="mt-1 text-body-sm text-ink-2">We'll keep the checklist handy and remind you before the last day.</span>
              </button>
            )}
            {!linkedRequest && (
              <button onClick={handleAssist} className="flex flex-col rounded-card bg-brand-deep p-5 text-left text-white shadow-hero transition hover:shadow-lift">
                <Headset size={24} className="text-accent" />
                <span className="mt-3 font-semibold">Help me with this</span>
                <span className="mt-1 text-body-sm text-white/80">The SeniorG desk prepares it with you — a call, a doorstep visit, whatever suits.</span>
              </button>
            )}
          </div>
        </section>
      )}

      <p className="flex items-start gap-2 text-meta text-ink-3">
        <Info size={15} className="mt-0.5 shrink-0" />
        Source: {reminder.rule.source} · Applies to {reminder.rule.appliesTo} · {reminder.rule.year} · Checked {formatLongDate(reminder.rule.verifiedOn)}
      </p>
    </div>
  );
}
