import 'react-notion-x/src/styles.css';

import { Analytics } from '@vercel/analytics/next';
import type { AppProps } from 'next/app';

import { LocaleProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import '@/styles/globals.css';
import '@/styles/notion.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <Component {...pageProps} />
        <Analytics />
      </ThemeProvider>
    </LocaleProvider>
  );
};

export default MyApp;
