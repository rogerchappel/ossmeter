import { readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { isGitRepository } from './git.js';

const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', '.next', '.turbo', 'coverage']);

export async function discoverGitRepositories(workspace: string, maxDepth: number): Promise<string[]> {
  const root = resolve(workspace);
  const repos = new Set<string>();

  async function walk(dir: string, depth: number): Promise<void> {
    if (depth > maxDepth) return;

    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const gitEntry = entries.find((entry) => entry.name === '.git');
    if (gitEntry?.isDirectory() || (gitEntry?.isFile() && await isGitRepository(dir))) {
      repos.add(dir);
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || ignoredDirectories.has(entry.name)) continue;
      const child = join(dir, entry.name);
      try {
        const info = await stat(child);
        if (info.isDirectory()) await walk(child, depth + 1);
      } catch {
        // Skip paths that disappear or cannot be read.
      }
    }
  }

  await walk(root, 0);
  return [...repos].sort((a, b) => a.localeCompare(b));
}
