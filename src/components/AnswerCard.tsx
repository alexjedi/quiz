import type { PlayerView } from "../game/protocol";
import { Avatar } from "./Avatar";
import { cx } from "./cx";
import { CheckIcon, CrossIcon } from "./icons";
import { lip, press } from "./press";

export type AnswerState = "idle" | "picked" | "hidden" | "dim" | "correct" | "wrong";

const LABELS = ["A", "B", "C", "D"];

const looks: Record<AnswerState, string> = {
  idle: lip.key,
  picked: lip.accent,
  hidden: cx(lip.well, "opacity-30 line-through"),
  dim: cx(lip.key, "opacity-55"),
  correct: lip.good,
  wrong: lip.bad,
};

export function AnswerCard({
  index,
  text,
  state,
  disabled,
  pickers,
  onPick,
}: {
  index: number;
  text: string;
  state: AnswerState;
  disabled: boolean;
  pickers: PlayerView[];
  onPick: (index: number) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPick(index)}
      className={cx(
        "relative flex min-h-20 w-full items-center gap-3 rounded-2xl border-[3px] border-edge px-3 pt-2 pb-[11px] text-left text-lg leading-tight font-extrabold sm:min-h-24 sm:text-xl",
        looks[state],
        press,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-edge bg-well text-lg font-black text-ink">
        {state === "correct" ? <CheckIcon size={20} /> : state === "wrong" ? <CrossIcon size={20} /> : LABELS[index]}
      </span>
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{text}</span>
      {pickers.length > 0 && (
        <span className="absolute -top-3 right-2 flex -space-x-2">
          {pickers.map((player) => (
            <Avatar key={player.id} seed={player.avatar} size={30} />
          ))}
        </span>
      )}
    </button>
  );
}
