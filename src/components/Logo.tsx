import { cx } from "./cx";

const LETTERS = [
  { char: "Q", tilt: "-rotate-6", delay: 0 },
  { char: "U", tilt: "rotate-3", delay: 0.3 },
  { char: "I", tilt: "-rotate-3", delay: 0.6 },
  { char: "Z", tilt: "rotate-6", delay: 0.9 },
];

export function Logo({ small }: { small?: boolean }) {
  return (
    <h1 className="flex items-center justify-center gap-1.5" aria-label="Quiz">
      {LETTERS.map((letter) => (
        <span key={letter.char} className="animate-float" style={{ animationDelay: `${letter.delay}s` }}>
          <span
            className={cx(
              "flex items-center justify-center rounded-2xl border-[3px] border-edge bg-key pb-[6px] font-black text-key-ink shadow-[inset_0_-6px_0_var(--color-key-edge),0_5px_0_rgb(0_0_0/0.2)] transition-[scale,rotate] duration-200 ease-spring hover:scale-110 hover:rotate-0",
              small ? "size-11 text-2xl" : "size-16 text-4xl sm:size-20 sm:text-5xl",
              letter.tilt,
            )}
          >
            {letter.char}
          </span>
        </span>
      ))}
    </h1>
  );
}
