import { useState } from "react";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { Panel } from "../components/Panel";
import { Prefs } from "../components/Prefs";
import { Tabs } from "../components/Tabs";
import { TextField } from "../components/TextField";
import { BoltIcon, CheckIcon, ClockIcon, HideIcon, PlayIcon, ShuffleIcon, SplitIcon } from "../components/icons";
import { lip, press } from "../components/press";
import {
  AVATAR_COUNT,
  CODE_LENGTH,
  NAME_LIMIT,
  POINTS_CORRECT,
  POINTS_FASTEST,
  isRoomCode,
  milestoneFor,
} from "../game/scoring";
import { setPrefs, usePrefs } from "../state/prefs";
import { newRoomCode } from "../state/room";

const RULES = [
  { icon: <CheckIcon />, text: `${POINTS_CORRECT} points for every right answer` },
  { icon: <BoltIcon />, text: `+${POINTS_FASTEST} for the fastest right answer` },
  { icon: <HideIcon />, text: `Streak of ${milestoneFor("hide")}: hide one wrong answer` },
  { icon: <SplitIcon />, text: `Streak of ${milestoneFor("fifty")}: 50-50` },
  { icon: <ClockIcon />, text: `Streak of ${milestoneFor("time")}: double your time` },
];

const credit =
  "inline-block underline decoration-2 underline-offset-2 transition-[scale,color] duration-150 ease-spring hover:scale-105 hover:text-ink";

type Tab = "rules" | "prefs";

export function Home({
  invite,
  error,
  onEnter,
  onClearInvite,
}: {
  invite: string | null;
  error: string | null;
  onEnter: (code: string) => void;
  onClearInvite: () => void;
}) {
  const prefs = usePrefs();
  const [tab, setTab] = useState<Tab>("rules");
  const [typed, setTyped] = useState("");
  const named = prefs.name.trim().length > 0;
  const target = invite ?? (isRoomCode(typed) ? typed : null);

  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <Logo />
      <div className="grid gap-5 md:grid-cols-[3fr_2fr]">
        <Panel title={invite ? `Join room ${invite}` : "Choose a face and a nickname"}>
          <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (named) onEnter(target ?? newRoomCode());
            }}
          >
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Change face"
                title="Change face"
                onClick={() => setPrefs({ avatar: (prefs.avatar + 1) % AVATAR_COUNT })}
                className={`relative rounded-full ${press}`}
              >
                <span key={prefs.avatar} className="block animate-pop">
                  <Avatar seed={prefs.avatar} size={104} />
                </span>
                <span
                  className={`absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full border-[3px] border-edge ${lip.accent}`}
                >
                  <ShuffleIcon size={18} />
                </span>
              </button>
              <TextField
                value={prefs.name}
                maxLength={NAME_LIMIT}
                placeholder="Nickname"
                aria-label="Nickname"
                autoFocus
                onChange={(event) => setPrefs({ name: event.target.value })}
              />
            </div>
            {error && <p className="animate-shake text-center text-base font-black text-bad">{error}</p>}
            <Button type="submit" variant="accent" size="lg" icon={<PlayIcon size={26} />} disabled={!named}>
              {target ? "Join room" : "Create room"}
            </Button>
            {invite ? (
              <Button variant="well" onClick={onClearInvite}>
                Create my own room
              </Button>
            ) : (
              <TextField
                value={typed}
                maxLength={CODE_LENGTH}
                placeholder="Have a room code?"
                aria-label="Room code"
                className="h-12 text-center text-base tracking-widest uppercase"
                onChange={(event) => setTyped(event.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
              />
            )}
          </form>
        </Panel>
        <div className="flex flex-col gap-3">
          <Tabs
            items={[
              { id: "rules", label: "How to play" },
              { id: "prefs", label: "Settings" },
            ]}
            value={tab}
            onChange={setTab}
          />
          <Panel key={tab} className="flex-1">
            {tab === "prefs" ? (
              <Prefs />
            ) : (
              <ul className="flex flex-col gap-3">
                {RULES.map((rule, index) => (
                  <li
                    key={rule.text}
                    className="flex animate-rise items-center gap-3 text-base font-extrabold"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-edge bg-well text-accent">
                      {rule.icon}
                    </span>
                    {rule.text}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
      <p className="text-center text-sm font-extrabold text-ink-2">
        <a href="https://alexvoid.com/" className={credit}>
          Made by Alex Void
        </a>
        {" · Questions from the "}
        <a href="https://opentdb.com/" target="_blank" rel="noreferrer" className={credit}>
          Open Trivia Database
        </a>
        {" ("}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className={credit}>
          CC BY-SA 4.0
        </a>
        {")"}
      </p>
    </div>
  );
}
