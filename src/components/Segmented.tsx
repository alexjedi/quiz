import { cx } from "./cx";
import { lip, press } from "./press";

export function Segmented<T extends number | string>({
  options,
  value,
  onChange,
  disabled,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cx(
              "h-11 flex-1 rounded-xl border-[3px] border-edge pb-[4px] text-base font-black",
              active ? lip.accent : lip.well,
              !active && disabled && "opacity-50",
              press,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
