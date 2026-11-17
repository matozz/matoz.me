import { ArrowUpRight } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import BLOG from '@/blog.config';
import { Badge } from '@/components/ui/badge';
import formatDate from '@/lib/formatDate';
import type { Post } from '@/types';

type Props = { post: Post };

export const BlogPost = ({ post }: Props) => (
  <article className="blog-post">
    <Link
      href={post.link || `/posts/${post.slug}`}
      className="post-link group"
      rel={post.link ? 'noopener noreferrer' : undefined}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <time dateTime={post.date?.start_date || post.createdTime} className="post-date">
          {formatDate(post.date?.start_date || post.createdTime, BLOG.lang)}
        </time>
        {post.link && (
          <span className="post-source">
            External article <ArrowUpRight aria-hidden="true" size={13} />
          </span>
        )}
      </div>
      <h2 className="post-list-title">{post.title}</h2>
      {post.thumbnail_url && (
        <Image
          src={post.thumbnail_url}
          alt=""
          width={1200}
          height={630}
          sizes="(max-width: 720px) 100vw, 672px"
          unoptimized
          className="my-4 h-auto w-full rounded-lg"
        />
      )}
      {post.summary && <p className="post-summary">{post.summary}</p>}
      {!!post.tags?.length && (
        <div className="mt-3 flex flex-wrap gap-1" aria-label="Topics">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="topic">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  </article>
);
