import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Keeps the five areas feeling like one continuous app rather than five
// separate pages: a short fade/slide on every route change, nothing more —
// calm motion per the design brief (150-200ms, fade/slide only).
//
// Deliberately no AnimatePresence/exit animation here: with mode="wait" an
// interrupted exit can leave the next page's wrapper stuck at opacity 0
// (content present in the DOM, invisible on screen). A simple keyed enter
// animation can't get stuck that way, and that reliability matters more
// here than an exit transition.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
