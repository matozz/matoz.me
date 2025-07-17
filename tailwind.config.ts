import type { Config } from 'tailwindcss';

import theme from 'tailwindcss/defaultTheme';

import BLOG from './blog.config';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        day: { DEFAULT: BLOG.lightBackground || '#ffffff' },
        night: { DEFAULT: BLOG.darkBackground || '#111827' },
      },
      boxShadow: {
        'outer-full': '0 0px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
