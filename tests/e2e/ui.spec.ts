import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const articlePath = '/posts/auto-text-color';

for (const theme of ['light', 'dark']) {
  test(`blog, tags and articles remain accessible in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
    for (const path of [
      '/posts',
      '/tags/CSS',
      articlePath,
      '/posts/react-devtools',
      '/about',
      '/missing-page-9723',
    ]) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveClass(new RegExp(theme));
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .exclude('iframe')
        .analyze();
      expect(
        result.violations.map(({ id, nodes }) => ({
          id,
          targets: nodes.map((node) => node.target),
        })),
        path,
      ).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        path,
      ).toBe(true);
      expect(
        await page
          .getByRole('heading', { level: 1 })
          .evaluate((heading) => heading.scrollWidth <= heading.clientWidth + 1),
        path,
      ).toBe(true);
    }
  });
}

test('search recovery works with Escape and a visible empty-state action', async ({ page }) => {
  await page.goto('/posts');
  const input = page.getByRole('textbox', { name: 'Search articles' });
  await input.fill('no-matching-article-82739');
  await expect(page.getByText('No articles found', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search', exact: true }).last().click();
  await expect(input).toBeFocused();
  await expect(page.locator('.article-container article')).not.toHaveCount(0);
  await input.fill('another-no-match-82739');
  await input.press('Escape');
  await expect(input).toHaveValue('');
  await expect(page.locator('[role="status"]').first()).toContainText(
    `${await page.locator('.article-container article').count()} articles`,
  );
});

test('topic filters stay visible and navigation marks article routes as Blog', async ({ page }) => {
  await page.goto('/posts');
  const filters = page.getByRole('navigation', { name: 'Article topics' });
  for (const link of await filters.getByRole('link').all()) {
    expect(
      await link.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= innerWidth;
      }),
    ).toBe(true);
  }
  await filters.getByRole('link', { name: 'CSS 2', exact: true }).click();
  await expect(page).toHaveURL(/\/tags\/CSS$/);
  await expect(page.getByRole('link', { name: 'CSS 2', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.goto(articlePath);
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Blog', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});

test('code copy is keyboard accessible and copies the displayed content', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(articlePath);
  const figure = page.locator('.notion-code-block').first();
  const button = figure.getByRole('button', { name: 'Copy code', exact: true });
  await button.focus();
  await expect(button).toBeFocused();
  await button.press('Enter');
  await expect(figure.getByRole('status')).toHaveText('Code copied to clipboard.');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe(await figure.locator('code').textContent());
  await expect(figure.locator('.token').first()).toBeVisible();
});

test('skip link reaches content and ambient effects stay on the homepage', async ({ page }) => {
  await page.goto('/posts');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('.magnet-bg')).toHaveCount(0);
  await page.goto('/');
  await expect(page.locator('.magnet-bg')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: /Matoz.*Bytedance/ })).toBeVisible();
});

test('article headings occupy separate lines and consecutive lists read compactly', async ({
  page,
}) => {
  await page.goto(articlePath);
  const headings = await page.locator('.notion-h').evaluateAll((elements) =>
    elements.slice(0, 2).map((element) => {
      const { top, bottom } = element.getBoundingClientRect();
      return { top, bottom };
    }),
  );
  expect(headings).toHaveLength(2);
  expect(headings[1].top).toBeGreaterThanOrEqual(headings[0].bottom);

  const listRows = await page
    .locator('.notion-list li')
    .evaluateAll((elements) =>
      elements.slice(0, 3).map((element) => element.getBoundingClientRect().top),
    );
  expect(listRows).toHaveLength(3);
  for (let index = 1; index < listRows.length; index++) {
    expect(listRows[index] - listRows[index - 1]).toBeLessThanOrEqual(36);
  }
});

test('unavailable article images retain their source and successful images render normally', async ({
  page,
}) => {
  const source = 'https://img.soft10.net/20220929/25dd41fdbe830a289f745de2ce9cc363.png';
  await page.route('https://img.soft10.net/**', (route) => route.abort());
  await page.goto('/posts/react-devtools');
  const fallback = page.locator('.notion-image-fallback').first();
  await expect(fallback).toContainText('Image unavailable');
  await expect(fallback.getByRole('link', { name: 'Open original' })).toHaveAttribute(
    'href',
    source,
  );
  await expect(page.locator(`img[src="${source}"]`)).toHaveCount(0);

  await page.route(source, (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#64748b"/></svg>',
    }),
  );
  await page.reload();
  const image = page.locator(`img[src="${source}"]`);
  await expect(image).toBeVisible();
  await expect
    .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
    .toBe(400);
});
