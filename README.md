# matoz.me

Personal website and Notion-powered blog built with Next.js Pages Router, React, and Tailwind CSS.

## Development

Use Node.js 26 LTS and the pnpm version pinned in `package.json`:

```sh
nvm install
npm install --global pnpm@12.21.0
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `NOTION_PAGE_ID` in `.env.local` to the database ID or its full Notion URL. The development server runs at <http://localhost:8888>.

## Notion

Publish the database and article pages to the web. The database schema uses these property names (case insensitive):

| Property      | Type             | Purpose                                     |
| ------------- | ---------------- | ------------------------------------------- |
| title         | Title            | Article heading                             |
| slug          | Text             | Unique URL segment                          |
| type          | Select           | `Post` or `Page`                            |
| status        | Select or Status | `Published` makes content visible           |
| date          | Date             | Publication date; defaults to creation time |
| summary       | Text             | Article preview and search                  |
| tags          | Multi-select     | Tag filtering and search                    |
| link          | URL              | External article destination                |
| thumbnail_url | URL              | Optional article image                      |

Pages are published when their title and slug are present, status is `Published`, and their publication date is before tomorrow. Standard pages are served at `/:slug`; posts at `/posts/:slug`. `/posts` supports text search and tags. `/feed` returns the ten latest posts.

The renderer uses `notion-client` with Notion's web API at `app.notion.com/api/v3`. `NOTION_ACCESS_TOKEN` accepts an optional `token_v2` session cookie for private databases. Keep this cookie in server environment variables. Public databases work with `NOTION_PAGE_ID` alone.

Notion 8 supports nested record wrappers and current collection pointers. Database responses are shared for 30 seconds; pages regenerate every 60 seconds. Failed requests are retried on the next load and ISR retains the previous successful page.

## Validation

```sh
pnpm check                 # lint, TypeScript 7, regression tests, formatting
pnpm build                 # production build with the configured Notion database
pnpm exec playwright install chromium
pnpm test:e2e              # desktop and mobile tests against the production build
pnpm audit --prod
```

Browser tests use the configured database and verify rendered articles, About, tags, search, theme persistence, server-rendered HTML, RSS, and missing pages.

TypeScript 7 provides the native `tsc` command through the `typescript-native` alias. The `typescript` alias supplies Microsoft's TypeScript 6 API compatibility package for Next.js and ESLint, following the [TypeScript migration guide](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0). React/import/accessibility ESLint plugins currently declare peer support through ESLint 9; their ESLint 10 peer ranges are explicitly allowed in `pnpm-workspace.yaml` and validated by `pnpm lint`.
