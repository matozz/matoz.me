import type { ExtendedRecordMap } from 'notion-types';
import { getBlockCollectionId, getBlockValue, parsePageId } from 'notion-utils';

import BLOG from '@/blog.config';
import type { Post } from '@/types';

import { getNotionPage } from './client';
import { filterPublishedPosts } from './filterPublishedPosts';
import { getAllPageIds } from './getAllPageIds';
import { getPageProperties } from './getPageProperties';

type GetAllPostsParams = { filterPostTypeBy?: 'page' | 'post' };

// Kept pure so response format changes can be regression-tested without network access.
export const getPostsFromRecordMap = (
  recordMap: ExtendedRecordMap,
  pageId: string,
  props?: GetAllPostsParams,
): Post[] => {
  const id = parsePageId(pageId);
  const root = id ? getBlockValue(recordMap.block[id]) : undefined;
  if (!root || (root.type !== 'collection_view_page' && root.type !== 'collection_view')) {
    throw new Error(
      'NOTION_PAGE_ID must point to an accessible Notion database published to the web.',
    );
  }

  const collectionId = getBlockCollectionId(root, recordMap);
  const collection = collectionId ? getBlockValue(recordMap.collection[collectionId]) : undefined;
  if (!collection || !collectionId) {
    throw new Error(
      'Notion database schema is unavailable. Check database publishing and access permissions.',
    );
  }
  if (!recordMap.collection_query[collectionId]) {
    throw new Error(
      'Notion database query is unavailable. Check that the database has an accessible published view.',
    );
  }

  const pageIds = getAllPageIds(recordMap.collection_query, undefined, collectionId);
  const posts = pageIds
    .map((id) => getPageProperties(id, recordMap.block, collection.schema))
    .filter((post): post is Post => post !== null);
  const published = filterPublishedPosts({ posts, filterPostTypeBy: props?.filterPostTypeBy });

  if (BLOG.sortByDate) {
    published.sort(
      (a, b) =>
        new Date(b.date.start_date || b.createdTime).getTime() -
        new Date(a.date.start_date || a.createdTime).getTime(),
    );
  }
  return published;
};

export const getAllPosts = async (props?: GetAllPostsParams): Promise<Post[]> => {
  const id = process.env.NOTION_PAGE_ID ?? '';
  const recordMap = await getNotionPage(id);
  return getPostsFromRecordMap(recordMap, id, props);
};
