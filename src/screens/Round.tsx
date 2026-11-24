import { useEffect, useState } from "react";
import { AbilityButton } from "../components/AbilityButton";
import { AnswerCard, type AnswerState } from "../components/AnswerCard";
import { Avatar } from "../components/Avatar";
import { Heading, Panel } from "../components/Panel";
import { Scoreboard } from "../components/Scoreboard";
import { StreakMeter } from "../components/StreakMeter";
import { Timer } from "../components/Timer";
import { cx } from "../components/cx";
import { BoltIcon, ClockIcon, HideIcon, SplitIcon } from "../components/icons";
import type { AbilityId, RoomState } from "../game/protocol";
import { ABILITY_LABELS, REVEAL_MS, milestoneFor } from "../game/scoring";
import { playPrompt } from "../state/audio";
import { send, serverNow } from "../state/room";
import { showToast } from "../state/toast";

const ABILITIES: { id: AbilityId; icon: React.ReactNode }[] = [
  { id: "hide", icon: <HideIcon size={20} /> },
  { id: "fifty", icon: <SplitIcon size={20} /> },
  { id: "time", icon: <ClockIcon size={20} /> },
];

export function Round({ state }: { state: RoomState }) {
  const { question, reveal, self, players } = state;
  const revealing = state.phase === "reveal" && reveal !== null;
  const index = question?.index ?? 0;
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (revealing) return;
    const left = self.deadline - serverNow();
    setExpired(left <= 0);
    if (left <= 0) return;
    const timeout = setTimeout(() => setExpired(true), left);
    return () => clearTimeout(timeout);
  }, [self.deadline, revealing, index]);

  const blitz = question?.blitz ?? false;

  useEffect(() => {
    playPrompt();
    if (blitz && index === 0) showToast("It's a tie! Blitz round");
  }, [index, blitz]);

  useEffect(() => {
    if (revealing && self.earned.length > 0) {
      showToast(`Streak! ${self.earned.map((id) => ABILITY_LABELS[id]).join(" and ")} unlocked`);
    }
  }, [revealing, index]);

  if (!question) return null;

  const me = players.find((player) => player.id === self.id);
  const locked = revealing || expired || self.pick !== null;
  const answered = players.filter((player) => player.answered).length;
  const gain = reveal?.gains[self.id] ?? 0;

  const stateOf = (i: number): AnswerState => {
    if (reveal && revealing) {
      if (i === reveal.correct) return "correct";
      return i === self.pick ? "wrong" : "dim";
    }
    if (self.hidden.includes(i)) return "hidden";
    if (self.pick === i) return "picked";
    return self.pick !== null || expired ? "dim" : "idle";
  };

  let verdict = `${answered}/${players.length} answered`;
  if (revealing) verdict = gain > 0 ? `Correct! +${gain}` : self.pick === null ? "Time's up" : "Wrong";
  else if (self.pick !== null) verdict = "Locked in";
  else if (expired) verdict = "Time's up";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black [text-shadow:0_3px_0_var(--color-edge)]">
            {index + 1}/{question.total}
          </span>
          {blitz && (
            <span className="flex items-center gap-1 rounded-full border-[3px] border-edge bg-gold px-3 py-1 text-sm font-black tracking-wide text-edge uppercase">
              <BoltIcon size={16} />
              Blitz
            </span>
          )}
          <span className="hidden rounded-full border-[3px] border-edge bg-well px-3 py-1 text-sm font-black tracking-wide text-ink-2 uppercase sm:inline">
            {question.pack}
          </span>
        </div>
        <Timer
          endsAt={revealing ? state.phaseEndsAt : self.deadline}
          totalMs={revealing ? REVEAL_MS : self.deadline - question.startedAt}
          running={revealing || !expired}
        />
      </header>
      <Panel key={index} className="flex min-h-32 animate-fade items-center justify-center">
        <p className="text-center text-2xl leading-snug font-black sm:text-3xl">{question.text}</p>
      </Panel>
      <div key={`answers-${index}`} className="grid gap-3 sm:grid-cols-2">
        {question.answers.map((text, i) => (
          <AnswerCard
            key={i}
            index={i}
            text={text}
            state={stateOf(i)}
            disabled={locked || self.hidden.includes(i)}
            pickers={reveal && revealing ? players.filter((player) => reveal.picks[player.id] === i) : []}
            onPick={(pick) => send({ type: "answer", index: pick })}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Heading className={cx("text-left text-lg", revealing && (gain > 0 ? "text-good" : "text-bad"))}>
          {verdict}
        </Heading>
        <div className="flex -space-x-2">
          {players.map((player) => (
            <span key={player.id} className={player.answered ? undefined : "opacity-40"} title={player.name}>
              <Avatar seed={player.avatar} size={34} />
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StreakMeter streak={me?.streak ?? 0} />
        <div className="flex min-w-64 flex-1 gap-2">
          {ABILITIES.map((ability) => (
            <AbilityButton
              key={ability.id}
              icon={ability.icon}
              label={ABILITY_LABELS[ability.id]}
              state={self.abilities[ability.id]}
              streak={milestoneFor(ability.id)}
              disabled={locked}
              onUse={() => send({ type: "ability", ability: ability.id })}
            />
          ))}
        </div>
      </div>
      {reveal && revealing && (
        <Panel title="Scores">
          <Scoreboard players={players} selfId={self.id} gains={reveal.gains} fastestId={reveal.fastestId} />
        </Panel>
      )}
    </div>
  );
}
