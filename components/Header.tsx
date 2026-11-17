import { cn } from 'cn';
import { Moon, Sun } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchLocaleLang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

const locale = fetchLocaleLang();
const links = [
  { name: locale.NAV.INDEX, href: '/posts' },
  { name: locale.NAV.ABOUT, href: '/about' },
  { name: locale.NAV.RSS, href: '/feed' },
];

type HeaderProps = { fullWidth?: boolean; compact?: boolean; metaTitle?: string };

export const Header = ({ fullWidth, compact }: HeaderProps) => {
  const { asPath } = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div
        className={cn(
          'site-width site-nav',
          compact && 'site-width-home',
          fullWidth && 'site-width-wide',
        )}
      >
        <Link href="/" aria-label={BLOG.title} className="site-brand">
          <Image
            width={32}
            height={32}
            src="https://avatars.githubusercontent.com/u/56786508?v=4"
            alt=""
            className="rounded-lg"
          />
          <span className="hidden sm:inline">{BLOG.title}</span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          {links.map(({ name, href }) => {
            const active =
              href === '/posts'
                ? asPath.startsWith('/posts') || asPath.startsWith('/tags/')
                : asPath.split(/[?#]/)[0] === href;
            return (
              <Button key={href} asChild variant="navigation" data-active={active}>
                {href === '/feed' ? (
                  <a href={href} type="application/rss+xml">
                    {name}
                  </a>
                ) : (
                  <Link href={href} aria-current={active ? 'page' : undefined}>
                    {name}
                  </Link>
                )}
              </Button>
            );
          })}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Toggle Dark Mode"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Moon /> : <Sun />}
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>Switch appearance</TooltipContent>
          </Tooltip>
        </nav>
      </div>
    </header>
  );
};
