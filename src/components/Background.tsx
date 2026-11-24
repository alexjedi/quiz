import { memo } from "react";

export type Tone = "base" | "good" | "bad";

const RAY_COUNT = 14;
const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => (i * 360) / RAY_COUNT);
const WEDGE = "M500 500 L420 -400 L580 -400 Z";

export const Background = memo(function Background({ tone, shift }: { tone: Tone; shift: number }) {
  return (
    <div
      className="backdrop pointer-events-none fixed inset-0 overflow-hidden"
      data-tone={tone}
      style={{ "--shift": shift } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="backdrop-fill" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--from)" }} />
            <stop offset="1" style={{ stopColor: "var(--to)" }} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#backdrop-fill)" />
      </svg>
      <svg
        className="absolute top-1/2 left-1/2 h-[170vmax] w-[170vmax] -translate-1/2 opacity-45"
        viewBox="0 0 1000 1000"
      >
        <defs>
          <pattern id="backdrop-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="4.500" style={{ fill: "var(--ray)" }} />
          </pattern>
        </defs>
        {RAYS.map((angle) => (
          <g key={angle} transform={`rotate(${angle} 500 500)`}>
            <path d={WEDGE} style={{ fill: "var(--ray)" }} opacity={0.55} />
            <path d={WEDGE} fill="url(#backdrop-dots)" transform="rotate(6 500 500)" />
          </g>
        ))}
      </svg>
    </div>
  );
});
