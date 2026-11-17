import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { getTagDataBySlug, isTagSlug } from '@/lib/tags';

type Props = { tagKey: string; selected: boolean; count?: number; root?: boolean };

export const TagTabItem = ({ tagKey, selected, count, root }: Props) => {
  const name = isTagSlug(tagKey) ? getTagDataBySlug(tagKey).name : tagKey;
  return (
    <li>
      <Badge variant="filter" data-active={selected} asChild>
        <Link
          href={root ? '/posts' : `/tags/${encodeURIComponent(tagKey)}`}
          aria-current={selected ? 'page' : undefined}
        >
          {name}
          {typeof count === 'number' && <span className="tabular-nums">{count}</span>}
        </Link>
      </Badge>
    </li>
  );
};
