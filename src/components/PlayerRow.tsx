import type { ReactNode } from "react";
import type { PlayerView } from "../game/protocol";
import { Avatar } from "./Avatar";
import { cx } from "./cx";
import { CrownIcon } from "./icons";

export function PlayerRow({
  player,
  self,
  index,
  leading,
  trailing,
}: {
  player: PlayerView | null;
  self?: boolean;
  index: number;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  if (!player) {
    return (
      <li className="flex h-14 items-center gap-3 rounded-full border-[3px] border-edge/60 bg-well/50 pr-4 pl-1.5 text-ink-2/50">
        <span className="size-10 rounded-full border-[3px] border-edge/50 bg-panel/60" />
        <span className="text-sm font-black tracking-wide uppercase">Empty</span>
      </li>
    );
  }
  return (
    <li
      className={cx(
        "flex h-14 animate-rise items-center gap-3 rounded-full border-[3px] border-edge pr-4 pl-1.5 transition-[scale,opacity,background-color] duration-200 ease-spring hover:scale-[1.02]",
        self ? "bg-key text-key-ink shadow-[inset_0_-4px_0_var(--color-key-edge)]" : "bg-well text-ink",
        !player.connected && "opacity-50",
      )}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {leading}
      <Avatar seed={player.avatar} size={42} />
      <span className="min-w-0 flex-1 truncate text-lg font-black">{player.name}</span>
      {player.host && (
        <span className="text-gold" title="Host">
          <CrownIcon size={22} />
        </span>
      )}
      {trailing}
    </li>
  );
}
