import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { ExtendedRecordMap } from 'notion-types';

import Link from 'next/link';

import BLOG from '@/blog.config';
import { Container } from '@/components/Container';
import { NotionRenderer } from '@/components/Notion';
import { TagItem } from '@/components/Tag';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import formatDate from '@/lib/formatDate';
import { getTwitterShareUrl } from '@/lib/getTwitterShareUrl';
import type { Post } from '@/types';

type Props = {
  blockMap: ExtendedRecordMap;
  post: Post;
  fullWidth?: boolean;
  onlyContents?: boolean;
  slug?: string | null;
};

export const Layout = ({
  blockMap,
  post,
  slug,
  fullWidth = false,
  onlyContents = false,
}: Props) => {
  const isPost = post.type?.[0] === 'Post';
  const date = post.date?.start_date || post.createdTime;
  const heading = (
    <header className="post-header">
      {isPost && (
        <Link href="/posts" className="article-back">
          <ArrowLeft size={14} aria-hidden="true" /> All articles
        </Link>
      )}
      <h1 className="post-title">{post.title}</h1>
      {isPost && (
        <div className="post-meta">
          <span>{BLOG.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={date}>{formatDate(date, BLOG.lang)}</time>
          {!!post.tags?.length && (
            <ul className="article-tags flex flex-wrap gap-2" aria-label="Article topics">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <TagItem tag={tag} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  );
  const footer = (
    <footer className="article-footer">
      <Separator />
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <Button asChild variant="ghost" size="sm">
          <Link href="/posts">
            <ArrowLeft data-icon="inline-start" /> All articles
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <a
            href={getTwitterShareUrl({
              text: post.title ?? BLOG.title,
              url: `${BLOG.link}/${isPost ? 'posts/' : ''}${post.slug ?? slug}`,
              via: BLOG.author,
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on X <ArrowUpRight data-icon="inline-end" />
          </a>
        </Button>
      </div>
    </footer>
  );
  const content = (
    <NotionRenderer
      recordMap={blockMap}
      pageHeader={heading}
      pageFooter={onlyContents ? undefined : footer}
    />
  );
  return onlyContents ? (
    content
  ) : (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      date={new Date(date).toISOString()}
      type="article"
      fullWidth={fullWidth}
      slug={slug}
    >
      {content}
    </Container>
  );
};
