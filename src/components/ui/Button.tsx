import React from "react";

type Variant = "primary" | "secondary" | "text" | "danger" | "quiet" | "onDark" | "needs";
type Size = "lg" | "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition duration-calm ease-calm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

const sizes: Record<Size, string> = {
  lg: "min-h-[56px] px-6 text-label",
  md: "min-h-[48px] px-5 text-body-sm",
  sm: "min-h-[40px] px-4 text-body-sm",
};

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-soft hover:bg-brand-dark",
  secondary: "border border-brand/30 bg-card text-brand-dark hover:border-brand/60 hover:bg-brand-tint",
  quiet: "bg-sand text-ink hover:bg-sand-deep",
  text: "px-2 text-brand-dark underline-offset-4 hover:underline",
  danger: "border border-critical/40 bg-card text-critical hover:bg-critical-tint",
  onDark: "bg-white text-brand-deep hover:bg-brand-tint",
  needs: "bg-accent text-ink shadow-soft hover:brightness-95",
};

export function Button({ variant = "primary", size = "lg", fullWidth, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={[base, variant === "text" ? "min-h-[48px] text-body-sm" : sizes[size], variants[variant], fullWidth ? "w-full" : "", className].join(" ")}
      {...props}
    />
  );
}
