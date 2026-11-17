import { afterEach, mock, test } from 'node:test';
import type {
  Block,
  Collection,
  CollectionQueryResult,
  ExtendedRecordMap,
  NotionMapBox,
} from 'notion-types';
import { getBlockValue } from 'notion-utils';

import assert from 'node:assert/strict';

import { filterPublishedPosts } from '../lib/notion/filterPublishedPosts';
import { getAllPageIds } from '../lib/notion/getAllPageIds';
import { getPostsFromRecordMap } from '../lib/notion/getAllPosts';
import { getAllTags } from '../lib/notion/getAllTags';
import { prepareRecordMap } from '../lib/notion/prepareRecordMap';

const databaseId = '11111111-1111-1111-1111-111111111111';
const collectionId = '22222222-2222-2222-2222-222222222222';
const viewId = '33333333-3333-3333-3333-333333333333';
const postId = '44444444-4444-4444-4444-444444444444';
const nested = <T>(value: T): NotionMapBox<T> => ({
  role: 'reader',
  value: { role: 'reader', value },
});
const query = (result: Partial<CollectionQueryResult>) => result as CollectionQueryResult;

const fixture = (): ExtendedRecordMap => ({
  block: {
    [databaseId]: nested({
      id: databaseId,
      type: 'collection_view_page',
      format: { collection_pointer: { id: collectionId, table: 'collection' } },
    } as unknown as Block),
    [postId]: nested({
      id: postId,
      type: 'page',
      alive: true,
      created_time: Date.parse('2024-01-01T00:00:00Z'),
      properties: {
        title: [['Published article']],
        slug: [['hello-world']],
        status: [['Published']],
        type: [['Post']],
        tags: [['CSS, React']],
      },
      format: { page_full_width: true },
    } as unknown as Block),
  },
  collection: {
    [collectionId]: nested({
      id: collectionId,
      schema: {
        title: { name: 'Title', type: 'title' },
        slug: { name: 'slug', type: 'text' },
        status: { name: 'status', type: 'status' },
        type: { name: 'type', type: 'select' },
        tags: { name: 'tags', type: 'multi_select' },
      },
    } as unknown as Collection),
  },
  collection_query: {
    [collectionId]: {
      [viewId]: query({
        collection_group_results: { type: 'results', blockIds: [postId], hasMore: false },
      }),
    },
  },
  collection_view: {},
  notion_user: {},
  signed_urls: {},
});

afterEach(() => mock.timers.reset());

test('reads nested Notion records, collection pointers, status properties and missing dates', () => {
  const posts = getPostsFromRecordMap(fixture(), databaseId);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].slug, 'hello-world');
  assert.equal(posts[0].title, 'Published article');
  assert.deepEqual(posts[0].tags, ['CSS', 'React']);
  assert.deepEqual(posts[0].date, {});
  assert.equal(posts[0].fullWidth, true);
  assert.doesNotThrow(() => JSON.stringify(posts));
});

test('reads legacy single-layer records and a Notion URL', () => {
  const map = fixture();
  map.block = Object.fromEntries(
    Object.entries(map.block).map(([id, record]) => [
      id,
      { role: 'reader' as const, value: getBlockValue(record)! },
    ]),
  );
  assert.equal(
    getPostsFromRecordMap(
      map,
      `https://www.notion.so/${databaseId.replaceAll('-', '')}?v=${viewId}`,
    ).length,
    1,
  );
});

test('normalizes UUIDs and reads a requested view without corrupting the ID', () => {
  const map = fixture();
  assert.deepEqual(getAllPageIds(map.collection_query, viewId, collectionId), [postId]);
  assert.deepEqual(
    getAllPageIds(
      map.collection_query,
      viewId.replaceAll('-', ''),
      collectionId.replaceAll('-', ''),
    ),
    [postId],
  );
});

