import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import { Layout } from '@/layouts/layout';
import { getAllPosts, getPostBlocks } from '@/lib/notion';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts({ filterPostTypeBy: 'post' });

  if (!posts) {
    return { paths: [], fallback: false };
  }

  const publishPosts = posts.filter((post) => post?.status?.[0] === 'Published');

  return {
    paths: publishPosts.map((row) => `/posts/${row.slug}`),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;
  const posts = await getAllPosts({ filterPostTypeBy: 'post' });
  const post = posts.find((t) => t.slug === slug);

  if (!post?.id) {
    return { notFound: true, revalidate: 60 };
  }

  const blockMap = await getPostBlocks(post.id);

  return {
    props: { post, blockMap },
    revalidate: 60,
  };
};

type Props = Omit<React.ComponentProps<typeof Layout>, 'fullWidth'>;

const Post: NextPage<Props> = ({ post, blockMap }) => {
  const router = useRouter();

  if (!post) {
    return <DefaultErrorPage statusCode={404} />;
  }

  const slug = router.query?.slug;

  return (
    <Layout
      blockMap={blockMap}
      post={post}
      fullWidth={post?.fullWidth ?? false}
      slug={typeof slug === 'string' ? slug : null}
    />
  );
};

export default Post;
