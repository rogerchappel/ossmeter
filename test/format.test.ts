import test from 'node:test';
import assert from 'node:assert/strict';
import { formatMarkdown, formatTable } from '../src/format.ts';
import type { ScanReport } from '../src/models.ts';

const report: ScanReport = {
  summary: {
    workspace: '/tmp/workspace',
    generatedAt: '2026-05-02T00:00:00.000Z',
    since: null,
    includeAllTime: true,
    repositoriesScanned: 1,
    reposTouched: 1,
    totalCommits: 2,
    totalBranches: 1,
    totalFilesChanged: 3,
    totalAdditions: 10,
    totalDeletions: 2,
    reposWithUncommittedWork: 1,
    averageQualityScore: 80
  },
  repositories: [{
    name: 'repo-a',
    path: '/tmp/workspace/repo-a',
    branch: 'main',
    isGitRepository: true,
    commits: 2,
    branches: 1,
    filesChanged: 3,
    additions: 10,
    deletions: 2,
    hasUncommittedWork: true,
    untrackedFiles: 1,
    modifiedFiles: 1,
    stagedFiles: 0,
    quality: { score: 80, hasTests: true, hasCi: true, hasReadme: true, hasLicense: false, hasPackageMetadata: true },
    warnings: []
  }]
};

test('formatTable renders summary and dirty worktree state', () => {
  const output = formatTable(report);
  assert.match(output, /1 repos, 1 touched, 2 commits/);
  assert.match(output, /repo-a/);
  assert.match(output, /1 modified, 1 untracked/);
});

test('formatMarkdown renders automation-friendly metric table', () => {
  const output = formatMarkdown(report);
  assert.match(output, /# ossmeter scan/);
  assert.match(output, /\| repo-a \| main \| 2 \|/);
});
