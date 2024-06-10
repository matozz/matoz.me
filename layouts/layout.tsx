import { ArrowLeft } from 'lucide-react';
import { ExtendedRecordMap } from 'notion-types';

import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { Container } from '@/components';
import { NotionRenderer } from '@/components/Notion';
import { TagItem } from '@/components/Tag';
import formatDate from '@/lib/formatDate';
import { getTwitterShareUrl } from '@/lib/getTwitterShareUrl';
import { useLocale } from '@/lib/i18n';
import { Post } from '@/types';

type Props = {
  blockMap: ExtendedRecordMap;
  post: Post;
  fullWidth?: boolean;
  onlyContents?: boolean;
  slug?: string | null;
};

export const Layout: React.FC<Props> = ({
  blockMap,
  post,
  slug,
  fullWidth = false,
  onlyContents = false,
}) => {
  const locale = useLocale();
  const router = useRouter();

  const renderContents = () => (
    <article className="mb-8 mt-4 md:mt-0">
      <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">{post.title}</h1>
      {post?.type?.[0] !== 'Page' && (
        <nav className="my-4 flex items-center text-gray-500 dark:text-gray-300">
          <div className="flex">
            <p className="md:block">{BLOG.author}</p>
            <span className="block">&nbsp;/&nbsp;</span>
            <div className="mr-2 md:ml-0">
              {formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)}
            </div>
          </div>
          {post.tags && (
            <div className="article-tags mb-1 mt-2 flex max-w-full flex-nowrap overflow-x-auto">
              {post.tags.map((tag) => (
                <TagItem key={tag} tag={tag} />
              ))}
            </div>
          )}
        </nav>
      )}
      {blockMap && <NotionRenderer recordMap={blockMap} />}
    </article>
  );

  return onlyContents ? (
    renderContents()
  ) : (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      date={new Date(post.createdTime).toISOString()}
      type="article"
      fullWidth={fullWidth}
      slug={slug}
    >
      {renderContents()}

      <div className="flex justify-between pt-4 font-medium text-gray-500 dark:text-gray-400">
        <button
          onClick={() => router.push('/')}
          className="flex cursor-pointer items-center gap-1 hover:text-black dark:hover:text-gray-100"
          type="button"
        >
          <ArrowLeft /> {locale?.POST.BACK}
        </button>
        <a
          href={getTwitterShareUrl({
            text: post?.title ?? BLOG.title,
            url: `${BLOG.link}/posts/${slug}`,
            via: BLOG.author,
          })}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="share with x"
          className="ml-auto cursor-pointer text-blue-500 underline opacity-80 hover:opacity-100 dark:border-blue-400 dark:text-blue-400"
        >
          {locale?.POST.SHARE}
        </a>
      </div>
    </Container>
  );
};
