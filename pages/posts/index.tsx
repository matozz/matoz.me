import { GetStaticProps, NextPage } from 'next';

import BLOG from '@/blog.config';
import { BlogPost, Container } from '@/components';
import { SearchLayout } from '@/layouts';
import { filterPublishedPosts, getAllPosts } from '@/lib/notion';

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPosts();

  const posts = filterPublishedPosts({
    posts: allPosts,
    filterPostTypeBy: 'post',
  });
  return {
    props: {
      posts,
    },
    revalidate: 1,
  };
};

type Props = Omit<React.ComponentProps<typeof SearchLayout>, 'currentTag'>;

const Blog: NextPage<Props> = ({ posts }) => {
  return (
    <Container title={`Blog - ${BLOG.title}`}>
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </Container>
  );
};

export default Blog;
