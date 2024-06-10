import { Feed } from 'feed';

import BLOG from '@/blog.config';
import { Post } from '@/types';

export function generateRss(posts: Post[]) {
  const year = new Date().getFullYear();
  const feed = new Feed({
    title: BLOG.title,
    description: BLOG.description,
    id: `${BLOG.link}/`,
    link: `${BLOG.link}/`,
    language: BLOG.lang,
    favicon: `${BLOG.link}/favicon.svg`,
    copyright: `All rights reserved ${year}, ${BLOG.author}`,
    author: {
      name: BLOG.author,
      email: BLOG.email,
      link: BLOG.link,
    },
  });
  for (const post of posts) {
    feed.addItem({
      title: post?.title ?? '',
      id: `${BLOG.link}/posts/${post.slug}`,
      link: `${BLOG.link}/posts/${post.slug}`,
      description: post.summary,
      date: new Date(post?.date?.start_date || post.createdTime),
    });
  }
  return feed.rss2();
}
