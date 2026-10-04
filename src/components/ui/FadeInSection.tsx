import React from "react";
import { motion } from "framer-motion";

// Shared entrance rhythm for dashboard-style pages (Home, Services,
// Household) — calm motion per the design brief, staggered by `delay`.
export function FadeInSection({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
