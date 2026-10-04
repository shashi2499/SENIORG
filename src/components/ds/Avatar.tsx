// Fictional providers and family members never get a borrowed face: an
// initials avatar in a warm tint, with an optional verified ring.
const TINTS = [
  "bg-brand-tint text-brand-dark",
  "bg-accent-tint text-needs",
  "bg-plum-tint text-plum",
  "bg-indigo-tint text-indigo",
  "bg-clay-tint text-clay",
];

function tintFor(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TINTS[h % TINTS.length];
}

export function Avatar({ initials, seed, size = 48, ring }: { initials: string; seed?: string; size?: number; ring?: boolean }) {
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        tintFor(seed ?? initials),
        ring ? "ring-2 ring-success ring-offset-2 ring-offset-card" : "",
      ].join(" ")}
      style={{ width: size, height: size, fontSize: Math.max(14, Math.round(size * 0.36)) }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
