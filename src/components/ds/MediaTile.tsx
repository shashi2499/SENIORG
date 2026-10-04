import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Photo } from "./Photo";
import type { ImageSlot } from "@/lib/imagery";

interface MediaTileProps {
  slot: ImageSlot;
  to: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  badge?: React.ReactNode; // overlaid top-left on the image
  footer?: React.ReactNode;
  ratio?: "wide" | "square" | "tall";
  overlay?: boolean; // text on the photo (editorial hero tiles)
  compact?: boolean; // smaller overlay type for dense grids
  className?: string;
}

const RATIO = { wide: "aspect-[16/10]", square: "aspect-square", tall: "aspect-[4/5]" };

// Image-led tile for discovery: events, Smart Minutes, services.
export function MediaTile({ slot, to, eyebrow, title, meta, badge, footer, ratio = "wide", overlay, compact, className = "" }: MediaTileProps) {
  if (overlay) {
    return (
      <motion.div whileTap={{ scale: 0.985 }} className={className}>
        <Link to={to} className="group relative block overflow-hidden rounded-card shadow-soft">
          <Photo slot={slot} className={[RATIO[ratio], "transition duration-settle group-hover:scale-[1.02]"].join(" ")} rounded="rounded-card" />
          <div className="scrim-bottom absolute inset-0" />
          {badge && <div className="absolute left-3 top-3">{badge}</div>}
          <div className={["absolute inset-x-0 bottom-0 text-white", compact ? "p-3.5" : "p-4 sm:p-5"].join(" ")}>
            {eyebrow && <p className="text-body-sm font-semibold text-white/85">{eyebrow}</p>}
            <p className={["mt-0.5 font-serif leading-tight text-white", compact ? "text-subhead" : "text-section"].join(" ")}>{title}</p>
            {meta && <p className={["mt-1 text-white/85", compact ? "text-meta" : "text-body-sm"].join(" ")}>{meta}</p>}
          </div>
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.div whileTap={{ scale: 0.985 }} className={["h-full", className].join(" ")}>
      <Link to={to} className="group flex h-full flex-col overflow-hidden rounded-card border border-card-border bg-card shadow-soft transition duration-calm hover:shadow-lift">
        <div className="relative">
          <Photo slot={slot} className={RATIO[ratio]} rounded="rounded-none" />
          {badge && <div className="absolute left-3 top-3">{badge}</div>}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {eyebrow && <p className="text-meta font-semibold text-ink-3">{eyebrow}</p>}
          <p className="text-body font-semibold leading-snug text-ink">{title}</p>
          {meta && <div className="text-body-sm text-ink-2">{meta}</div>}
          {footer && <div className="mt-auto pt-2">{footer}</div>}
        </div>
      </Link>
    </motion.div>
  );
}
