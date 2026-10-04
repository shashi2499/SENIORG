import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export type SurfaceLevel = "primary" | "secondary" | "quiet" | "hero";

interface CardProps extends HTMLMotionProps<"div"> {
  as?: "div" | "section";
  interactive?: boolean;
  level?: SurfaceLevel;
  padded?: boolean;
}

const LEVEL: Record<SurfaceLevel, string> = {
  primary: "surface-primary",
  secondary: "surface-secondary",
  quiet: "",
  hero: "surface-hero",
};

// The one surface primitive. Default is a primary card; pass `level` to step
// down to a sand "secondary" panel or an unboxed "quiet" block.
export function Card({ className = "", interactive, level = "primary", padded = true, children, ...props }: CardProps) {
  return (
    <motion.div
      className={[
        LEVEL[level],
        padded && level !== "quiet" ? "p-5" : "",
        interactive ? "cursor-pointer transition duration-calm ease-calm hover:-translate-y-px hover:shadow-lift" : "",
        className,
      ].join(" ")}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.12 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
