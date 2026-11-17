/* eslint-disable @next/next/no-html-link-for-pages -- RSS returns XML and requires document navigation. */
import { cn } from 'cn';

import BLOG from '@/blog.config';
import { Separator } from '@/components/ui/separator';

type Props = { fullWidth?: boolean; compact?: boolean };

export const Footer = ({ fullWidth, compact }: Props) => (
  <footer
    className={cn(
      'site-width site-footer',
      compact && 'site-width-home',
      fullWidth && 'site-width-wide',
    )}
  >
    <Separator />
    <div className="text-muted-foreground flex items-center justify-between gap-4 py-6 text-xs">
      <p>
        © {new Date().getFullYear()} {BLOG.author}
      </p>
      <a href="/feed" className="footer-link">
        RSS feed
      </a>
    </div>
  </footer>
);
