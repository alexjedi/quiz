import { cx } from "./cx";
import { press } from "./press";

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex gap-2" role="tablist">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cx(
              "h-12 flex-1 rounded-2xl border-[3px] border-edge px-3 text-base font-black tracking-wide uppercase",
              active
                ? "bg-panel text-accent shadow-[inset_0_2px_0_rgb(255_255_255/0.14)] [text-shadow:0_2px_0_var(--color-edge)]"
                : "bg-well text-ink-2 shadow-[inset_0_-4px_0_var(--color-edge)]",
              press,
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
