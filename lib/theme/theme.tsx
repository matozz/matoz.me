import { type PropsWithChildren, useSyncExternalStore } from 'react';

import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes';

export const ThemeProvider = ({ children }: PropsWithChildren) => (
  <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    {children}
  </NextThemeProvider>
);

const subscribe = () => () => undefined;

export const useTheme = () => {
  const { resolvedTheme, setTheme } = useNextTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return {
    theme: mounted ? resolvedTheme : undefined,
    setTheme,
    toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
};
