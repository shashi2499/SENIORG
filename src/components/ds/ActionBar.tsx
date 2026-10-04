import React from "react";

// The one primary action of a screen. On phones it rests just above the tab
// bar; on desktop it sits inline at the end of the content.
export function ActionBar({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] z-20 -mx-gutter mt-6 border-t border-line bg-surface/95 px-gutter py-3 backdrop-blur sm:mx-0 sm:rounded-card sm:border sm:px-4 lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
      <div className="flex flex-col gap-2 sm:flex-row">{children}</div>
      {note && <p className="mt-2 text-center text-meta text-ink-3 sm:text-left">{note}</p>}
    </div>
  );
}
