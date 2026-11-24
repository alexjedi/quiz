import type { PlayerView } from "../game/protocol";
import { PlayerRow } from "./PlayerRow";
import { BoltIcon } from "./icons";

export function Scoreboard({
  players,
  selfId,
  gains,
  fastestId,
}: {
  players: PlayerView[];
  selfId: string;
  gains?: Record<string, number>;
  fastestId?: string | null;
}) {
  const ranked = players.slice().sort((a, b) => b.score - a.score);
  return (
    <ol className="flex flex-col gap-2">
      {ranked.map((player, index) => {
        const gain = gains?.[player.id] ?? 0;
        return (
          <PlayerRow
            key={player.id}
            player={player}
            self={player.id === selfId}
            leading={<span className="w-6 text-center text-lg font-black tabular-nums">{index + 1}</span>}
            trailing={
              <span className="flex items-center gap-2 tabular-nums">
                {player.id === fastestId && (
                  <span className="text-gold" title="Fastest">
                    <BoltIcon size={20} />
                  </span>
                )}
                {gain > 0 && <span className="text-sm font-black text-good-edge">+{gain}</span>}
                <span className="text-lg font-black">{player.score}</span>
              </span>
            }
          />
        );
      })}
    </ol>
  );
}
