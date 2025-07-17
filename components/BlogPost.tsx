import { ExternalLink } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import BLOG from '@/blog.config';
import formatDate from '@/lib/formatDate';
import { Post } from '@/types';

type Props = {
  post: Post;
};

export const BlogPost: React.FC<Props> = ({ post }) => {
  const isExternal = Boolean(post.link);

  const renderBlogPost = () => {
    return (
      <article
        key={post.id}
        className="mt-2 mb-6 transition-transform ease-out md:mb-8 md:hover:scale-105 md:hover:opacity-90"
      >
        <header>
          <time className="mb-2 inline-block text-sm text-gray-600 dark:text-gray-400">
            {formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}
          </time>
          <div className="mb-2 flex items-start gap-1">
            <h2 className="cursor-pointer text-lg font-medium text-black md:text-xl dark:text-white">
              {post.title}
            </h2>
            {isExternal && <ExternalLink size={16} className="text-blue-500 dark:text-blue-400" />}
          </div>
        </header>
        {post?.thumbnail_url && (
          <Image
            src={post.thumbnail_url}
            alt={post.title as string}
            decoding="async"
            className="my-3 rounded-md bg-gray-100 drop-shadow-md dark:bg-gray-900"
          />
        )}
        <main>
          <p className="line-clamp-1 text-base leading-8 text-gray-700 dark:text-gray-300">
            {post.summary}
          </p>
        </main>
      </article>
    );
  };

  return <Link href={post.link || `/posts/${post.slug}`}>{renderBlogPost()}</Link>;
};
