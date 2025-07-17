import { useMemo } from 'react';

import classNames from 'classnames';

import Link from 'next/link';

import { getTagDataBySlug, isTagSlug } from '@/lib/tags';

type Props =
  | { tagKey: string; selected: boolean; count: number }
  | { tagKey: string; selected: boolean; root: boolean };

export const TagTabItem: React.FC<Props> = ({ tagKey, selected, ...rest }) => {
  const tagSlug = isTagSlug(tagKey) ? tagKey : undefined;

  const linkUrl = useMemo(() => {
    if (selected || !('count' in rest)) {
      return '/';
    }
    return `/tags/${encodeURIComponent(tagSlug || '')}`;
  }, [rest, selected, tagSlug]);

  if (!tagSlug) return null;

  const tagData = getTagDataBySlug(tagSlug);

  return (
    <li
      className={classNames('mr-3 block min-w-max rounded-lg font-bold whitespace-nowrap', {
        'border-gray-100 text-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700':
          !selected,
        'dark:text-night bg-gray-200 text-gray-700': selected,
      })}
    >
      <Link href={linkUrl} scroll={false} className="flex items-center px-4 py-2" passHref>
        <span className={classNames({ 'ml-2': !!tagData?.emoji })}>
          {'count' in rest
            ? `${tagData?.name ?? tagKey} (${rest.count})`
            : `${tagData?.name ?? tagKey}`}
        </span>
      </Link>
    </li>
  );
};
