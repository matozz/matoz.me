import BLOG from '@/blog.config';
import { Post } from '@/types';

export const getProfilePost = async (allPosts: Post[]) => {
  const post = allPosts.find((t) => t.slug === BLOG.profileSlug);

  if (!post?.id) {
    return { post: null, blockMap: null };
  }

  return {
    post,
  };
};
