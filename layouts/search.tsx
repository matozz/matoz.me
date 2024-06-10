import { useMemo, useState } from 'react';

import { BlogPost } from '@/components';
import { Tags } from '@/components/Tag';
import { TagSlug, getTagDataBySlug, isTagSlug } from '@/lib';
import { useLocale } from '@/lib/i18n';
import { Post, TagObj } from '@/types';

type Props = {
  posts: Post[];
  tags: TagObj;
  currentTag?: TagSlug;
};

export const SearchLayout: React.FC<Props> = ({ tags, posts, currentTag }) => {
  const [searchValue, setSearchValue] = useState('');
  const locale = useLocale();

  const filteredBlogPosts = useMemo(() => {
    if (posts) {
      return posts.filter((post) => {
        const tagContent = post.tags ? post.tags.join(' ') : '';
        const searchContent = post?.title ?? `${post?.summary}` ?? `${tagContent}`;
        return searchContent.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    return [];
  }, [posts, searchValue]);

  const currentTagName = useMemo(() => {
    if (!currentTag || !isTagSlug(currentTag)) return currentTag;
    return getTagDataBySlug(currentTag).name;
  }, [currentTag]);

  if (!locale) {
    return null;
  }

  return (
    <>
      <div className="relative my-2">
        <input
          type="text"
          placeholder={
            currentTag ? `${locale.POST.SEARCHIN} #${currentTagName}` : locale.POST.SEARCH
          }
          className="block w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-2 text-black dark:bg-gray-700 dark:text-white"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="sticky top-16 z-10 bg-day dark:bg-night">
        <Tags tags={tags} currentTag={currentTag} />
      </div>
      <div className="article-container my-5">
        {!filteredBlogPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">{locale.POST.NOTFOUND}</p>
        )}
        {filteredBlogPosts.map((post) => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};
