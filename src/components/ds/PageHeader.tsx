import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

// Every screen opens by answering "Where am I?" in one calm, consistent way.
export function PageHeader({ eyebrow, title, subtitle, actions, className = "" }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
      className={["flex flex-wrap items-end justify-between gap-4", className].join(" ")}
    >
      <div className="min-w-0 max-w-reading">
        {eyebrow && <p className="mb-1 text-body-sm font-semibold text-brand-dark">{eyebrow}</p>}
        <h1 className="text-balance font-serif text-title text-ink sm:text-display">{title}</h1>
        {subtitle && <p className="mt-2 text-body text-ink-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </motion.header>
  );
}
