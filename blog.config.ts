import { BlogConfig } from './types';

const BLOG: BlogConfig = {
  title: 'Matoz',
  author: 'Matoz',
  email: 'matoztech@gmail.com',
  link: 'https://matoz.tech',
  description: 'made with love ❤️.',
  repository: 'https://github.com/matozz/matoz.tech',
  lang: 'en-US', // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES']
  appearance: 'light', // ['light', 'dark'],
  lightBackground: '#ffffff', // use hex value, don't forget '#' e.g #fffefc
  darkBackground: '#18181B', // use hex value, don't forget '#'
  profileSlug: 'about',
  since: 2021, // If leave this empty, current year will be used.
  postsPerPage: 7,
  sortByDate: true,
  autoCollapsedNavBar: false, // The automatically collapsed navigation bar
  ogImageGenerateURL: 'https://simple-og-image.vercel.app', // The link to generate OG image, don't end with a slash
  seo: {
    keywords: ['matoz'],
    googleSiteVerification: '', // Remove the value or replace it with your own google site verification code
  },
  notionPageId: process.env.NOTION_PAGE_ID as string, // DO NOT CHANGE THIS！！！
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN as string, // Useful if you prefer not to make your database public
  isProd: process.env.VERCEL_ENV === 'production', // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
};

export default BLOG;