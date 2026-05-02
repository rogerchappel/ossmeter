export type OutputFormat = 'table' | 'markdown' | 'json';

export interface ScanOptions {
  workspace: string;
  since?: string;
  includeAllTime: boolean;
  maxDepth: number;
}

export interface RepositoryMetrics {
  name: string;
  path: string;
  branch: string | null;
  isGitRepository: true;
  commits: number;
  branches: number;
  filesChanged: number;
  additions: number;
  deletions: number;
  hasUncommittedWork: boolean;
  untrackedFiles: number;
  modifiedFiles: number;
  stagedFiles: number;
  quality: QualitySignals;
  warnings: string[];
}

export interface QualitySignals {
  score: number;
  hasTests: boolean;
  hasCi: boolean;
  hasReadme: boolean;
  hasLicense: boolean;
  hasPackageMetadata: boolean;
}

export interface WorkspaceSummary {
  workspace: string;
  generatedAt: string;
  since: string | null;
  includeAllTime: boolean;
  repositoriesScanned: number;
  reposTouched: number;
  totalCommits: number;
  totalBranches: number;
  totalFilesChanged: number;
  totalAdditions: number;
  totalDeletions: number;
  reposWithUncommittedWork: number;
  averageQualityScore: number;
}

export interface ScanReport {
  summary: WorkspaceSummary;
  repositories: RepositoryMetrics[];
}

export interface CliArgs {
  command: 'scan' | 'help' | 'version';
  workspace?: string;
  format: OutputFormat;
  since?: string;
  includeAllTime: boolean;
  maxDepth: number;
}
