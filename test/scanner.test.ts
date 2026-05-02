import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { scanWorkspace } from '../src/scanner.ts';

const exec = promisify(execFile);

async function git(cwd: string, args: string[]): Promise<void> {
  await exec('git', args, { cwd });
}

async function seedRepo(root: string, name: string): Promise<string> {
  const repo = join(root, name);
  await mkdir(repo, { recursive: true });
  await git(repo, ['init', '-b', 'main']);
  await git(repo, ['config', 'user.email', 'ossmeter@example.test']);
  await git(repo, ['config', 'user.name', 'ossmeter test']);
  await writeFile(join(repo, 'README.md'), `# ${name}\n`);
  await writeFile(join(repo, 'package.json'), '{"name":"fixture"}\n');
  await mkdir(join(repo, 'test'));
  await writeFile(join(repo, 'test', 'sample.test.js'), 'assert(true);\n');
  await git(repo, ['add', '.']);
  await git(repo, ['commit', '-m', 'initial']);
  return repo;
}

test('scanWorkspace aggregates commits, branches, quality and dirty state', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ossmeter-scan-'));
  const repo = await seedRepo(root, 'repo-alpha');
  await writeFile(join(repo, 'draft.txt'), 'untracked\n');

  const report = await scanWorkspace({ workspace: root, includeAllTime: true });
  assert.equal(report.summary.repositoriesScanned, 1);
  assert.equal(report.summary.totalCommits, 1);
  assert.equal(report.summary.reposTouched, 1);
  assert.equal(report.summary.reposWithUncommittedWork, 1);
  assert.equal(report.repositories[0]?.untrackedFiles, 1);
  assert.ok((report.repositories[0]?.quality.score ?? 0) >= 60);
});
