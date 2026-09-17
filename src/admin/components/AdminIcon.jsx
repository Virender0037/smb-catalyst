import Icon from '../../components/ui/Icon';

/**
 * Admin-only glyphs, drawn on the same 24px grid and stroke weight as the
 * shared portal set. Anything not defined here delegates to the shared
 * <Icon>, so the client portal's icon file is never touched.
 */
const EXTRA = {
  edit: (
    <>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="m14.5 6.5 3 3" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="4.5" rx="1.2" />
      <path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5" />
      <path d="M10 12.5h4" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8-8" />
      <path d="m16.5 6.5 2 2" />
      <path d="m19.5 3.5 2 2" />
    </>
  ),
  userMinus: (
    <>
      <path d="M15 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
      <circle cx="8.5" cy="7" r="3.2" />
      <path d="M16.5 11.5h5.5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3.5 12.5 8.5 4.7 8.5-4.7" />
      <path d="m3.5 16.8 8.5 4.7 8.5-4.7" />
    </>
  ),
  link: (
    <>
      <path d="M10.5 13.5a3.8 3.8 0 0 0 5.6.4l2.4-2.4a3.8 3.8 0 0 0-5.4-5.4l-1.4 1.3" />
      <path d="M13.5 10.5a3.8 3.8 0 0 0-5.6-.4l-2.4 2.4a3.8 3.8 0 0 0 5.4 5.4l1.4-1.3" />
    </>
  ),
  slash: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m5.6 5.6 12.8 12.8" />
    </>
  ),
  droplet: <path d="M12 3.5s6 6.2 6 10.1a6 6 0 0 1-12 0C6 9.7 12 3.5 12 3.5Z" />,
};

export default function AdminIcon({ name, size = 18, strokeWidth = 1.7, className, ...rest }) {
  const path = EXTRA[name];
  if (!path) return <Icon name={name} size={size} strokeWidth={strokeWidth} className={className} {...rest} />;
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
