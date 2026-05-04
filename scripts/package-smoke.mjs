#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const tmp = await mkdtemp(join(tmpdir(), 'ossmeter-package-smoke-'));
let tarball;

try {
  const packJson = execFileSync('npm', ['pack', '--json'], { cwd: root, encoding: 'utf8' });
  const [pack] = JSON.parse(packJson);
  tarball = join(root, pack.filename);

  await writeFile(
    join(tmp, 'package.json'),
    JSON.stringify({ private: true, type: 'module', dependencies: {} }, null, 2)
  );

  execFileSync('npm', ['install', tarball], { cwd: tmp, stdio: 'inherit' });
  execFileSync('npx', ['ossmeter', '--help'], { cwd: tmp, stdio: 'inherit' });
  execFileSync('npx', ['ossmeter', '--version'], { cwd: tmp, stdio: 'inherit' });

  console.log(`package smoke passed for ${basename(tarball)}`);
} finally {
  if (tarball) await unlink(tarball).catch(() => undefined);
  await rm(tmp, { recursive: true, force: true });
}
