import { expect, test } from '@playwright/test';

import type { Post } from '../../types';

const readPosts = async (html: string): Promise<Post[]> => {
  const data = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (!data) throw new Error('Missing prerendered page data');
  return JSON.parse(data[1]).props.pageProps.posts;
};

test('renders homepage and SEO before JavaScript runs', async ({ request, browser }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('Hey, I am Matoz');
  expect(html).toContain('name="description"');
  expect(html).toContain('rel="canonical"');
  expect(html).not.toContain('nofollow');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8888/');
  await expect(page.getByRole('heading', { name: /Matoz/ })).toBeVisible();
  await context.close();
});

test('renders real Notion articles, code and About without hydration errors', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|did not match/i.test(message.text()))
      errors.push(message.text());
  });
  const posts = await readPosts(await (await request.get('/posts')).text());
  expect(posts.length).toBeGreaterThan(0);
  const post = posts.find((post) => !post.link)!;
  await page.goto(`/posts/${post.slug}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title!);
  await expect(page.locator('.notion')).toBeVisible();
  await expect(page.locator('.notion')).not.toBeEmpty();
  await page.goto('/about');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('.notion')).not.toBeEmpty();
  expect(errors).toEqual([]);
});

test('searches title, summary and tags and opens arbitrary Notion tags', async ({
  page,
  request,
}) => {
  const posts = await readPosts(await (await request.get('/posts')).text());
  await page.goto('/posts');
  const input = page.getByRole('textbox');
  const post = posts.find((post) => post.summary && post.tags?.length)!;
  await input.fill(post.summary!.slice(0, 12));
  await expect(page.getByRole('heading', { name: post.title, exact: true })).toBeVisible();
  await input.fill('search-term-with-no-matching-article-9723');
  await expect(page.locator('.article-container article')).toHaveCount(0);
  await input.fill('');
  const tag = post.tags![0];
  await page.goto(`/tags/${encodeURIComponent(tag)}`);
  await expect(page.getByRole('textbox')).toBeVisible();
  await expect(page.locator('.article-container article')).toHaveCount(
    posts.filter((post) => post.tags?.includes(tag)).length,
  );
  await page.getByRole('link', { name: 'All', exact: true }).click();
  await expect(page).toHaveURL(/\/posts$/);
});

test('persists theme and applies Tailwind colors without horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle Dark Mode' }).click();
  const dark = await page.locator('html').evaluate((html) => html.classList.contains('dark'));
  await page.reload();
  await expect(page.locator('html')).toHaveClass(dark ? /dark/ : /light/);
  expect(
    await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor),
  ).toBe(dark ? 'rgb(24, 24, 27)' : 'rgb(255, 255, 255)');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('serves RSS with articles and returns 404 for missing content', async ({ request }) => {
  const feed = await request.get('/feed');
  expect(feed.status()).toBe(200);
  expect(feed.headers()['content-type']).toContain('application/rss+xml');
  const xml = await feed.text();
  expect(xml).toContain('<rss');
  expect(xml).toContain('<item>');
  expect(xml).not.toContain('/posts/about');
  expect((await request.get('/posts/missing-article-9723')).status()).toBe(404);
  expect((await request.get('/tags/missing-tag-9723')).status()).toBe(404);
  expect((await request.get('/missing-page-9723')).status()).toBe(404);
});

test('hydrates every published local article', async ({ page, request }) => {
  test.setTimeout(90_000);
  const posts = await readPosts(await (await request.get('/posts')).text());
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`${page.url()}: ${error.message}`));
  for (const post of posts.filter((post) => !post.link)) {
    const response = await page.goto(`/posts/${post.slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title!);
    await expect(page.locator('.notion')).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/light|dark/);
  }
  expect(errors).toEqual([]);
});
