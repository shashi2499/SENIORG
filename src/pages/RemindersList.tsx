import { motion } from "framer-motion";
import { PageHeader } from "@/components/ds/PageHeader";
import { SectionHeader } from "@/components/ds/SectionHeader";
import { ListRow, RowList, DateBlock } from "@/components/ds/ListRow";
import { ReminderStatusBadge } from "@/components/ui/ReminderStatusBadge";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import { getVisibleReminders } from "@/lib/visibility";
import { formatShortDateTime } from "@/lib/date";
import { reminderSection, type ReminderSection } from "@/lib/reminderUrgency";
import type { Reminder } from "@/types/entities";

const SECTION_ORDER: { id: ReminderSection; title: string; subtitle?: string }[] = [
  { id: "attention", title: "Needs your attention", subtitle: "Due soon or overdue. SeniorG can help with any of these." },
  { id: "inProgress", title: "In progress" },
  { id: "upcoming", title: "Coming up" },
  { id: "completed", title: "Done" },
];

export function RemindersList() {
  const { state } = useStore();
  const person = useCurrentPerson();
  const reminders = (person ? getVisibleReminders(state.reminders, person) : []).sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  const grouped: Record<ReminderSection, Reminder[]> = { attention: [], inProgress: [], upcoming: [], completed: [] };
  reminders.forEach((r) => grouped[reminderSection(r)].push(r));

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Household"
        title="Dates & renewals"
        subtitle="SeniorG reminds you from what you've told us — it never reads your SMS, email or bank account."
      />
      {SECTION_ORDER.map(({ id, title, subtitle }, i) => {
        const items = grouped[id];
        if (items.length === 0) return null;
        return (
          <motion.section key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
            <SectionHeader title={title} subtitle={subtitle} />
            <div className={["px-5", id === "attention" ? "rounded-card border-2 border-needs-ring/60 bg-card shadow-soft" : id === "completed" ? "surface-secondary" : "surface-primary"].join(" ")}>
              <RowList>
                {items.map((r) => (
                  <ListRow
                    key={r.id}
                    to={`/household/reminders/${r.id}`}
                    leading={<DateBlock iso={r.dueDate} />}
                    title={r.title}
                    meta={
                      <span className="mt-1 flex flex-wrap items-center gap-2">
                        <ReminderStatusBadge reminder={r} />
                        <span className="text-meta text-ink-3">
                          Due {formatShortDateTime(r.dueDate)}
                          {person && r.ownerId !== person.id ? ` · ${state.people[r.ownerId]?.name.split(" ")[0]}'s, shared with you` : ""}
                        </span>
                      </span>
                    }
                  />
                ))}
              </RowList>
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
