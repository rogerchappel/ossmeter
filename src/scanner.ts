import { basename, resolve } from 'node:path';
import { discoverGitRepositories } from './discover.js';
import { git } from './git.js';
import { collectQualitySignals } from './quality.js';
import type { RepositoryMetrics, ScanOptions, ScanReport, WorkspaceSummary } from './models.js';

function numberFrom(value: string): number {
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseStatus(porcelain: string): Pick<RepositoryMetrics, 'hasUncommittedWork' | 'modifiedFiles' | 'stagedFiles' | 'untrackedFiles'> {
  let modifiedFiles = 0;
  let stagedFiles = 0;
  let untrackedFiles = 0;
  const lines = porcelain.split('\n').filter(Boolean);
  for (const line of lines) {
    const x = line[0] ?? ' ';
    const y = line[1] ?? ' ';
    if (line.startsWith('??')) untrackedFiles += 1;
    else {
      if (x !== ' ') stagedFiles += 1;
      if (y !== ' ') modifiedFiles += 1;
    }
  }
  return { hasUncommittedWork: lines.length > 0, modifiedFiles, stagedFiles, untrackedFiles };
}

function commitArgs(options: ScanOptions): string[] {
  const args = ['log', '--format=%H'];
  if (!options.includeAllTime && options.since) args.push(`--since=${options.since}`);
  return args;
}

function diffArgs(options: ScanOptions): string[] {
  const args = ['log', '--numstat', '--format='];
  if (!options.includeAllTime && options.since) args.push(`--since=${options.since}`);
  return args;
}

async function countBranches(repo: string): Promise<number> {
  const branches = await git(['branch', '--format=%(refname:short)'], repo);
  return branches.stdout.split('\n').filter(Boolean).length;
}

async function collectDiffStats(repo: string, options: ScanOptions): Promise<{ filesChanged: number; additions: number; deletions: number }> {
  const diff = await git(diffArgs(options), repo);
  const files = new Set<string>();
  let additions = 0;
  let deletions = 0;
  for (const line of diff.stdout.split('\n')) {
    const [added, deleted, file] = line.split('\t');
    if (!file) continue;
    files.add(file);
    additions += added === '-' || !added ? 0 : numberFrom(added);
    deletions += deleted === '-' || !deleted ? 0 : numberFrom(deleted);
  }
  return { filesChanged: files.size, additions, deletions };
}

export async function scanRepository(repo: string, options: ScanOptions): Promise<RepositoryMetrics> {
  const warnings: string[] = [];
  const [branchResult, commitResult, branchCount, diffStats, statusResult, quality] = await Promise.all([
    git(['branch', '--show-current'], repo).catch((error) => {
      warnings.push(`branch: ${error.message}`);
      return { stdout: '', stderr: '' };
    }),
    git(commitArgs(options), repo).catch((error) => {
      warnings.push(`commits: ${error.message}`);
      return { stdout: '', stderr: '' };
    }),
    countBranches(repo).catch((error) => {
      warnings.push(`branches: ${error.message}`);
      return 0;
    }),
    collectDiffStats(repo, options).catch((error) => {
      warnings.push(`diff: ${error.message}`);
      return { filesChanged: 0, additions: 0, deletions: 0 };
    }),
    git(['status', '--porcelain=v1'], repo).catch((error) => {
      warnings.push(`status: ${error.message}`);
      return { stdout: '', stderr: '' };
    }),
    collectQualitySignals(repo)
  ]);

  const commits = commitResult.stdout.split('\n').filter(Boolean).length;
  const status = parseStatus(statusResult.stdout);
  return {
    name: basename(repo),
    path: repo,
    branch: branchResult.stdout.trim() || null,
    isGitRepository: true,
    commits,
    branches: branchCount,
    filesChanged: diffStats.filesChanged,
    additions: diffStats.additions,
    deletions: diffStats.deletions,
    ...status,
    quality,
    warnings
  };
}

export async function scanWorkspace(input: Partial<ScanOptions> & { workspace: string }): Promise<ScanReport> {
  const options: ScanOptions = {
    workspace: resolve(input.workspace),
    since: input.since ?? 'midnight',
    includeAllTime: input.includeAllTime ?? false,
    maxDepth: input.maxDepth ?? 3
  };
  const repositories = await Promise.all((await discoverGitRepositories(options.workspace, options.maxDepth)).map((repo) => scanRepository(repo, options)));
  const summary = summarize(options, repositories);
  return { summary, repositories };
}

function summarize(options: ScanOptions, repositories: RepositoryMetrics[]): WorkspaceSummary {
  const touched = repositories.filter((repo) => repo.commits > 0 || repo.hasUncommittedWork);
  const qualityTotal = repositories.reduce((sum, repo) => sum + repo.quality.score, 0);
  return {
    workspace: options.workspace,
    generatedAt: new Date().toISOString(),
    since: options.includeAllTime ? null : options.since ?? null,
    includeAllTime: options.includeAllTime,
    repositoriesScanned: repositories.length,
    reposTouched: touched.length,
    totalCommits: repositories.reduce((sum, repo) => sum + repo.commits, 0),
    totalBranches: repositories.reduce((sum, repo) => sum + repo.branches, 0),
    totalFilesChanged: repositories.reduce((sum, repo) => sum + repo.filesChanged, 0),
    totalAdditions: repositories.reduce((sum, repo) => sum + repo.additions, 0),
    totalDeletions: repositories.reduce((sum, repo) => sum + repo.deletions, 0),
    reposWithUncommittedWork: repositories.filter((repo) => repo.hasUncommittedWork).length,
    averageQualityScore: repositories.length === 0 ? 0 : Math.round(qualityTotal / repositories.length)
  };
}
