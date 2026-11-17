import { GetStaticProps, NextPage } from 'next';

import BLOG from '@/blog.config';
import { Container } from '@/components';
import { SearchLayout } from '@/layouts';
import { filterPublishedPosts, getAllPosts, getAllTags } from '@/lib/notion';

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPosts();

  const posts = filterPublishedPosts({
    posts: allPosts,
    filterPostTypeBy: 'post',
  });
  return {
    props: {
      posts,
      tags: getAllTags({ posts }),
    },
    revalidate: 60,
  };
};

type Props = Omit<React.ComponentProps<typeof SearchLayout>, 'currentTag'>;

const Blog: NextPage<Props> = ({ posts, tags }) => {
  return (
    <Container title={`Blog - ${BLOG.title}`}>
      <SearchLayout posts={posts} tags={tags} />
    </Container>
  );
};

export default Blog;
