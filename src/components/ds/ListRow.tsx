import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface ListRowProps {
  leading?: React.ReactNode; // icon, avatar, date block or small photo
  title: React.ReactNode;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  to?: string;
  onClick?: () => void;
  chevron?: boolean;
  className?: string;
}

// A quiet row: no box, a hairline between rows. Used wherever a list doesn't
// need the weight of cards.
export function ListRow({ leading, title, meta, trailing, to, onClick, chevron, className = "" }: ListRowProps) {
  const inner = (
    <div className={["flex min-h-[64px] items-center gap-4 py-3", className].join(" ")}>
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex-1">
        <div className="text-body font-semibold text-ink">{title}</div>
        {meta && <div className="mt-0.5 text-body-sm text-ink-2">{meta}</div>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
      {(chevron ?? !!(to || onClick)) && <ChevronRight size={20} className="shrink-0 text-ink-3" aria-hidden="true" />}
    </div>
  );
  const cls = "block rounded-tile px-1 -mx-1 transition duration-calm hover:bg-sand/70";
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (onClick) return <button onClick={onClick} className={cls + " w-full text-left"}>{inner}</button>;
  return inner;
}

export function RowList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={["divide-y divide-line", className].join(" ")}>{children}</div>;
}

export function IconBadge({ icon: Icon, tint = "bg-brand-tint text-brand-dark", size = 44 }: { icon: LucideIcon; tint?: string; size?: number }) {
  return (
    <span className={["flex items-center justify-center rounded-full", tint].join(" ")} style={{ width: size, height: size }}>
      <Icon size={Math.round(size * 0.48)} />
    </span>
  );
}

export function DateBlock({ iso, tone = "default" }: { iso: string; tone?: "default" | "brand" }) {
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso + "T00:00:00" : iso);
  return (
    <span
      className={[
        "flex h-14 w-14 flex-col items-center justify-center rounded-tile leading-none",
        tone === "brand" ? "bg-brand text-white" : "bg-sand text-ink",
      ].join(" ")}
    >
      <span className="text-tag font-semibold uppercase opacity-80">{d.toLocaleDateString("en-IN", { month: "short" })}</span>
      <span className="tabular mt-0.5 font-serif text-section">{d.getDate()}</span>
    </span>
  );
}
