import type { ExtendedRecordMap } from 'notion-types';
import { parsePageId } from 'notion-utils';

export const getAllPageIds = (
  collectionQuery: ExtendedRecordMap['collection_query'],
  viewId?: string,
  collectionId?: string,
): string[] => {
  const collections = collectionId
    ? [collectionQuery?.[parsePageId(collectionId) ?? collectionId] ?? {}]
    : Object.values(collectionQuery ?? {});
  const ids = new Set<string>();

  for (const views of collections) {
    const results = viewId ? [views[parsePageId(viewId) ?? viewId]] : Object.values(views);
    for (const result of results) {
      if (!result) continue;
      const groups = result.groupResults?.flatMap((group) => group.blockIds ?? []) ?? [];
      const pageIds = [
        ...(result.blockIds ?? []),
        ...(result.collection_group_results?.blockIds ?? []),
        ...(result.reducerResults?.collection_group_results?.blockIds ?? []),
        ...groups,
      ];
      for (const id of pageIds) ids.add(id);
    }
  }
  return [...ids];
};
