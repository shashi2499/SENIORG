import type { Config } from "tailwindcss";

// SeniorG design foundation.
// Refines the approved identity (ivory · ink · deep green · marigold · Noto) into
// a fuller system: surface levels, state colours with meaning, a real type
// scale in rem (so the Standard / Large / Extra-large text setting reflows
// layouts instead of truncating them), and calm motion tokens.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1C2033", // primary text, 14.9:1 on ivory
          2: "#474C63", // secondary text, 8:1
          3: "#666A7E", // meta text, 5:1 (never smaller than 15px)
        },
        // Surfaces: ivory page, warm sand for quiet sections, white for primary cards.
        surface: "#FAF6EF",
        sand: { DEFAULT: "#F2ECE1", deep: "#E8DFD0" },
        card: { DEFAULT: "#FFFFFF", border: "#E6DED0" },
        line: "#E6DED0",
        brand: {
          DEFAULT: "#0F5C55",
          dark: "#0C4A44",
          deep: "#0A3A35", // hero surfaces
          soft: "#CFE2DD",
          tint: "#E4EFEC",
        },
        accent: {
          DEFAULT: "#D8901C", // marigold: fills with ink text, never as text on white
          deep: "#9A5F05", // marigold that can carry text (4.9:1)
          tint: "#FBEFDA",
        },
        // State colours carry meaning, always with an icon and words.
        needs: { DEFAULT: "#9A5F05", tint: "#FBEFDA", ring: "#E9B65C" }, // needs you
        handling: { DEFAULT: "#33507F", tint: "#E7EDF6" }, // SeniorG desk has it
        success: { DEFAULT: "#2E7D4F", tint: "#E4F2E9" },
        warning: "#B26A00",
        critical: { DEFAULT: "#B3261E", tint: "#FBE9E7" },
        infotint: "#E7EDF6",
        clay: { DEFAULT: "#AD5A34", tint: "#F4E4D9" },
        indigo: { DEFAULT: "#4A4F8A", tint: "#E9EAF5" },
        plum: { DEFAULT: "#7A4668", tint: "#F1E5ED" },
      },
      fontFamily: {
        sans: ["Noto Sans", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Noto Serif Display", "Noto Serif", "Georgia", "serif"],
      },
      fontSize: {
        // rem-based so the reading-comfort setting scales everything together.
        display: ["2.25rem", { lineHeight: "2.625rem", letterSpacing: "-0.01em" }], // 36/42
        title: ["1.75rem", { lineHeight: "2.125rem", letterSpacing: "-0.005em" }], // 28/34
        section: ["1.375rem", { lineHeight: "1.75rem" }], // 22/28
        subhead: ["1.125rem", { lineHeight: "1.625rem", fontWeight: "600" }], // 18/26
        body: ["1.125rem", "1.75rem"], // 18/28
        "body-sm": ["1rem", "1.5rem"], // 16/24 — the floor for reading text
        meta: ["0.9375rem", "1.375rem"], // 15/22 — dates, sources
        label: ["1.125rem", "1.5rem"], // buttons
        tag: ["0.875rem", "1.25rem"], // pills and tags only
        big: ["1.75rem", { lineHeight: "2.125rem", fontWeight: "600" }], // prices, times
        xs: ["0.875rem", "1.25rem"], // legacy alias: never below 14px
      },
      borderRadius: {
        card: "1.25rem",
        tile: "1rem",
        pill: "999px",
      },
      maxWidth: {
        content: "45rem",
        page: "70rem",
        reading: "40rem",
      },
      spacing: {
        gutter: "1.25rem",
        "safe-b": "env(safe-area-inset-bottom)",
      },
      transitionDuration: {
        calm: "180ms",
        settle: "260ms",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.2, 0, 0, 1)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28, 32, 51, 0.04), 0 4px 16px -6px rgba(28, 32, 51, 0.10)",
        lift: "0 2px 4px rgba(28, 32, 51, 0.05), 0 12px 32px -12px rgba(28, 32, 51, 0.22)",
        hero: "0 18px 40px -18px rgba(10, 58, 53, 0.55)",
        bar: "0 -6px 24px -12px rgba(28, 32, 51, 0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
