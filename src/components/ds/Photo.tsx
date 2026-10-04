import { FOCAL, img, type ImageSlot } from "@/lib/imagery";

interface PhotoProps {
  slot: ImageSlot;
  alt?: string; // empty alt = decorative (the default; text beside it says what matters)
  className?: string;
  rounded?: string;
  eager?: boolean;
}

// A bundled photograph, cropped by its focal point. The sand background shows
// while it loads, so layouts never jump.
export function Photo({ slot, alt = "", className = "", rounded = "rounded-card", eager }: PhotoProps) {
  return (
    <div className={["relative overflow-hidden bg-sand", rounded, className].join(" ")}>
      <img
        src={img(slot)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: FOCAL[slot] ?? "50% 50%" }}
      />
    </div>
  );
}
