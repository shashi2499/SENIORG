import { Camera, Clock, Wrench } from "lucide-react";
import type { RequestProof } from "@/types/entities";
import { formatShortDateTime } from "@/lib/date";

// Proof of work: photos (placeholders — the provider's real photos would sit
// here), notes, time in and out, parts used.
export function CompletionProof({ proof }: { proof: RequestProof }) {
  return (
    <div className="space-y-4">
      {proof.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {proof.photos.map((photo) => (
            <figure key={photo} className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-tile bg-sand text-ink-3">
              <Camera size={24} />
              <figcaption className="text-meta">{photo.replace(/\.\w+$/, "").replace(/^\w/, (c) => c.toUpperCase())} photo</figcaption>
            </figure>
          ))}
        </div>
      )}
      {proof.notes && <p className="text-body text-ink">“{proof.notes}”</p>}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-ink-2">
        {proof.timeIn && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={16} /> In {formatShortDateTime(proof.timeIn)}
          </span>
        )}
        {proof.timeOut && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={16} /> Out {formatShortDateTime(proof.timeOut)}
          </span>
        )}
        {proof.parts && proof.parts.length > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <Wrench size={16} /> {proof.parts.join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}
