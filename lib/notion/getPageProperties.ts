import type { BlockMap, CollectionPropertySchemaMap } from 'notion-types';
import { getBlockValue, getDateValue, getTextContent } from 'notion-utils';

import type { Post } from '@/types';

export const getPageProperties = (
  id: string,
  blocks: BlockMap,
  schema: CollectionPropertySchemaMap,
): Post | null => {
  const block = getBlockValue(blocks[id]);
  if (!block || block.type !== 'page' || !block.alive) return null;

  const properties: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(block.properties ?? {})) {
    const field = schema[key];
    if (!field) continue;
    const name = field.name.toLowerCase();
    if (field.type === 'date') {
      const date = getDateValue(value);
      if (date) properties[name] = { start_date: date.start_date };
    } else if (['select', 'multi_select', 'status'].includes(field.type)) {
      properties[name] = getTextContent(value)
        .split(',')
        .map((option) => option.trim())
        .filter(Boolean);
    } else if (['title', 'text', 'url', 'email', 'phone_number'].includes(field.type)) {
      properties[name] = getTextContent(value);
    }
  }

  return {
    ...properties,
    id,
    date: properties.date ?? {},
    createdTime: new Date(block.created_time).toISOString(),
    fullWidth: block.format?.page_full_width ?? false,
    thumbnail_url: properties.thumbnail_url ?? '',
  } as Post;
};
