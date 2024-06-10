import type { Config } from 'tailwindcss';

import { fontFamily } from 'tailwindcss/defaultTheme';

import BLOG from './blog.config';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        day: { DEFAULT: BLOG.lightBackground || '#ffffff' },
        night: { DEFAULT: BLOG.darkBackground || '#111827' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
