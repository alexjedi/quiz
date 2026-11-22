import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import { lip, press } from "./press";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "key" | "accent" | "well";
  size?: "md" | "lg";
  icon?: ReactNode;
}

export function Button({ variant = "key", size = "md", icon, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex items-center justify-center gap-2.5 rounded-2xl border-[3px] border-edge pb-[5px] font-black tracking-wide uppercase disabled:opacity-50",
        size === "lg" ? "h-16 px-8 text-xl" : "h-12 px-5 text-base",
        lip[variant],
        press,
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
