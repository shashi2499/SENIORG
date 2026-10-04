import { BellOff } from "lucide-react";
import { Sheet } from "./ui/Sheet";
import { Button } from "./ui/Button";
import { useStore } from "@/store/StoreContext";

export function NotificationsPanel() {
  const { state, dispatch } = useStore();
  const open = state.ui.notificationsOpen;
  const mine = state.notifications.filter((n) => n.recipientId === state.currentRoleId);

  return (
    <Sheet open={open} onClose={() => dispatch({ type: "TOGGLE_NOTIFICATIONS", open: false })} title="Notifications">
      {mine.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <BellOff size={32} className="text-ink-2" />
          <p className="text-body-sm text-ink-2">
            Nothing yet. You'll see status changes, approvals and reminders here as they happen.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {mine.map((n) => (
            <li key={n.id} className={["flex gap-3 rounded-tile p-4 text-body-sm", n.read ? "bg-surface" : "bg-brand-tint"].join(" ")}>
              <span className={["mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-ink/15" : "bg-accent"].join(" ")} />
              <span className="min-w-0">
                <p className={n.read ? "text-ink-2" : "font-semibold text-ink"}>{n.text}</p>
                <p className="text-meta text-ink-3">{new Date(n.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</p>
              </span>
            </li>
          ))}
        </ul>
      )}
      {mine.some((n) => !n.read) && (
        <Button variant="text" onClick={() => dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" })} className="mt-4">
          Mark all as read
        </Button>
      )}
    </Sheet>
  );
}
