import { useStore } from "@/store/StoreContext";
import type { ScopeTag as ScopeTagValue } from "@/types/entities";

const LABEL: Record<ScopeTagValue, string> = {
  CORE: "CORE",
  SHOWCASE: "SHOWCASE",
  FUTURE: "FUTURE",
};

const CLASSES: Record<ScopeTagValue, string> = {
  CORE: "bg-brand-tint text-brand-dark",
  SHOWCASE: "bg-accent-tint text-warning",
  FUTURE: "bg-ink/5 text-ink-2",
};

export function ScopeTag({ tag }: { tag: ScopeTagValue }) {
  const { state } = useStore();
  if (!state.ui.showScopeTags) return null;

  return (
    <span
      className={["inline-block rounded-full px-2 py-0.5 text-xs font-bold tracking-wide", CLASSES[tag]].join(" ")}
      title="Prototype lens: scope tag"
    >
      {LABEL[tag]}
    </span>
  );
}
