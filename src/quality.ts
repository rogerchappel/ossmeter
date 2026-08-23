import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { QualitySignals } from './models.js';

async function isNonEmptyFile(path: string): Promise<boolean> {
  try {
    const details = await stat(path);
    return details.isFile() && details.size > 0;
  } catch {
    return false;
  }
}

async function hasTestFiles(repo: string): Promise<boolean> {
  const candidates = ['test', 'tests', '__tests__', 'spec'];
  for (const candidate of candidates) {
    try {
      const entries = await readdir(join(repo, candidate), { recursive: true, withFileTypes: true });
      if (entries.some((entry) => entry.isFile() && /\.(test|spec)\.[cm]?[jt]sx?$/.test(entry.name))) return true;
    } catch {
      // Missing, unreadable, and non-directory candidates are not evidence of tests.
    }
  }

  try {
    const names = await readdir(repo);
    return names.some((name) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(name));
  } catch {
    return false;
  }
}

export async function collectQualitySignals(repo: string): Promise<QualitySignals> {
  const hasTests = await hasTestFiles(repo);
  let hasGithubWorkflow = false;
  try {
    const workflows = await readdir(join(repo, '.github', 'workflows'), { withFileTypes: true });
    hasGithubWorkflow = (await Promise.all(workflows
      .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
      .map((entry) => isNonEmptyFile(join(repo, '.github', 'workflows', entry.name))))).some(Boolean);
  } catch {
    // A missing or invalid workflow directory contributes no CI evidence.
  }
  const hasCi = hasGithubWorkflow || (await isNonEmptyFile(join(repo, '.gitlab-ci.yml')));
  const hasReadme = (await isNonEmptyFile(join(repo, 'README.md'))) || (await isNonEmptyFile(join(repo, 'readme.md')));
  const hasLicense = (await isNonEmptyFile(join(repo, 'LICENSE'))) || (await isNonEmptyFile(join(repo, 'LICENSE.md')));
  const hasPackageMetadata = (await isNonEmptyFile(join(repo, 'package.json'))) || (await isNonEmptyFile(join(repo, 'pyproject.toml'))) || (await isNonEmptyFile(join(repo, 'Cargo.toml')));
  const checks = [hasTests, hasCi, hasReadme, hasLicense, hasPackageMetadata];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  return { score, hasTests, hasCi, hasReadme, hasLicense, hasPackageMetadata };
}
