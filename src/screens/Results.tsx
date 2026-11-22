import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { Heading, Panel } from "../components/Panel";
import { Scoreboard } from "../components/Scoreboard";
import { BackIcon, CrownIcon, PlayIcon } from "../components/icons";
import type { RoomState } from "../game/protocol";
import { send } from "../state/room";

export function Results({ state, onLeave }: { state: RoomState; onLeave: () => void }) {
  const { players, self } = state;
  const host = players.some((player) => player.id === self.id && player.host);
  const top = Math.max(...players.map((player) => player.score));
  const winners = players.filter((player) => player.score === top);
  const names = winners.map((player) => player.name);
  const title =
    winners.length === 1
      ? `${names[0]} wins!`
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} share the win!`;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5">
      <Logo small />
      <Panel>
        <div className="mb-5 flex flex-col items-center gap-2">
          <span className="animate-float text-gold">
            <CrownIcon size={44} />
          </span>
          <span className="flex animate-bounce-in -space-x-4">
            {winners.map((winner) => (
              <Avatar key={winner.id} seed={winner.avatar} size={96} />
            ))}
          </span>
          <Heading className="text-2xl">{title}</Heading>
        </div>
        <Scoreboard players={players} selfId={self.id} />
      </Panel>
      <div className="flex gap-3">
        <Button variant="well" icon={<BackIcon />} onClick={onLeave}>
          Leave
        </Button>
        {host ? (
          <>
            <Button onClick={() => send({ type: "lobby" })} className="flex-1">
              Lobby
            </Button>
            <Button variant="accent" icon={<PlayIcon />} onClick={() => send({ type: "start" })} className="flex-1">
              Play again
            </Button>
          </>
        ) : (
          <Heading className="flex flex-1 items-center justify-center text-base">Waiting for the host</Heading>
        )}
      </div>
    </div>
  );
}
