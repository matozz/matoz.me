import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { Container } from '@/components';
import { SearchLayout } from '@/layouts';
import { getTagDataBySlug, isTagSlug } from '@/lib';
import { filterPublishedPosts, getAllPosts, getAllTags } from '@/lib/notion';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const currentTag = typeof params?.tag === 'string' ? params.tag : '';

  if (!currentTag) {
    return {
      notFound: true,
    };
  }

  const allPosts = await getAllPosts();

  const posts = filterPublishedPosts({
    posts: allPosts,
    filterPostTypeBy: 'post',
  });
  const tags = getAllTags({ posts });
  if (!Object.hasOwn(tags, currentTag)) return { notFound: true, revalidate: 60 };
  const filteredPosts = posts.filter((post) => post?.tags?.includes(currentTag));
  return {
    props: {
      tags,
      posts: filteredPosts,
      currentTag,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts({ filterPostTypeBy: 'post' });
  const tags = getAllTags({ posts });
  return {
    paths: Object.keys(tags).map((tag) => ({ params: { tag } })),
    fallback: 'blocking',
  };
};

type Props = React.ComponentProps<typeof SearchLayout>;

const TagPage: NextPage<Props> = ({ tags, posts, currentTag }) => (
  <Container
    title={currentTag && isTagSlug(currentTag) ? getTagDataBySlug(currentTag).name : currentTag}
    isTagPage
    slug={currentTag}
  >
    <SearchLayout tags={tags} posts={posts} currentTag={currentTag} />
  </Container>
);

export default TagPage;
