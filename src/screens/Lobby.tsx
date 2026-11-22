import { useState } from "react";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { Logo } from "../components/Logo";
import { Heading, Panel } from "../components/Panel";
import { PlayerRow } from "../components/PlayerRow";
import { Label, Prefs } from "../components/Prefs";
import { Segmented } from "../components/Segmented";
import { Tabs } from "../components/Tabs";
import { BackIcon, LinkIcon, PlayIcon } from "../components/icons";
import type { RoomState, Settings } from "../game/protocol";
import { COUNT_OPTIONS, MAX_PLAYERS, ROUND_OPTIONS } from "../game/scoring";
import { send } from "../state/room";
import { showToast } from "../state/toast";

type Tab = "game" | "prefs";

const ROUND_CHOICES = ROUND_OPTIONS.map((value) => ({ value, label: `${value}s` }));
const COUNT_CHOICES = COUNT_OPTIONS.map((value) => ({ value, label: String(value) }));
const SLOTS = Array.from({ length: MAX_PLAYERS }, (_, i) => i);

async function invite(code: string): Promise<void> {
  const url = `${location.origin}/r/${code}`;
  try {
    await navigator.clipboard.writeText(url);
    showToast("Invite link copied");
  } catch {
    showToast(url);
  }
}

export function Lobby({ state, onLeave }: { state: RoomState; onLeave: () => void }) {
  const [tab, setTab] = useState<Tab>("game");
  const { settings, players, self, packs } = state;
  const host = players.some((player) => player.id === self.id && player.host);
  const available = packs
    .filter((pack) => settings.packIds.includes(pack.id))
    .reduce((sum, pack) => sum + pack.count, 0);
  const change = (patch: Partial<Settings>) => send({ type: "settings", settings: { ...settings, ...patch } });
  const togglePack = (id: string) => {
    const packIds = settings.packIds.includes(id)
      ? settings.packIds.filter((other) => other !== id)
      : [...settings.packIds, id];
    if (packIds.length > 0) change({ packIds });
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <header className="flex items-center justify-between gap-3">
        <Button variant="well" icon={<BackIcon />} onClick={onLeave}>
          Back
        </Button>
        <Logo small />
        <div className="rounded-2xl border-[3px] border-edge bg-well px-3 py-1.5 text-center leading-tight">
          <div className="text-[11px] font-black tracking-wide text-ink-2 uppercase">Room</div>
          <div className="text-lg font-black tracking-widest">{state.code}</div>
        </div>
      </header>
      <div className="grid flex-1 gap-5 md:grid-cols-[2fr_3fr]">
        <Panel title={`Players ${players.length}/${MAX_PLAYERS}`}>
          <ul className="flex flex-col gap-2">
            {SLOTS.slice(0, Math.max(6, players.length + 1)).map((slot) => (
              <PlayerRow
                key={players[slot]?.id ?? slot}
                player={players[slot] ?? null}
                self={players[slot]?.id === self.id}
                index={slot}
              />
            ))}
          </ul>
        </Panel>
        <div className="flex flex-col gap-3">
          <Tabs
            items={[
              { id: "game", label: "Game" },
              { id: "prefs", label: "My settings" },
            ]}
            value={tab}
            onChange={setTab}
          />
          <Panel key={tab} className="flex-1">
            {tab === "prefs" ? (
              <Prefs />
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <Label>Time per question</Label>
                  <Segmented
                    label="Time per question"
                    options={ROUND_CHOICES}
                    value={settings.roundSeconds}
                    disabled={!host}
                    onChange={(roundSeconds) => change({ roundSeconds })}
                  />
                </div>
                <div>
                  <Label>Questions</Label>
                  <Segmented
                    label="Number of questions"
                    options={COUNT_CHOICES}
                    value={settings.questionCount}
                    disabled={!host}
                    onChange={(questionCount) => change({ questionCount })}
                  />
                  {available < settings.questionCount && (
                    <p className="mt-2 text-sm font-extrabold text-ink-2">
                      The chosen packs have {available} questions, so the game will be {available} long.
                    </p>
                  )}
                </div>
                <div>
                  <Label>Question packs</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {packs.map((pack) => (
                      <Chip
                        key={pack.id}
                        active={settings.packIds.includes(pack.id)}
                        disabled={!host}
                        onToggle={() => togglePack(pack.id)}
                      >
                        {pack.title}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Panel>
          <div className="flex gap-3">
            <Button icon={<LinkIcon />} onClick={() => invite(state.code)} className="flex-1">
              Invite
            </Button>
            {host ? (
              <Button variant="accent" icon={<PlayIcon />} onClick={() => send({ type: "start" })} className="flex-1">
                Start
              </Button>
            ) : (
              <Heading className="flex flex-1 items-center justify-center text-base">Waiting for the host</Heading>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
