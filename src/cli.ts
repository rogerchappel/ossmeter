#!/usr/bin/env node
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { formatJson, formatMarkdown, formatTable } from './format.js';
import type { CliArgs } from './models.js';
import { scanWorkspace } from './scanner.js';

const helpText = `ossmeter — local-first OSS sprint metrics

Usage:
  ossmeter scan <workspace> [--json|--markdown|--table] [--since <date>] [--include-all-time] [--max-depth <n>]
  ossmeter --help
  ossmeter --version

Examples:
  ossmeter scan ~/Developer/my-opensource
  ossmeter scan . --markdown --since "7 days ago"
  ossmeter scan fixtures/workspace-alpha --json --include-all-time

Notes:
  - No network calls. ossmeter only shells out to local git.
  - By default commits are counted since midnight; use --include-all-time for fixtures/history.
`;

function parseArgs(argv: string[]): CliArgs {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) return { command: 'help', format: 'table', includeAllTime: false, maxDepth: 3 };
  if (argv.includes('--version') || argv.includes('-v')) return { command: 'version', format: 'table', includeAllTime: false, maxDepth: 3 };
  const [command, workspace] = argv;
  if (command !== 'scan') throw new Error(`Unknown command: ${command}`);
  if (!workspace) throw new Error('Missing workspace. Try: ossmeter scan <workspace>');
  let format: CliArgs['format'] = 'table';
  let since: string | undefined;
  let includeAllTime = false;
  let maxDepth = 3;
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') format = 'json';
    else if (arg === '--markdown' || arg === '--md') format = 'markdown';
    else if (arg === '--table') format = 'table';
    else if (arg === '--include-all-time') includeAllTime = true;
    else if (arg === '--since') {
      const value = argv[index + 1];
      if (!value) throw new Error('--since requires a value');
      since = value;
      index += 1;
    } else if (arg === '--max-depth') {
      const value = Number.parseInt(argv[index + 1] ?? '', 10);
      if (!Number.isInteger(value) || value < 0) throw new Error('--max-depth requires a non-negative integer');
      maxDepth = value;
      index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  const parsed: CliArgs = { command: 'scan', workspace, format, includeAllTime, maxDepth };
  if (since) parsed.since = since;
  return parsed;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function run(argv = process.argv.slice(2)): Promise<void> {
  const args = parseArgs(argv);
  if (args.command === 'help') {
    console.log(helpText);
    return;
  }
  if (args.command === 'version') {
    console.log('0.1.0');
    return;
  }
  const workspace = resolve(args.workspace ?? '.');
  if (!(await exists(workspace))) throw new Error(`Workspace does not exist: ${workspace}`);
  const scanOptions = { workspace, includeAllTime: args.includeAllTime, maxDepth: args.maxDepth, ...(args.since ? { since: args.since } : {}) };
  const report = await scanWorkspace(scanOptions);
  if (args.format === 'json') console.log(formatJson(report));
  else if (args.format === 'markdown') console.log(formatMarkdown(report));
  else console.log(formatTable(report));
}

run().catch((error: unknown) => {
  console.error(`ossmeter: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
