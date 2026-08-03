import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { discoverGitRepositories } from '../src/discover.ts';

const execFileAsync = promisify(execFile);

test('discoverGitRepositories finds nested repositories and skips non-repos', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ossmeter-discover-'));
  await mkdir(join(root, 'repo-one', '.git'), { recursive: true });
  await mkdir(join(root, 'group', 'repo-two', '.git'), { recursive: true });
  await mkdir(join(root, 'notes'), { recursive: true });

  const repos = await discoverGitRepositories(root, 3);
  assert.equal(repos.length, 2);
  assert.ok(repos.some((repo) => repo.endsWith('repo-one')));
  assert.ok(repos.some((repo) => repo.endsWith('repo-two')));
});

test('discoverGitRepositories finds linked worktrees but rejects arbitrary .git files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ossmeter-linked-worktree-'));
  const source = join(root, 'source');
  const workspace = join(root, 'workspace');
  const linked = join(workspace, 'linked');
  const fake = join(workspace, 'not-a-repo');

  await mkdir(source);
  await mkdir(workspace);
  await mkdir(fake);
  await execFileAsync('git', ['init', '--initial-branch=main'], { cwd: source });
  await writeFile(join(source, 'README.md'), '# fixture\n');
  await execFileAsync('git', ['add', 'README.md'], { cwd: source });
  await execFileAsync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.com', 'commit', '-m', 'Initial commit'], { cwd: source });
  await execFileAsync('git', ['worktree', 'add', '-b', 'linked', linked], { cwd: source });
  await writeFile(join(fake, '.git'), 'not git metadata\n');

  const repos = await discoverGitRepositories(workspace, 3);
  assert.deepEqual(repos, [linked]);
});