test('collects and deduplicates direct, grouped and reducer results across views', () => {
  const results = {
    [collectionId]: {
      [viewId]: query({
        blockIds: ['a'],
        groupResults: [{ blockIds: ['b', 'a'] }] as CollectionQueryResult['groupResults'],
      }),
      other: query({
        reducerResults: {
          collection_group_results: { type: 'results', blockIds: ['c', 'b'], hasMore: false },
        },
      }),
    },
    unrelated: { other: query({ blockIds: ['d'] }) },
  };
  assert.deepEqual(getAllPageIds(results), ['a', 'b', 'c', 'd']);
  assert.deepEqual(getAllPageIds(results, undefined, collectionId), ['a', 'b', 'c']);
  assert.deepEqual(getAllPageIds({}), []);
  assert.deepEqual(getAllPageIds(results, 'missing'), []);
});

test('excludes deleted pages and unrelated embedded databases', () => {
  const map = fixture();
  const deletedId = '55555555-5555-5555-5555-555555555555';
  map.block[deletedId] = nested({ id: deletedId, type: 'page', alive: false } as unknown as Block);
  map.collection_query[collectionId][viewId].collection_group_results!.blockIds.push(deletedId);
  map.collection_query.unrelated = { other: query({ blockIds: ['missing'] }) };
  assert.equal(getPostsFromRecordMap(map, databaseId).length, 1);
});

test('reports inaccessible databases instead of publishing an empty list', () => {
  const map = fixture();
  delete map.block[databaseId];
  assert.throws(() => getPostsFromRecordMap(map, databaseId), /accessible Notion database/);
  assert.throws(
    () => getPostsFromRecordMap({ ...fixture(), collection: {} }, databaseId),
    /schema is unavailable/,
  );
  assert.throws(
    () => getPostsFromRecordMap({ ...fixture(), collection_query: {} }, databaseId),
    /query is unavailable/,
  );
});

test('filters drafts, future posts, missing slugs, and page types', () => {
  const [post] = getPostsFromRecordMap(fixture(), databaseId);
  const posts = [
    post,
    { ...post, status: ['Idea'] as ['Idea'] },
    { ...post, slug: '' },
    { ...post, date: { start_date: '2099-01-01' } },
    { ...post, type: ['Page'] as ['Page'] },
  ];
  assert.equal(filterPublishedPosts({ posts, filterPostTypeBy: 'post' }).length, 1);
  assert.equal(filterPublishedPosts({ posts, filterPostTypeBy: 'page' }).length, 1);
});

test('recalculates publication cutoff after midnight in a long-running server', () => {
  const [post] = getPostsFromRecordMap(fixture(), databaseId);
  const start = new Date(2026, 0, 1, 12).getTime();
  mock.timers.enable({ apis: ['Date'], now: start });
  const posts = [{ ...post, date: { start_date: new Date(2026, 0, 2, 12).toISOString() } }];
  assert.equal(filterPublishedPosts({ posts }).length, 0);
  mock.timers.tick(24 * 60 * 60 * 1000);
  assert.equal(filterPublishedPosts({ posts }).length, 1);
});

test('strips editor history from page data while preserving content and cached source', () => {
  const map = fixture();
  const record = map.block[postId] as unknown as Record<string, unknown>;
  record.crdt_data = { history: 'editor-only data' };
  record.crdt_format_version = 1;
  const cleaned = prepareRecordMap(map);
  assert.equal('crdt_data' in cleaned.block[postId], false);
  assert.equal('crdt_data' in record, true);
  assert.equal(getPostsFromRecordMap(cleaned, databaseId)[0].title, 'Published article');
});

test('counts arbitrary tags safely, including Object prototype names', () => {
  const [post] = getPostsFromRecordMap(fixture(), databaseId);
  const tags = getAllTags({
    posts: [
      { ...post, tags: ['CSS', '__proto__', 'constructor'] },
      { ...post, tags: ['CSS'] },
    ],
  });
  assert.equal(tags.CSS, 2);
  assert.equal(tags.__proto__, 1);
  assert.equal(tags.constructor, 1);
});
