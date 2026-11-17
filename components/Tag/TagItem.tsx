import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { getTagDataBySlug, isTagSlug } from '@/lib/tags';

export const TagItem = ({ tag }: { tag: string }) => (
  <Badge variant="outline" asChild>
    <Link href={`/tags/${encodeURIComponent(tag)}`}>
      {isTagSlug(tag) ? getTagDataBySlug(tag).name : tag}
    </Link>
  </Badge>
);
