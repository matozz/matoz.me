import { useMemo, useRef, useState } from 'react';

import { Search, X } from 'lucide-react';

import { BlogPost } from '@/components/BlogPost';
import { Tags } from '@/components/Tag';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { getTagDataBySlug, isTagSlug } from '@/lib';
import type { Post, TagObj } from '@/types';

type Props = { posts: Post[]; tags: TagObj; currentTag?: string };

export const SearchLayout = ({ tags, posts, currentTag }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const query = searchValue.trim().toLocaleLowerCase();
  const filteredPosts = useMemo(
    () =>
      posts.filter((post) =>
        [post.title, post.summary, ...(post.tags ?? [])]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase()
          .includes(query),
      ),
    [posts, query],
  );
  const topic =
    currentTag && isTagSlug(currentTag) ? getTagDataBySlug(currentTag).name : currentTag;
  const clearSearch = () => {
    setSearchValue('');
    input.current?.focus();
  };

  return (
    <section aria-labelledby="blog-title" className="blog-index">
      <header className="page-intro">
        <h1 id="blog-title" className="page-title">
          {topic || 'Blog'}
        </h1>
        <p className="page-description">
          {topic ? `Articles filed under ${topic}.` : 'Notes on frontend development and the web.'}
        </p>
      </header>
      <div className="flex flex-col gap-5">
        <InputGroup className="h-11">
          <InputGroupInput
            ref={input}
            type="text"
            aria-label="Search articles"
            aria-controls="article-results"
            placeholder={topic ? `Search in ${topic}…` : 'Search articles…'}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') clearSearch();
            }}
          />
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          {!!searchValue && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton aria-label="Clear search" size="icon-sm" onClick={clearSearch}>
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <Tags tags={tags} currentTag={currentTag} />
      </div>
      <p className="result-count" role="status" aria-live="polite" aria-atomic="true">
        {query ? `${filteredPosts.length} of ${posts.length}` : posts.length}{' '}
        {posts.length === 1 ? 'article' : 'articles'}
        {query && ` matching “${searchValue.trim()}”`}
      </p>
      <div id="article-results" className="article-container">
        {filteredPosts.length ? (
          filteredPosts.map((post) => <BlogPost key={post.id} post={post} />)
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>No articles found</EmptyTitle>
              <EmptyDescription>Try a different keyword or clear your search.</EmptyDescription>
            </EmptyHeader>
            {!!searchValue && (
              <EmptyContent>
                <Button variant="outline" onClick={clearSearch}>
                  Clear search
                </Button>
              </EmptyContent>
            )}
          </Empty>
        )}
      </div>
    </section>
  );
};
