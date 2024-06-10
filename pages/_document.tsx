import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

import BLOG from '@/blog.config';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang={BLOG.lang} className={BLOG.appearance === 'dark' ? 'dark' : undefined}>
        <Head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" sizes="192x192" href="/apple-touch-icon.png" />
          <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="/feed" />
        </Head>
        <body className="bg-day dark:bg-night">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
