import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 24, children, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

export const Icons = {
  home: (p: IconProps) => <Icon {...p}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" /></Icon>,
  search: (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>,
  compass: (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m15 9-2 4-4 2 2-4Z" /></Icon>,
  reel: (p: IconProps) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="4" /><path d="m7 4 3 4m3-4 3 4m5 0H3m7 4.5 5 3-5 3Z" /></Icon>,
  message: (p: IconProps) => <Icon {...p}><path d="M21 11.4a8.4 8.4 0 0 1-9 8.4 9.7 9.7 0 0 1-3.8-.8L3 21l1.6-4.7A8.6 8.6 0 1 1 21 11.4Z" /></Icon>,
  heart: (p: IconProps) => <Icon {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></Icon>,
  plus: (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v8m-4-4h8" /></Icon>,
  menu: (p: IconProps) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>,
  edit: (p: IconProps) => <Icon {...p}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></Icon>,
  info: (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></Icon>,
  phone: (p: IconProps) => <Icon {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" /></Icon>,
  video: (p: IconProps) => <Icon {...p}><rect x="3" y="6" width="14" height="12" rx="2" /><path d="m17 10 4-2v8l-4-2Z" /></Icon>,
  image: (p: IconProps) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></Icon>,
  smile: (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></Icon>,
};
