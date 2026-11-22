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
  const winner = players.reduce((best, player) => (player.score > best.score ? player : best), players[0]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5">
      <Logo small />
      <Panel>
        <div className="mb-5 flex flex-col items-center gap-2">
          <span className="animate-float text-gold">
            <CrownIcon size={44} />
          </span>
          <span className="animate-bounce-in">
            <Avatar seed={winner.avatar} size={96} />
          </span>
          <Heading className="text-2xl">{winner.name} wins!</Heading>
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
