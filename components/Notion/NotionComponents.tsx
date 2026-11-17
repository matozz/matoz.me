import type { NotionComponents as NotionComponentType } from 'react-notion-x';

import dynamic from 'next/dynamic';

const Code = dynamic(() => import('./Code').then((module) => module.Code));
const Collection = dynamic(() =>
  import('react-notion-x/third-party/collection').then((module) => module.Collection),
);
const Equation = dynamic(() =>
  import('react-notion-x/third-party/equation').then((module) => module.Equation),
);
const Pdf = dynamic(() => import('react-notion-x/third-party/pdf').then((module) => module.Pdf), {
  ssr: false,
});
const Tweet = dynamic(() =>
  import('react-tweet-embed').then((module) => {
    const TweetEmbed = module.default;
    return function Tweet({ id }: { id: string }) {
      return <TweetEmbed tweetId={id} options={{ theme: 'dark' }} />;
    };
  }),
);

export const NotionComponents: Partial<NotionComponentType> = {
  Code,
  Collection,
  Equation,
  Pdf,
  Tweet,
};
