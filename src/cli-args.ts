import type { CliArgs } from './models.js';

function optionValue(argv: string[], index: number, option: '--since' | '--max-depth'): string {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${option} requires a value`);
  return value;
}

export function parseArgs(argv: string[]): CliArgs {
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
      since = optionValue(argv, index, '--since');
      index += 1;
    } else if (arg === '--max-depth') {
      const value = optionValue(argv, index, '--max-depth');
      if (!/^\d+$/.test(value)) throw new Error('--max-depth requires a non-negative integer');
      maxDepth = Number(value);
      if (!Number.isSafeInteger(maxDepth)) throw new Error('--max-depth requires a non-negative integer');
      index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  const parsed: CliArgs = { command: 'scan', workspace, format, includeAllTime, maxDepth };
  if (since) parsed.since = since;
  return parsed;
}
