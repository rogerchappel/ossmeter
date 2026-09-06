#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { githubReleaseTarballUrl } from './release-helpers.mjs';

const root = resolve(process.argv[2] ?? '.');
const tmp = await mkdtemp(join(tmpdir(), 'ossmeter-package-smoke-'));
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const readme = await readFile(join(root, 'README.md'), 'utf8');
let tarball;

try {
  if (/^npm install (?:--global|-g) ossmeter$/m.test(readme)) {
    throw new Error('README must not advertise an unpublished registry install');
  }
  const repository = typeof manifest.repository === 'string' ? manifest.repository : manifest.repository?.url;
  const releaseTarballUrl = githubReleaseTarballUrl(repository, manifest.name, manifest.version);
  for (const command of [`npm install --global ${releaseTarballUrl}`, 'ossmeter --help']) {
    if (!readme.includes(command)) throw new Error(`README is missing tested install command: ${command}`);
  }

  const packJson = execFileSync('npm', ['pack', '--json'], { cwd: root, encoding: 'utf8' });
  const [pack] = JSON.parse(packJson);
  tarball = join(root, pack.filename);

  if (pack.name !== manifest.name || pack.version !== manifest.version) {
    throw new Error(`packed identity ${pack.name}@${pack.version} does not match package.json`);
  }
  if (manifest.name !== 'ossmeter' || manifest.bin?.ossmeter !== './dist/cli.js') {
    throw new Error('package must expose the ossmeter CLI from ./dist/cli.js');
  }

  const packedFiles = new Set(pack.files.map(({ path }) => path));
  for (const required of ['dist/cli.js', 'dist/index.js', 'dist/index.d.ts', 'README.md', 'LICENSE']) {
    if (!packedFiles.has(required)) throw new Error(`tarball is missing required file: ${required}`);
  }

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
