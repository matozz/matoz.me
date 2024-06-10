import Image from 'next/image';
import Link from 'next/link';

import BLOG from '@/blog.config';
import formatDate from '@/lib/formatDate';
import { Post } from '@/types';

type Props = {
  post: Post;
};

export const BlogPost: React.FC<Props> = ({ post }) => {
  const renderBlogPost = () => {
    return (
      <article
        key={post.id}
        className="mb-6 mt-2 transition-transform ease-out hover:scale-105 hover:opacity-90 md:mb-8"
      >
        <header>
          <time className="mb-2 inline-block text-sm text-gray-600 dark:text-gray-400">
            {formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}
          </time>
          <div className="flex">
            <h2 className="mb-2 cursor-pointer text-lg font-medium text-black dark:text-white md:text-xl">
              {post.title}
            </h2>
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

  return <Link href={`/posts/${post.slug}`}>{renderBlogPost()}</Link>;
};
