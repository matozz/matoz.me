import { GetServerSideProps } from 'next';

import { getAllPosts } from '@/lib/notion';
import { generateRss } from '@/lib/rss';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  const posts = await getAllPosts({ filterPostTypeBy: 'post' });
  const recentPublishPosts = posts.slice(0, 10);
  const xmlFeed = generateRss(recentPublishPosts);
  res.write(xmlFeed);
  res.end();
  return {
    props: {},
  };
};

const feed = () => null;

export default feed;
