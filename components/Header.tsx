import { useCallback, useEffect, useMemo, useRef } from 'react';

import classNames from 'classnames';
import { FileText, Moon, Rss, Sun, User } from 'lucide-react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { fetchLocaleLang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

const locale = fetchLocaleLang();
const links = [
  { id: 1, name: locale.NAV.INDEX, to: '/posts', icon: <FileText /> },
  { id: 2, name: locale.NAV.ABOUT, to: '/about', icon: <User /> },
  { id: 3, name: locale.NAV.RSS, to: '/feed', icon: <Rss /> },
];

const NavBar: React.FC = () => {
  const router = useRouter();

  const { theme, toggleTheme } = useTheme();

  const activeNav = useMemo(() => {
    return links.find((link) => link.to === router.asPath)?.to;
  }, [router]);

  return (
    <div className="flex flex-shrink-0 items-center">
      <Head>
        <meta
          name="theme-color"
          content={theme === 'dark' ? BLOG.darkBackground : BLOG.lightBackground}
        />
      </Head>

      <ul className="flex flex-row">
        {links.map((link) => (
          <div key={link.id}>
            <div
              className={classNames(
                'ml-4 hidden items-center text-gray-500 dark:text-gray-300 lg:flex',
                { '!text-blue-500 dark:!text-blue-400': link.to === activeNav },
              )}
            >
              <Link href={link.to}>{link.name}</Link>
            </div>
            <button
              aria-label={link.name}
              title={link.name}
              type="button"
              className={classNames(
                'ml-1 flex h-8 w-8 items-center justify-center rounded p-1 text-gray-500 transition-transform duration-200 hover:scale-110 active:scale-90 dark:text-gray-300 sm:ml-4 lg:hidden',
                { '!text-blue-500 dark:!text-blue-400': link.to === activeNav },
              )}
              onClick={() => router.push(link.to)}
            >
              {link.icon}
            </button>
          </div>
        ))}
      </ul>

      <button
        aria-label="Toggle Dark Mode"
        type="button"
        className="ml-1 h-8 w-8 rounded p-1 text-gray-500 transition-transform duration-200 hover:scale-110 active:scale-90 dark:text-gray-300 sm:ml-4"
        onClick={() => toggleTheme()}
      >
        {theme === 'light' ? <Sun /> : <Moon />}
      </button>
    </div>
  );
};

type HeaderProps = {
  fullWidth?: boolean;
  metaTitle?: string;
};

export const Header: React.FC<HeaderProps> = ({ fullWidth, metaTitle }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const sentinalRef = useRef<HTMLDivElement>(null);

  const handler = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (navRef?.current && !BLOG.autoCollapsedNavBar) {
      if (!entry.isIntersecting) {
        navRef.current.classList.add('sticky-nav-full');
      } else {
        navRef.current.classList.remove('sticky-nav-full');
      }
    } else {
      navRef?.current?.classList.add('remove-sticky');
    }
  }, []);

  useEffect(() => {
    const obvserver = new window.IntersectionObserver(handler);
    if (sentinalRef?.current) obvserver.observe(sentinalRef.current);
    // Don't touch this, I have no idea how it works XD
    return () => {
      if (sentinalRef?.current) obvserver.unobserve(sentinalRef.current);
    };
  }, [handler]);

  return (
    <>
      <div className="h-2 md:h-12" ref={sentinalRef} />
      <div
        className={classNames(
          'sticky-nav m-auto mb-2 flex h-6 w-full flex-row items-center justify-between bg-opacity-60 py-8 md:mb-12',
          {
            'px-4 md:px-24': fullWidth,
            'max-w-3xl px-6': !fullWidth,
          },
        )}
        id="sticky-nav"
        ref={navRef}
      >
        <div className="flex items-center gap-1">
          <Link href="/" aria-label={BLOG.title} passHref>
            <div className="flex">
              <Image
                width={32}
                height={32}
                src="https://avatars.githubusercontent.com/u/56786508?v=4"
                alt="Back to home"
                title="Back to home"
                className="cursor-pointer rounded-md transition-transform duration-300 hover:scale-110 active:scale-90"
              />
            </div>
          </Link>
          <div className="flex items-center">
            {metaTitle ? (
              <p className="header-name ml-2 font-medium text-black dark:text-white">{metaTitle}</p>
            ) : (
              <p className="header-name ml-2 font-medium text-black dark:text-white">
                {BLOG.title} - <span className="font-normal">{BLOG.description}</span>
              </p>
            )}
          </div>
        </div>
        <NavBar />
      </div>
    </>
  );
};
