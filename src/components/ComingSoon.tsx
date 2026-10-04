import { Compass } from "lucide-react";
import { EmptyState } from "./ds/States";
import { useStore } from "@/store/StoreContext";

// A calm "not here" state that always leaves a way forward: the desk.
export function ComingSoon({ title, note }: { title: string; note?: string }) {
  const { dispatch } = useStore();
  return (
    <EmptyState
      icon={Compass}
      title={title}
      body={note}
      action={{ label: "Ask the SeniorG desk", onClick: () => dispatch({ type: "TOGGLE_HELP_SHEET", open: true }) }}
    />
  );
}
