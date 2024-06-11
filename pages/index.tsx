import { NextPage } from 'next';

import BLOG from '@/blog.config';
import { Container } from '@/components';
import FlipWords from '@/components/FlipWords';
import LinkPreview from '@/components/LinkPreview';
import { YoutubeIcon, XIcon, GithubIcon, GumroadIcon, BilibiliIcon } from '@/lib/icon';

const Blog: NextPage = () => {
  return (
    <Container title={BLOG.title} description={BLOG.description}>
      <div className="mt-10 text-gray-600 dark:text-gray-400 md:mt-0">
        <h1 className="mb-6 text-4xl font-semibold dark:text-white">Matoz</h1>
        <div className="my-6">
          {`Hey, I am Matoz, a `}
          <FlipWords words={['frontend developer.', 'music producer.']} />
        </div>

        <div className="my-6">
          {`If you are curious about the open source projects I work on, you can find them on my `}

          <LinkPreview
            url="https://github.com/matozz"
            icon={<GithubIcon height={14} className="text-black dark:text-white" />}
            className="text-gray-700 dark:text-gray-300"
          >
            GitHub
          </LinkPreview>

          {` profile. I enjoy discussing technology and often share articles and insights on `}

          <LinkPreview url="https://twitter.com/_matozz">
            <XIcon height={12} className="text-black dark:text-gray-200" />
          </LinkPreview>

          {`. My `}

          <LinkPreview
            url="https://www.instagram.com/matozmusic"
            className="bg-gradient-to-br from-purple-500 to-orange-500 bg-clip-text text-transparent"
          >
            Instagram
          </LinkPreview>

          {` feed is where I post snapshots of my daily life and my musical journey, offering glimpses
          into my personal interests.`}
        </div>

        <div className="my-6">
          {`For those who love music production and want to learn more, check out my `}

          <LinkPreview
            url="https://www.youtube.com/channel/UCOuYh9OBqmZrNEk3eUC9XKg"
            icon={<YoutubeIcon height={14} />}
            className="text-red-600"
          >
            YouTube
          </LinkPreview>

          {` and `}

          <LinkPreview
            url="https://space.bilibili.com/35815755"
            icon={<BilibiliIcon height={14} className="text-blue-500" />}
            className="text-blue-500"
          >
            哔哩哔哩
          </LinkPreview>

          {` channels for tutorials and music-making videos. And, if you're looking to get your hands
          on some of my music templates, head over to `}

          <LinkPreview
            url="https://matoz.gumroad.com"
            icon={<GumroadIcon height={14} className="text-pink-400" />}
            className="text-pink-400"
          >
            Gumroad
          </LinkPreview>

          {` where they are available for purchase.`}
        </div>

        <div className="my-6">{`Connect with me and let's inspire each other!`}</div>
      </div>
    </Container>
  );
};

export default Blog;
