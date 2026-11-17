import { NotionAPI } from 'notion-client';
import type { ExtendedRecordMap } from 'notion-types';
import { parsePageId } from 'notion-utils';

const api = new NotionAPI({
  authToken: process.env.NOTION_ACCESS_TOKEN || undefined,
  ofetchOptions: { timeout: 30_000 },
});

// Share in-flight requests and keep signed asset URLs fresh during ISR.
const pages = new Map<string, { expires: number; promise: Promise<ExtendedRecordMap> }>();
const CACHE_TTL = 30_000;

export const getNotionPage = (pageId: string): Promise<ExtendedRecordMap> => {
  const id = parsePageId(pageId);
  if (!id) {
    throw new Error('Set NOTION_PAGE_ID to a valid Notion database ID or URL.');
  }

  const cached = pages.get(id);
  if (cached && cached.expires > Date.now()) return cached.promise;

  const promise = api.getPage(id, { throwOnCollectionErrors: true }).then(
    (recordMap) => {
      const entry = pages.get(id);
      if (entry?.promise === promise) entry.expires = Date.now() + CACHE_TTL;
      return recordMap;
    },
    (error: unknown) => {
      if (pages.get(id)?.promise === promise) pages.delete(id);
      throw error;
    },
  );
  for (const [key, entry] of pages) {
    if (entry.expires <= Date.now()) pages.delete(key);
  }
  pages.set(id, { expires: Infinity, promise });
  return promise;
};
