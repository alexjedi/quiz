import { setPrefs, usePrefs } from "../state/prefs";
import { themes } from "../state/themes";
import { Chip } from "./Chip";
import { Slider } from "./Slider";
import { cx } from "./cx";
import { MuteIcon, SoundIcon } from "./icons";
import { press } from "./press";

export function Label({ children }: { children: string }) {
  return <div className="mb-2 text-sm font-black tracking-wide text-ink-2 uppercase">{children}</div>;
}

export function Prefs() {
  const prefs = usePrefs();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label>Theme</Label>
        <div className="flex gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              aria-label={theme.label}
              aria-pressed={prefs.theme === theme.id}
              title={theme.label}
              onClick={() => setPrefs({ theme: theme.id })}
              style={{ background: theme.swatch }}
              className={cx(
                "size-11 rounded-full border-[3px] shadow-[inset_0_-4px_0_rgb(0_0_0/0.25)]",
                prefs.theme === theme.id ? "scale-110 border-accent" : "border-edge",
                press,
              )}
            />
          ))}
        </div>
      </div>
      <div>
        <Label>Music</Label>
        <div className="flex items-center gap-3">
          <span className="text-ink-2">{prefs.music === 0 ? <MuteIcon size={26} /> : <SoundIcon size={26} />}</span>
          <div className="flex-1">
            <Slider label="Music volume" value={prefs.music} max={10} onChange={(music) => setPrefs({ music })} />
          </div>
        </div>
      </div>
      <Chip active={prefs.sfx} onToggle={() => setPrefs({ sfx: !prefs.sfx })}>
        Sound effects
      </Chip>
    </div>
  );
}
