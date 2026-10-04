interface LineItem {
  label: string;
  amount: number | string;
  emphasis?: boolean;
}

interface PriceBreakdownProps {
  items: LineItem[];
  total?: number;
  note?: string;
}

// Used in the booking review screen and again in the final receipt —
// same visual treatment, different line items.
export function PriceBreakdown({ items, total, note }: PriceBreakdownProps) {
  return (
    <div className="space-y-2 rounded-card bg-ink/5 p-4">
      <p className="text-body-sm font-semibold text-ink-2">Illustrative demo price</p>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between text-body-sm">
          <span className={item.emphasis ? "font-semibold text-ink" : "text-ink-2"}>{item.label}</span>
          <span className={item.emphasis ? "font-semibold text-ink" : "text-ink"}>
            {typeof item.amount === "number" ? `₹${item.amount}` : item.amount}
          </span>
        </div>
      ))}
      {total !== undefined && (
        <div className="flex items-center justify-between border-t border-card-border pt-2 text-body-sm font-bold text-ink">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      )}
      {note && <p className="pt-1 text-meta text-ink-2">{note}</p>}
    </div>
  );
}
