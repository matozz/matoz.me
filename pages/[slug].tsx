import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import { Layout } from '@/layouts/layout';
import { getAllPosts, getPostBlocks } from '@/lib/notion';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts({ filterPostTypeBy: 'page' });

  if (!posts) {
    return { paths: [], fallback: false };
  }

  const publishPosts = posts.filter((post) => post?.status?.[0] === 'Published');

  return {
    paths: publishPosts.map((row) => `/${row.slug}`),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;
  const posts = await getAllPosts();
  const post = posts.find((t) => t.slug === slug && t.type?.[0] === 'Page');

  if (!post?.id) {
    if (!posts.some((post) => post.slug === slug && post.type?.[0] === 'Post')) {
      return { notFound: true, revalidate: 60 };
    }
    return {
      redirect: {
        destination: `/posts/${slug}`,
        permanent: true,
      },
    };
  }

  const blockMap = await getPostBlocks(post.id);

  return {
    props: { post, blockMap },
    revalidate: 60,
  };
};

type Props = Omit<React.ComponentProps<typeof Layout>, 'fullWidth'>;

const Page: NextPage<Props> = ({ post, blockMap }) => {
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

export default Page;
