import classNames from 'classnames';

import Link from 'next/link';

import { getTagDataBySlug, isTagSlug } from '@/lib/tags';

type Props = {
  tag: string;
};

export const TagItem: React.FC<Props> = ({ tag }) => {
  const tagSlug = isTagSlug(tag) ? tag : undefined;

  if (!tagSlug) {
    return null;
  }

  const tagData = getTagDataBySlug(tagSlug);

  return (
    <Link href={`/tags/${encodeURIComponent(tag)}`}>
      <div className="mr-1 flex items-center rounded-full border px-2 py-1 text-sm leading-none dark:border-gray-600">
        <p
          className={classNames({
            'ml-1': !!tagData?.emoji,
          })}
        >
          {tagData?.name ?? tag}
        </p>
      </div>
    </Link>
  );
};
