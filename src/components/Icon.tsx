import type { SVGProps } from 'react';

export type IconName =
  | 'close' | 'sound' | 'soundOff' | 'star' | 'check' | 'lock' | 'arrowNext' | 'arrowBack'
  | 'menu' | 'replay' | 'house' | 'door' | 'wave' | 'book' | 'pen' | 'grid' | 'user' | 'bulb' | 'play';

const PATHS: Record<IconName, JSX.Element> = {
  close: <path d="M6 6l12 12M18 6L6 18" />,
  sound: (<><path d="M11 5L6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></>),
  soundOff: (<><path d="M11 5L6 9H2v6h4l5 4z" /><path d="M16 9l6 6M22 9l-6 6" /></>),
  star: <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 6.9L12 17.6 5.7 21l1.5-6.9L2 9.3l7-.8z" fill="currentColor" stroke="none" />,
  check: <path d="M20 6L9 17l-5-5" />,
  lock: (<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  /* In RTL "next" points left */
  arrowNext: <path d="M15 18l-6-6 6-6" />,
  arrowBack: <path d="M9 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  replay: (<><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>),
  house: (<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>),
  door: (<><path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17" /><path d="M3 21h18" /><circle cx="15" cy="12" r="1" fill="currentColor" /></>),
  wave: (<><path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /><path d="M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /><path d="M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /></>),
  book: (<><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" /><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" /></>),
  pen: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>),
  grid: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  bulb: <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />,
  play: (<><circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="currentColor" /></>),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

/** Stroke icons, 2px, rounded — see the design system's iconography rules. Decorative by default. */
export function Icon({ name, size = 24, strokeWidth = 2, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
