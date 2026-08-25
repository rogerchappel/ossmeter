#!/usr/bin/env node
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from './cli-args.js';
import { formatJson, formatMarkdown, formatTable } from './format.js';
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
