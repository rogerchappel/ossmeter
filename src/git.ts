import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface GitResult {
  stdout: string;
  stderr: string;
}

export async function git(args: string[], cwd: string): Promise<GitResult> {
  try {
    const { stdout, stderr } = await execFileAsync('git', args, {
      cwd,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
    return { stdout: stdout.trimEnd(), stderr: stderr.trimEnd() };
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { stdout?: string; stderr?: string };
    const message = err.stderr || err.message || `git ${args.join(' ')} failed`;
    throw new Error(message.trim());
  }
}

export async function isGitRepository(cwd: string): Promise<boolean> {
  try {
    const result = await git(['rev-parse', '--is-inside-work-tree'], cwd);
    return result.stdout.trim() === 'true';
  } catch {
    return false;
  }
}
