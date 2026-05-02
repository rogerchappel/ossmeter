import type { RepositoryMetrics, ScanReport } from './models.js';

function dirtyLabel(repo: RepositoryMetrics): string {
  if (!repo.hasUncommittedWork) return 'clean';
  const parts = [];
  if (repo.stagedFiles) parts.push(`${repo.stagedFiles} staged`);
  if (repo.modifiedFiles) parts.push(`${repo.modifiedFiles} modified`);
  if (repo.untrackedFiles) parts.push(`${repo.untrackedFiles} untracked`);
  return parts.join(', ');
}

function pad(value: string, width: number): string {
  return value + ' '.repeat(Math.max(0, width - value.length));
}

export function formatTable(report: ScanReport): string {
  const rows = report.repositories.map((repo) => [
    repo.name,
    repo.branch ?? '-',
    String(repo.commits),
    String(repo.branches),
    String(repo.filesChanged),
    `${repo.additions}/-${repo.deletions}`,
    `${repo.quality.score}`,
    dirtyLabel(repo)
  ]);
  const headers = ['repo', 'branch', 'commits', 'branches', 'files', '+/-', 'quality', 'worktree'];
  const widths = headers.map((header, index) => Math.max(header.length, ...rows.map((row) => row[index]?.length ?? 0)));
  const line = widths.map((width) => '-'.repeat(width)).join('  ');
  const body = rows.map((row) => row.map((cell, index) => pad(cell, widths[index] ?? 0)).join('  ')).join('\n');
  const summary = report.summary;
  return [
    `ossmeter scan: ${summary.repositoriesScanned} repos, ${summary.reposTouched} touched, ${summary.totalCommits} commits, ${summary.totalFilesChanged} files changed`,
    headers.map((header, index) => pad(header, widths[index] ?? 0)).join('  '),
    line,
    body || '(no git repositories found)'
  ].join('\n');
}

export function formatMarkdown(report: ScanReport): string {
  const summary = report.summary;
  const lines = [
    '# ossmeter scan',
    '',
    `- Workspace: \`${summary.workspace}\``,
    `- Repositories scanned: ${summary.repositoriesScanned}`,
    `- Repositories touched: ${summary.reposTouched}`,
    `- Commits: ${summary.totalCommits}`,
    `- Files changed: ${summary.totalFilesChanged}`,
    `- Uncommitted work: ${summary.reposWithUncommittedWork} repos`,
    `- Average quality score: ${summary.averageQualityScore}`,
    '',
    '| Repo | Branch | Commits | Branches | Files | +/- | Quality | Worktree |',
    '|---|---:|---:|---:|---:|---:|---:|---|'
  ];
  for (const repo of report.repositories) {
    lines.push(`| ${repo.name} | ${repo.branch ?? '-'} | ${repo.commits} | ${repo.branches} | ${repo.filesChanged} | ${repo.additions}/-${repo.deletions} | ${repo.quality.score} | ${dirtyLabel(repo)} |`);
  }
  return lines.join('\n');
}

export function formatJson(report: ScanReport): string {
  return JSON.stringify(report, null, 2);
}
