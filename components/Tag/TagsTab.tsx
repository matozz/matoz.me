import type { TagObj } from '@/types';

import { TagTabItem } from './TagTabItem';

type Props = { tags: TagObj; currentTag?: string };

export const Tags = ({ tags, currentTag }: Props) => (
  <nav aria-label="Article topics">
    <ul className="flex flex-wrap gap-2">
      <TagTabItem tagKey="all" selected={!currentTag} root />
      {Object.entries(tags ?? {}).map(([tag, count]) => (
        <TagTabItem key={tag} tagKey={tag} selected={tag === currentTag} count={count} />
      ))}
    </ul>
  </nav>
);
