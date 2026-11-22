export const press =
  "select-none transition-[scale,translate,box-shadow,background-color,opacity,filter] duration-150 ease-spring hover:scale-[1.03] active:scale-[0.96] active:translate-y-[3px] disabled:pointer-events-none";

export const lip = {
  key: "bg-key text-key-ink shadow-[inset_0_-5px_0_var(--color-key-edge)] active:shadow-[inset_0_-1px_0_var(--color-key-edge)]",
  accent:
    "bg-accent text-accent-ink shadow-[inset_0_-5px_0_var(--color-accent-edge)] active:shadow-[inset_0_-1px_0_var(--color-accent-edge)]",
  good: "bg-good text-accent-ink shadow-[inset_0_-5px_0_var(--color-good-edge)]",
  bad: "bg-bad text-ink shadow-[inset_0_-5px_0_var(--color-bad-edge)]",
  well: "bg-well text-ink shadow-[inset_0_-4px_0_var(--color-edge)] active:shadow-[inset_0_-1px_0_var(--color-edge)]",
};
