import { useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import NextHeadSeo from 'next-head-seo';

import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { Footer, Header } from '@/components';
import { getOGImageURL } from '@/lib/getOGImageURL';

type NextHeadSeoProps = Parameters<typeof NextHeadSeo>[0];

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
  const [customMetaTags, setCustomMetaTags] = useState<NextHeadSeoProps['customLinkTags']>([]);
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

  return (
    <div>
      <NextHeadSeo
        title={meta.title}
        description={meta.description}
        robots={'index, follow'}
        canonical={router.asPath}
        og={{
          title: meta.title,
          url: router.asPath,
          type: meta.type ?? 'website',
          description: meta.description,
          image: getOGImageURL({
            title: siteTitle,
            root,
            twitter: false,
          }),
        }}
        customMetaTags={(customMetaTags ?? []).concat(
          {
            charSet: 'UTF-8',
          },
          {
            property: 'og:locale',
            content: BLOG.lang,
          },
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
          card: 'summary_large_image',
          site: '@_matozz',
        }}
      />
      <div className={classNames('wrapper', 'font-sans', inter.variable)}>
        <Header fullWidth={fullWidth} metaTitle={meta.title} />
        <main
          className={classNames('m-auto w-full flex-grow transition-all', {
            'px-4 md:px-24': fullWidth,
            'max-w-2xl px-6': !fullWidth,
          })}
        >
          {children}
        </main>
        <Footer fullWidth={fullWidth} />
      </div>
    </div>
  );
};
