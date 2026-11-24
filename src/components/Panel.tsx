import type { ReactNode } from "react";
import { cx } from "./cx";

export function Heading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cx(
        "text-center text-xl font-black tracking-wide text-accent uppercase [text-shadow:0_2px_0_var(--color-edge)]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Panel({ title, className, children }: { title?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section
      className={cx(
        "rounded-3xl border-[3px] border-edge bg-panel/85 p-4 shadow-[inset_0_2px_0_rgb(255_255_255/0.14),0_6px_0_rgb(0_0_0/0.18)] sm:p-5",
        className,
      )}
    >
      {title !== undefined && <Heading className="mb-4">{title}</Heading>}
      {children}
    </section>
  );
}
