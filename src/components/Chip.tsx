import type { ReactNode } from "react";
import { cx } from "./cx";
import { CheckIcon } from "./icons";
import { lip, press } from "./press";

export function Chip({
  active,
  onToggle,
  disabled,
  children,
}: {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      disabled={disabled}
      onClick={onToggle}
      className={cx(
        "flex h-12 items-center gap-2.5 rounded-xl border-[3px] border-edge px-3 pb-[4px] text-left text-base font-extrabold",
        active ? lip.key : lip.well,
        !active && disabled && "opacity-50",
        press,
      )}
    >
      <span
        className={cx(
          "flex size-6 shrink-0 items-center justify-center rounded-md border-[2.5px] border-edge transition-[background-color,scale] duration-200 ease-spring",
          active ? "scale-100 bg-accent text-accent-ink" : "scale-90 bg-well text-transparent",
        )}
      >
        <CheckIcon size={16} />
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}
