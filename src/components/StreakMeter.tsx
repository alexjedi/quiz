import { MILESTONES } from "../game/scoring";
import { cx } from "./cx";
import { FlameIcon } from "./icons";

const TOP = MILESTONES[MILESTONES.length - 1].streak;
const PIPS = Array.from({ length: TOP }, (_, i) => i + 1);
const MARKS = new Set(MILESTONES.map((m) => m.streak));

export function StreakMeter({ streak }: { streak: number }) {
  return (
    <div
      className="flex h-14 items-center gap-2 rounded-2xl border-[3px] border-edge bg-well px-3"
      title={`Streak: ${streak}`}
    >
      <span className={cx("origin-bottom", streak > 0 ? "animate-flicker text-gold" : "text-ink-2/50")}>
        <FlameIcon size={26} />
      </span>
      <span className="w-6 text-center text-xl font-black tabular-nums">{streak}</span>
      <span className="hidden items-center gap-1 sm:flex">
        {PIPS.map((pip) => (
          <span
            key={pip}
            className={cx(
              "rounded-full border-2 border-edge transition-[background-color,scale] duration-300 ease-spring",
              MARKS.has(pip) ? "size-4" : "size-2.5",
              pip <= streak ? "scale-110 bg-gold" : "bg-panel",
            )}
          />
        ))}
      </span>
    </div>
  );
}
