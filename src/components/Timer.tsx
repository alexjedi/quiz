import { useEffect, useMemo, useState } from "react";
import { serverNow } from "../state/room";
import { cx } from "./cx";

const RADIUS = 21;

const secondsUntil = (endsAt: number) => Math.ceil(Math.max(0, endsAt - serverNow()) / 1000);

export function Timer({ endsAt, totalMs, running }: { endsAt: number; totalMs: number; running: boolean }) {
  const [seconds, setSeconds] = useState(() => secondsUntil(endsAt));

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const left = Math.max(0, endsAt - serverNow());
      setSeconds(Math.ceil(left / 1000));
      if (running && left > 0) timeout = setTimeout(tick, (left % 1000) + 5);
    };
    tick();
    return () => clearTimeout(timeout);
  }, [endsAt, running]);

  const ring = useMemo(() => {
    const left = Math.max(0, endsAt - serverNow());
    return {
      from: 100 * (1 - Math.min(1, left / totalMs)),
      animation: running && left > 0 ? `drain ${left}ms linear forwards` : "none",
    };
  }, [endsAt, totalMs, running]);

  const urgent = running && seconds <= 3;
  return (
    <div
      className="relative flex size-16 shrink-0 items-center justify-center rounded-full border-[3px] border-edge bg-well"
      role="timer"
      aria-label={`${seconds} seconds left`}
    >
      <svg viewBox="0 0 50 50" className="absolute inset-0 -rotate-90">
        <circle
          key={`${endsAt}-${running}`}
          cx="25"
          cy="25"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          style={{ strokeDashoffset: ring.from, animation: ring.animation }}
          className={urgent ? "stroke-bad" : "stroke-accent"}
        />
      </svg>
      <span className={cx("relative text-xl font-black tabular-nums", urgent && "text-bad")}>{seconds}</span>
    </div>
  );
}
