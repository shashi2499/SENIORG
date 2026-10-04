import React from "react";

interface ChoiceGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
}

// Lays out a set of OptionCards. One column for anything with a
// description (symptoms, time slots); two for short labels (dates).
export function ChoiceGrid({ children, columns = 1 }: ChoiceGridProps) {
  return (
    <div className={["grid gap-3", columns === 2 ? "grid-cols-2" : "grid-cols-1"].join(" ")}>{children}</div>
  );
}
