import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { discoverGitRepositories } from '../src/discover.ts';

test('discoverGitRepositories finds nested git worktrees and skips non-repos', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ossmeter-discover-'));
  await mkdir(join(root, 'repo-one', '.git'), { recursive: true });
  await mkdir(join(root, 'group', 'repo-two', '.git'), { recursive: true });
  await mkdir(join(root, 'notes'), { recursive: true });

  const repos = await discoverGitRepositories(root, 3);
  assert.equal(repos.length, 2);
  assert.ok(repos.some((repo) => repo.endsWith('repo-one')));
  assert.ok(repos.some((repo) => repo.endsWith('repo-two')));
});
