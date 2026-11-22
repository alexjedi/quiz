import type { ReactNode } from "react";

interface IconProps {
  size?: number;
  className?: string;
}

function Svg({ size = 22, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 4.500v15l12-7.500z" fill="currentColor" />
    </Svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 14a4.500 4.500 0 0 0 6.400 0l3-3a4.500 4.500 0 0 0-6.400-6.400l-1 1" />
      <path d="M14 10a4.500 4.500 0 0 0-6.400 0l-3 3a4.500 4.500 0 0 0 6.400 6.400l1-1" />
    </Svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3.200" />
      <path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100" />
    </Svg>
  );
}

export function SoundIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9.500h3l5-4v13l-5-4H4z" fill="currentColor" />
      <path d="M16 9a4.500 4.500 0 0 1 0 6M18.800 6.500a8.500 8.500 0 0 1 0 11" />
    </Svg>
  );
}

export function MuteIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9.500h3l5-4v13l-5-4H4z" fill="currentColor" />
      <path d="M16.500 9.500l5 5M21.500 9.500l-5 5" />
    </Svg>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 18h16l1.500-10-5.500 4-4-7-4 7-5.500-4z" fill="currentColor" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.500l4.500 4.500L19 7.500" />
    </Svg>
  );
}

export function CrossIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 2.500c.500 3.500 5.500 5.500 5.500 11a5.500 5.500 0 0 1-11 0c0-2 .800-3.300 1.800-4.500.400 1.500 1.200 2.300 2.200 2.500-.500-3 .300-6.500 1.500-9z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 8.500V13l3 2M9.500 2.500h5" />
    </Svg>
  );
}

export function HideIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 12s3.500-6 9-6 9 6 9 6-3.500 6-9 6-9-6-9-6z" />
      <path d="M4 20L20 4" />
    </Svg>
  );
}

export function SplitIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.500" y="5" width="7" height="14" rx="2" fill="currentColor" />
      <rect x="13.500" y="5" width="7" height="14" rx="2" strokeDasharray="2.500 3" />
    </Svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13.500 2.500L5 13.500h6l-1 8 8.500-11h-6z" fill="currentColor" />
    </Svg>
  );
}

export function ShuffleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12a8 8 0 0 1 14-5.300M20 12a8 8 0 0 1-14 5.300" />
      <path d="M18.500 3v4h-4M5.500 21v-4h4" />
    </Svg>
  );
}
