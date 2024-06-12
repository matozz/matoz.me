import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react';

import Head from 'next/head';

import BLOG from '@/blog.config';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (theme?: Theme) => void;
}>({
  theme: BLOG.appearance,
  setTheme: () => null,
  toggleTheme: () => null,
});

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>();

  const toggleTheme = (_theme: Theme | undefined = theme) => {
    if (_theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const handleThemeChange = (e: MediaQueryListEvent) => {
      toggleTheme(e.matches ? 'light' : 'dark');
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange);
    return window.removeEventListener('change', handleThemeChange as never);
  }, []);

  if (!theme) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <Head>
        <meta
          name="theme-color"
          content={theme === 'dark' ? BLOG.darkBackground : BLOG.lightBackground}
        />
      </Head>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
