import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";
import { lip, press } from "./press";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "key" | "well";
}

export function IconButton({ label, variant = "well", className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-edge pb-[4px]",
        lip[variant],
        press,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
