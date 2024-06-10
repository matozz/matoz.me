import { NextPage } from 'next';

import BLOG from '@/blog.config';
import { Container } from '@/components';

const Blog: NextPage = () => {
  return (
    <Container title={BLOG.title} description={BLOG.description}>
      <h1 className="mb-6 text-4xl font-semibold dark:text-white">Matoz</h1>
      <span className="text-gray-600 dark:text-gray-400">
        Hey, I am Matoz, a frontend developer.
      </span>
    </Container>
  );
};

export default Blog;
