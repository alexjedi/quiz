import { useCallback, useEffect, useState } from "react";
import { Background, type Tone } from "./components/Background";
import { Button } from "./components/Button";
import { Logo } from "./components/Logo";
import { Panel } from "./components/Panel";
import { Toast } from "./components/Toast";
import { BackIcon } from "./components/icons";
import { isRoomCode } from "./game/scoring";
import { Home } from "./screens/Home";
import { Lobby } from "./screens/Lobby";
import { Results } from "./screens/Results";
import { Round } from "./screens/Round";
import { setMusicLevel, setSfx, unlockAudio } from "./state/audio";
import { getPrefs, rememberRoom, rememberedRoom, usePrefs } from "./state/prefs";
import { joinRoom, leaveRoom, useRoom } from "./state/room";

function codeFromPath(): string | null {
  const match = location.pathname.match(/^\/r\/([A-Za-z]+)\/?$/);
  const code = match?.[1].toUpperCase() ?? "";
  return isRoomCode(code) ? code : null;
}

export function App() {
  const prefs = usePrefs();
  const room = useRoom();
  const [invite, setInvite] = useState(codeFromPath);

  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
  }, [prefs.theme]);

  useEffect(() => setMusicLevel(prefs.music), [prefs.music]);
  useEffect(() => setSfx(prefs.sfx), [prefs.sfx]);

  useEffect(() => {
    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    const code = codeFromPath();
    if (code && rememberedRoom() === code && getPrefs().name) joinRoom(code);
    const onPop = () => {
      const next = codeFromPath();
      setInvite(next);
      if (!next) {
        rememberRoom(null);
        leaveRoom();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("popstate", onPop);
      leaveRoom();
    };
  }, []);

  const enter = useCallback((code: string) => {
    rememberRoom(code);
    if (codeFromPath() !== code) history.pushState(null, "", `/r/${code}`);
    setInvite(code);
    joinRoom(code);
  }, []);

  const leave = useCallback(() => {
    rememberRoom(null);
    leaveRoom();
    history.pushState(null, "", "/");
    setInvite(null);
  }, []);

  const state = room.state;
  let tone: Tone = "base";
  if (state?.phase === "reveal" && state.reveal) {
    tone = state.self.pick === state.reveal.correct ? "good" : "bad";
  }
  const shift = state?.question && state.phase !== "results" ? (state.question.index * 17) % 60 : 0;

  return (
    <div className="relative h-full overflow-x-hidden overflow-y-auto">
      <Background tone={tone} shift={shift} />
      <main className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-8 sm:py-8">
        {state && !room.connected && (
          <div className="animate-pop self-center rounded-full border-[3px] border-edge bg-bad px-4 py-1.5 text-sm font-black uppercase">
            Reconnecting…
          </div>
        )}
        {!state && !room.code && <Home invite={invite} error={room.error} onEnter={enter} onClearInvite={leave} />}
        {!state && room.code && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <Logo />
            <Panel title="Connecting…" className="w-full max-w-sm">
              <Button variant="well" icon={<BackIcon />} onClick={leave} className="w-full">
                Back
              </Button>
            </Panel>
          </div>
        )}
        {state?.phase === "lobby" && <Lobby state={state} onLeave={leave} />}
        {state && (state.phase === "question" || state.phase === "reveal") && <Round state={state} />}
        {state?.phase === "results" && <Results state={state} onLeave={leave} />}
      </main>
      <Toast />
    </div>
  );
}
