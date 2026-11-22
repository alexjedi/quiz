import { memo } from "react";
import { AVATAR_COUNT } from "../game/scoring";
import { cx } from "./cx";

const EYES = [
  <g key="round">
    <circle cx="23" cy="29" r="5.500" fill="white" />
    <circle cx="41" cy="29" r="5.500" fill="white" />
    <circle cx="24" cy="30" r="2.600" />
    <circle cx="42" cy="30" r="2.600" />
  </g>,
  <g key="dots">
    <circle cx="23" cy="30" r="3.200" />
    <circle cx="41" cy="30" r="3.200" />
  </g>,
  <g key="wink" fill="none" strokeWidth="3.200" strokeLinecap="round">
    <path d="M19 31q4-5 8 0" stroke="currentColor" />
    <circle cx="41" cy="30" r="3.200" fill="currentColor" stroke="none" />
  </g>,
];

const MOUTHS = [
  <path key="smile" d="M24 41q8 8 16 0" fill="none" stroke="currentColor" strokeWidth="3.200" strokeLinecap="round" />,
  <path key="open" d="M25 40h14q-1 9-7 9t-7-9z" />,
  <path key="flat" d="M26 43h12" fill="none" stroke="currentColor" strokeWidth="3.200" strokeLinecap="round" />,
  <circle key="oh" cx="32" cy="43" r="3.600" />,
];

const TOPS = [
  null,
  <g key="ears">
    <circle cx="14" cy="14" r="8" />
    <circle cx="50" cy="14" r="8" />
  </g>,
  <g key="antenna">
    <path d="M32 12V3" fill="none" strokeWidth="3.200" strokeLinecap="round" />
    <circle cx="32" cy="3.500" r="3.500" />
  </g>,
  <g key="horns">
    <path d="M14 20L10 4l12 9z" />
    <path d="M50 20l4-16-12 9z" />
  </g>,
];

export const Avatar = memo(function Avatar({
  seed,
  size = 48,
  className,
}: {
  seed: number;
  size?: number;
  className?: string;
}) {
  const index = ((seed % AVATAR_COUNT) + AVATAR_COUNT) % AVATAR_COUNT;
  const hue = index * 30 + 20;
  const body = `oklch(0.8 0.15 ${hue})`;
  const shade = `oklch(0.66 0.15 ${hue})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-2 -2 68 68"
      className={cx("shrink-0 text-edge", className)}
      aria-hidden="true"
    >
      <g fill={body} stroke="currentColor" strokeWidth="3.200" strokeLinejoin="round">
        {TOPS[index % TOPS.length]}
        <circle cx="32" cy="34" r="26" />
      </g>
      <path d="M8 40a26 26 0 0 0 48 0q-24 12-48 0z" fill={shade} />
      <circle cx="32" cy="34" r="26" fill="none" stroke="currentColor" strokeWidth="3.200" />
      <g fill="currentColor">
        {EYES[index % EYES.length]}
        {MOUTHS[(index + Math.floor(index / 3)) % MOUTHS.length]}
      </g>
    </svg>
  );
});
