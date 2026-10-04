import { useEffect, useState } from "react";

// Reading comfort is a per-device display preference, like a phone's own
// text size — so it lives in localStorage, not in the shared product state.
export type TextSize = "standard" | "large" | "xlarge";
const KEY = "seniorg-text-size";

function read(): TextSize {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "large" || v === "xlarge" ? v : "standard";
  } catch {
    return "standard";
  }
}

export function applyTextSize(size: TextSize = read()) {
  const root = document.documentElement;
  if (size === "standard") root.removeAttribute("data-text-size");
  else root.setAttribute("data-text-size", size);
}

export function useTextSize(): [TextSize, (s: TextSize) => void] {
  const [size, setSize] = useState<TextSize>(read);
  useEffect(() => {
    applyTextSize(size);
    try {
      window.localStorage.setItem(KEY, size);
    } catch {
      /* private mode: the setting simply won't persist */
    }
  }, [size]);
  return [size, setSize];
}
