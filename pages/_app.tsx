import 'react-notion-x/styles.css';

import { Analytics } from '@vercel/analytics/next';
import 'katex/dist/katex.min.css';
import type { AppProps } from 'next/app';

import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import '@/styles/globals.css';
import '@/styles/notion.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <TooltipProvider delayDuration={300}>
          <Component {...pageProps} />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
};

export default MyApp;
