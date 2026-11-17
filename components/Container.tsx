import { cn } from 'cn';

import { generateNextSeo, type NextSeoProps } from 'next-seo/pages';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
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
  noIndex?: boolean;
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const Container: React.FC<Props> = ({ children, fullWidth, ...meta }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const root = router.pathname === '/';
  const Main = meta.layout === 'blog' ? 'div' : 'main';
  const siteTitle = meta.title ?? BLOG.title;
  const canonical = new URL(router.asPath.split(/[?#]/)[0], BLOG.link).href;
  const customMetaTags: NonNullable<NextSeoProps['additionalMetaTags']> =
    meta.type === 'article'
      ? [
          { property: 'article:published_time', content: meta.date || meta.createdTime || '' },
          { property: 'article:author', content: BLOG.author },
        ]
      : [];

  return (
    <div>
      <Head>
        {generateNextSeo({
          title: siteTitle,
          description: meta.description ?? BLOG.description,
          canonical,
          noindex: meta.noIndex ?? false,
          robotsProps: {
            nosnippet: false,
            notranslate: false,
            noimageindex: false,
            noarchive: false,
          },
          themeColor: theme === 'dark' ? BLOG.darkBackground : BLOG.lightBackground,
          openGraph: {
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
          },
          additionalMetaTags: customMetaTags.concat(
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
          ),
          twitter: {
            cardType: 'summary_large_image',
            site: '@_matozz',
          },
        })}
      </Head>
      <div className={cn('wrapper font-sans', inter.variable)}>
        <Header fullWidth={fullWidth} compact={root} metaTitle={meta.title} />
        <Main
          id="main-content"
          tabIndex={-1}
          className={cn(
            'site-width site-content',
            root && 'site-width-home',
            fullWidth && 'site-width-wide',
          )}
        >
          {children}
        </Main>
        <Footer fullWidth={fullWidth} compact={root} />
      </div>

      {root && <MagnetBackground />}
    </div>
  );
};
