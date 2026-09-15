/**
 * Single inline-SVG icon set — no icon library dependency.
 * Stroke-based, 1.7px, 24px grid, currentColor.
 */
const P = {
  overview: <><path d="M4 13h6V4H4v9Z" /><path d="M14 20h6v-9h-6v9Z" /><path d="M14 7h6V4h-6v3Z" /><path d="M4 20h6v-3H4v3Z" /></>,
  chart: <><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>,
  document: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h4" /></>,
  request: <><path d="M15 4h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="9" y="2" width="6" height="4" rx="1" /><path d="m9 13 2 2 4-4" /></>,
  activity: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  message: <><path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9Z" /></>,
  team: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" /><circle cx="9.5" cy="7" r="3.2" /><path d="M21 20v-1.5a4 4 0 0 0-3-3.87" /><path d="M16.5 4.2a3.2 3.2 0 0 1 0 5.6" /></>,
  bell: <><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" /><path d="M13.7 20a2 2 0 0 1-3.4 0" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12.2 2.4 2.4 4.6-4.9" /></>,
  alert: <><path d="M12 3.6 2.6 19.2a1.2 1.2 0 0 0 1 1.8h16.8a1.2 1.2 0 0 0 1-1.8L12 3.6Z" /><path d="M12 10v4" /><path d="M12 17.2h.01" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M10.6 6.1A8.9 8.9 0 0 1 12 6c6 0 9.5 6 9.5 6a16.4 16.4 0 0 1-3 3.7" /><path d="M6.4 7.3A16.2 16.2 0 0 0 2.5 12S6 18 12 18a9.3 9.3 0 0 0 4-.9" /><path d="m3 3 18 18" /><path d="M9.9 10a3 3 0 0 0 4.2 4.2" /></>,
  lock: <><rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7.4a4 4 0 0 1 8 0v3.1" /></>,
  shield: <><path d="M12 3 5 6v5.6c0 4.3 2.9 7.6 7 9.4 4.1-1.8 7-5.1 7-9.4V6l-7-3Z" /><path d="m9.3 12.2 1.9 1.9 3.6-3.8" /></>,
  download: <><path d="M12 4v10" /><path d="m8 11 4 4 4-4" /><path d="M5 19h14" /></>,
  upload: <><path d="M12 16V5.5" /><path d="m8 9 4-4 4 4" /><path d="M5 19h14" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  paperclip: <path d="M20 11.5 12.3 19a4.6 4.6 0 0 1-6.6-6.5l7.8-7.8a3.1 3.1 0 0 1 4.4 4.4l-7.8 7.8a1.5 1.5 0 0 1-2.2-2.2l7.1-7.1" />,
  send: <><path d="M21 4 3 11l7 2.6L12.6 21 21 4Z" /><path d="m10 14 3.4-3.4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  phone: <path d="M7 3.5h-.6A2.4 2.4 0 0 0 4 6c0 7.7 6.3 14 14 14a2.4 2.4 0 0 0 2.5-2.4V17l-4-1.6-2 2a13.2 13.2 0 0 1-5.9-5.9l2-2L9 5.5V3.5Z" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /><path d="M8 3v4" /><path d="M16 3v4" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  arrowUpRight: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  trendUp: <><path d="m3 16 6-6 4 4 8-8" /><path d="M15 6h6v6" /></>,
  trendDown: <><path d="m3 8 6 6 4-4 8 8" /><path d="M15 18h6v-6" /></>,
  logout: <><path d="M15 5V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1" /><path d="M10 12h11" /><path d="m18 8 4 4-4 4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 14.4a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H10a1.6 1.6 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V10a1.6 1.6 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.5 2.5 0 1 1 3.3 2.9c-.6.2-.9.8-.9 1.4v.4" /><path d="M12 17.2h.01" /></>,
  inbox: <><path d="M4 13h4l1.5 2.5h5L16 13h4" /><path d="M4.8 5.5h14.4l1.8 7.5v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4l1.8-7.5Z" /></>,
  star: <path d="m12 4 2.4 5 5.6.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.6-.8L12 4Z" />,
  userCheck: <><path d="M15 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" /><circle cx="8.5" cy="7" r="3.2" /><path d="m16 11.5 2 2 4-4" /></>,
  building: <><path d="M4 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15" /><path d="M15 10h3a2 2 0 0 1 2 2v9" /><path d="M3 21h18" /><path d="M8 8h3" /><path d="M8 12h3" /><path d="M8 16h3" /></>,
  briefcase: <><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" /><path d="M3 12.5h18" /></>,
  refresh: <><path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" /><path d="M20.5 4v5h-5" /></>,
  filter: <path d="M4 5h16l-6.3 7.4V19l-3.4 1.6v-8.2L4 5Z" />,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5" /></>,
  folder: <path d="M3.5 7.5a2 2 0 0 1 2-2h3.2l2 2.4h7.8a2 2 0 0 1 2 2v8.6a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-11Z" />,
  eyeChart: <><path d="M3 20h18" /><path d="M6 20V9" /><path d="M11 20V4" /><path d="M16 20v-8" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 5h11l-1.6 3.4L16 12H5" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 1.8" /></>,
  more: <><circle cx="5.5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18.5" cy="12" r="1.3" /></>,
};

export default function Icon({ name, size = 18, strokeWidth = 1.7, className, ...rest }) {
  const path = P[name];
  if (!path) return null;
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
      className={className}
      {...rest}
    >
      {path}
    </svg>
  );
}

export const iconNames = Object.keys(P);
