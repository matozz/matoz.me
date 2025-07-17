import { NextPage } from 'next';

import Link from 'next/link';

import BLOG from '@/blog.config';
import { Container } from '@/components';
import FlipWords from '@/components/FlipWords';
import LinkPreview from '@/components/LinkPreview';
import { YoutubeIcon, XIcon, GithubIcon, GumroadIcon, BilibiliIcon } from '@/lib/icon';

const Blog: NextPage = () => {
  return (
    <Container title={BLOG.title} description={BLOG.description}>
      <div className="mt-10 text-neutral-600 md:mt-0 dark:text-neutral-400">
        <h1 className="mb-6 text-4xl font-semibold text-neutral-800 dark:text-neutral-100">
          {`Matoz `}
          <span className="my-6 font-mono text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {`@${BLOG.company}`}
          </span>
        </h1>

        <div className="my-6">
          {`Hey, I am Matoz, a`}&nbsp;
          <FlipWords words={['frontend developer.', 'music producer.']} className="font-medium" />
        </div>

        <div className="my-6">
          {`If you are curious about the open source projects I work on, you can find them on my `}

          <LinkPreview
            name="GitHub"
            url="https://github.com/matozz"
            icon={<GithubIcon height={14} className="text-black dark:text-neutral-100" />}
            className="text-neutral-700 dark:text-neutral-300"
          >
            GitHub
          </LinkPreview>

          {` profile. I enjoy discussing technology and often share articles and insights on `}

          <LinkPreview name="X" url="https://twitter.com/_matozz">
            <XIcon height={12} className="text-black dark:text-neutral-100" />
          </LinkPreview>

          {`. My `}

          <LinkPreview
            name="Instagram"
            url="https://www.instagram.com/matozmusic"
            className="bg-linear-to-br from-purple-500 to-orange-500 bg-clip-text text-transparent"
          >
            Instagram
          </LinkPreview>

          {` feed is where I post snapshots of my daily life and my musical journey, offering glimpses
          into my personal interests.`}
        </div>

        <div className="my-6">
          {`For those who love music production and want to learn more, check out my `}

          <LinkPreview
            name="YouTube"
            url="https://www.youtube.com/channel/UCOuYh9OBqmZrNEk3eUC9XKg"
            icon={<YoutubeIcon height={14} />}
            className="text-red-500"
          >
            YouTube
          </LinkPreview>

          {` and `}

          <LinkPreview
            name="哔哩哔哩"
            url="https://space.bilibili.com/35815755"
            icon={<BilibiliIcon height={14} />}
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

        <div className="my-6">
          {`Connect me on `}
          <Link href={`mailto:${BLOG.email}`}>
            <span className="font-mono text-neutral-700 underline decoration-neutral-300 transition-all hover:decoration-neutral-500 dark:text-neutral-300 dark:decoration-neutral-600 dark:hover:decoration-neutral-400">
              {BLOG.email}
            </span>
          </Link>
          {` and let's inspire each other!`}
        </div>
      </div>
    </Container>
  );
};

export default Blog;
