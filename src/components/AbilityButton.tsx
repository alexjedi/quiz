import type { ReactNode } from "react";
import type { AbilityState } from "../game/protocol";
import { cx } from "./cx";
import { lip, press } from "./press";

export function AbilityButton({
  icon,
  label,
  state,
  streak,
  disabled,
  onUse,
}: {
  icon: ReactNode;
  label: string;
  state: AbilityState;
  streak: number;
  disabled: boolean;
  onUse: () => void;
}) {
  const ready = state === "ready";
  return (
    <button
      type="button"
      disabled={!ready || disabled}
      onClick={onUse}
      title={ready ? `Use ${label}` : state === "used" ? `${label} used` : `${label}: streak of ${streak}`}
      className={cx(
        "flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border-[3px] border-edge px-2 pb-[5px] text-sm font-black tracking-wide uppercase",
        ready ? cx(lip.accent, !disabled && "animate-float") : cx(lip.well, "text-ink-2"),
        state === "used" && "opacity-40 line-through",
        ready && disabled && "opacity-60",
        press,
      )}
    >
      {icon}
      <span className="truncate">{state === "locked" ? `Streak ${streak}` : label}</span>
    </button>
  );
}
