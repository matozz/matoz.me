import { useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { NextSeo, NextSeoProps } from 'next-seo';

import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { Footer, Header } from '@/components';
import { getOGImageURL } from '@/lib/getOGImageURL';
import { useTheme } from '@/lib/theme';

import MagnetBackground from './MagnetBackground';

type Props = {
  children: React.ReactNode;
  layout?: 'blog';
  type?: 'article' | 'website';
  title?: string;
  description?: string;
  fullWidth?: boolean;
  date?: string;
  slug?: string | null;
  createdTime?: string;
  isTagPage?: boolean;
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const Container: React.FC<Props> = ({ children, fullWidth, ...meta }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [customMetaTags, setCustomMetaTags] = useState<
    NonNullable<NextSeoProps['additionalMetaTags']>
  >([]);
  const [alreadySet, setAlreadySet] = useState<boolean>(false);

  const root = useMemo(() => {
    return router.pathname === '/';
  }, [router]);

  const siteTitle = useMemo(() => {
    return meta.title ?? BLOG.title;
  }, [meta]);

  useEffect(() => {
    if (alreadySet || meta.type !== 'article' || !meta) return;
    setCustomMetaTags((prevCustomMetaTags) =>
      (prevCustomMetaTags ?? []).concat(
        {
          property: 'article:published_time',
          content: meta?.date || meta?.createdTime || '',
        },
        {
          property: 'article:author',
          content: BLOG.author,
        },
      ),
    );
    setAlreadySet(true);
  }, [alreadySet, meta]);

  const canonical = `${BLOG.link}${router.asPath}`;

  return (
    <div>
      <NextSeo
        title={meta.title}
        description={meta.description}
        nofollow={true}
        canonical={canonical}
        robotsProps={{
          nosnippet: false,
          notranslate: false,
          noimageindex: false,
          noarchive: false,
        }}
        themeColor={theme === 'dark' ? BLOG.darkBackground : BLOG.lightBackground}
        openGraph={{
          title: meta.title,
          url: canonical,
          type: meta.type ?? 'website',
          locale: BLOG.lang,
          description: meta.description,
          siteName: BLOG.title,
          images: [
            {
              url: getOGImageURL({ title: siteTitle, root, twitter: false }),
            },
          ],
        }}
        additionalMetaTags={customMetaTags.concat(
          {
            name: 'google-site-verification',
            content: BLOG.seo.googleSiteVerification,
          },
          {
            name: 'keywords',
            content: BLOG.seo.keywords.join(', '),
          },
          {
            property: 'twitter:image',
            content: getOGImageURL({
              title: siteTitle,
              root,
              twitter: true,
            }),
          },
        )}
        twitter={{
          cardType: 'summary_large_image',
          site: '@_matozz',
        }}
      />
      <div className={classNames('wrapper', 'font-sans', inter.variable)}>
        <Header fullWidth={fullWidth} metaTitle={meta.title} />
        <main
          className={classNames('relative m-auto w-screen grow overflow-x-hidden transition-all', {
            'px-4 md:px-24': fullWidth,
            'max-w-2xl px-6': !fullWidth,
          })}
        >
          {children}
        </main>
        <Footer fullWidth={fullWidth} />
      </div>

      <MagnetBackground />
    </div>
  );
};
