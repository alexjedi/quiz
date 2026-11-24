import { cx } from "./cx";

export function Slider({
  value,
  max,
  onChange,
  label,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const steps = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowUp") onChange(Math.min(max, value + 1));
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") onChange(Math.max(0, value - 1));
      }}
      className="flex h-12 items-center gap-1 rounded-2xl border-[3px] border-edge bg-well px-2 shadow-[inset_0_4px_0_rgb(0_0_0/0.22)]"
    >
      {steps.map((step) => (
        <button
          key={step}
          type="button"
          tabIndex={-1}
          aria-label={`${label} ${step}`}
          onClick={() => onChange(step === value ? step - 1 : step)}
          className="group flex h-full flex-1 items-center justify-center"
        >
          <span
            className={cx(
              "block w-full rounded-md border-[2.5px] border-edge group-hover:border-ink",
              step <= value ? "h-7 bg-accent" : "h-4 bg-panel",
            )}
          />
        </button>
      ))}
      <span className="w-8 text-center text-lg font-black tabular-nums">{value}</span>
    </div>
  );
}
