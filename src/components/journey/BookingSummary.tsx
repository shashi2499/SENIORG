interface SummaryRow {
  label: string;
  value: string;
}

interface BookingSummaryProps {
  rows: SummaryRow[];
}

// A plain key-value review list — the "check everything before you
// confirm" screen every journey ends its wizard with.
export function BookingSummary({ rows }: BookingSummaryProps) {
  return (
    <div className="divide-y divide-card-border rounded-card border border-card-border bg-card">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="text-body-sm font-semibold text-ink-2">{row.label}</span>
          <span className="text-right text-body-sm font-medium text-ink">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
