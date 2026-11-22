import type { InputHTMLAttributes } from "react";
import { cx } from "./cx";

export function TextField({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      autoComplete="off"
      spellCheck={false}
      className={cx(
        "h-14 w-full min-w-0 rounded-2xl border-[3px] border-edge bg-well px-4 text-xl font-extrabold text-ink shadow-[inset_0_4px_0_rgb(0_0_0/0.22)] transition-[scale,background-color] duration-150 ease-spring placeholder:text-ink-2/60 focus:scale-[1.02] focus:outline-none focus-visible:border-accent",
        className,
      )}
      {...rest}
    />
  );
}
