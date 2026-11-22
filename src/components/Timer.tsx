import { useEffect, useState } from "react";
import { serverNow } from "../state/room";
import { cx } from "./cx";

const RADIUS = 21;
const LENGTH = 2 * Math.PI * RADIUS;
const TICK_MS = 100;

export function Timer({ endsAt, totalMs, running }: { endsAt: number; totalMs: number; running: boolean }) {
  const [left, setLeft] = useState(() => Math.max(0, endsAt - serverNow()));

  useEffect(() => {
    setLeft(Math.max(0, endsAt - serverNow()));
    if (!running) return;
    const interval = setInterval(() => setLeft(Math.max(0, endsAt - serverNow())), TICK_MS);
    return () => clearInterval(interval);
  }, [endsAt, running]);

  const seconds = Math.ceil(left / 1000);
  const urgent = running && seconds <= 3;
  return (
    <div
      className={cx(
        "relative flex size-16 shrink-0 items-center justify-center rounded-full border-[3px] border-edge bg-well",
        urgent && "animate-pulse-fast",
      )}
      role="timer"
      aria-label={`${seconds} seconds left`}
    >
      <svg viewBox="0 0 50 50" className="absolute inset-0 -rotate-90">
        <circle
          cx="25"
          cy="25"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={LENGTH}
          strokeDashoffset={LENGTH * (1 - Math.min(1, left / totalMs))}
          className={cx("transition-[stroke] duration-300", urgent ? "stroke-bad" : "stroke-accent")}
        />
      </svg>
      <span className={cx("relative text-xl font-black tabular-nums", urgent && "text-bad")}>{seconds}</span>
    </div>
  );
}
