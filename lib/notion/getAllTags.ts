import type { Post, TagObj } from '@/types';

type Props = { posts: Post[] };

export const getAllTags = ({ posts }: Props): TagObj => {
  const counts = new Map<string, number>();
  for (const tag of (posts ?? []).flatMap((post) => post.tags ?? [])) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return Object.fromEntries([...counts].sort(([, a], [, b]) => b - a));
};
