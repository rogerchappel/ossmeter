import { access, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { QualitySignals } from './models.js';

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function hasTestFiles(repo: string): Promise<boolean> {
  const candidates = ['test', 'tests', '__tests__', 'spec'];
  for (const candidate of candidates) {
    if (await exists(join(repo, candidate))) return true;
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
  const hasCi = (await exists(join(repo, '.github', 'workflows'))) || (await exists(join(repo, '.gitlab-ci.yml')));
  const hasReadme = (await exists(join(repo, 'README.md'))) || (await exists(join(repo, 'readme.md')));
  const hasLicense = (await exists(join(repo, 'LICENSE'))) || (await exists(join(repo, 'LICENSE.md')));
  const hasPackageMetadata = (await exists(join(repo, 'package.json'))) || (await exists(join(repo, 'pyproject.toml'))) || (await exists(join(repo, 'Cargo.toml')));
  const checks = [hasTests, hasCi, hasReadme, hasLicense, hasPackageMetadata];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  return { score, hasTests, hasCi, hasReadme, hasLicense, hasPackageMetadata };
}
