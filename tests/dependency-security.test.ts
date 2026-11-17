import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import assert from 'node:assert/strict';

const lockfile = readFileSync(new URL('../pnpm-lock.yaml', import.meta.url), 'utf8');
const versions = (name: string) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [
    ...new Set(
      [...lockfile.matchAll(new RegExp(`^  '?${escaped}@([0-9.]+)'?:`, 'gm'))].map(
        (match) => match[1],
      ),
    ),
  ];
};

test('lockfile excludes the Babel runtime versions affected by GHSA-968p-4wvh-cqc8', () => {
  const resolved = versions('@babel/runtime');
  assert.ok(resolved.length > 0);
  for (const version of resolved) {
    const [major, minor, patch] = version.split('.').map(Number);
    assert.ok(major > 7 || (major === 7 && (minor > 26 || (minor === 26 && patch >= 10))), version);
  }
});

test('lockfile excludes minimatch versions affected by GHSA-g3hv-75wg-m249', () => {
  const resolved = versions('minimatch');
  assert.ok(resolved.length > 0);
  for (const version of resolved) {
    const [major, minor, patch] = version.split('.').map(Number);
    assert.ok(major < 7 || major > 11 || (major === 11 && (minor > 0 || patch >= 1)), version);
  }
});
