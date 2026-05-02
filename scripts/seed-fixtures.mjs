#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = resolve(process.argv[2] ?? '.tmp/workspace-alpha');
const specRoot = resolve('fixtures/workspace-alpha/specs');
const specs = ['repo-clean.json', 'repo-dirty.json'];

async function git(cwd, args) {
  await exec('git', args, { cwd });
}

async function write(repo, file, content) {
  const target = join(repo, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
}

await rm(root, { recursive: true, force: true });
await mkdir(root, { recursive: true });
await mkdir(join(root, 'not-a-repo'), { recursive: true });
await writeFile(join(root, 'not-a-repo', 'README.md'), '# not a git repo\n');

for (const specFile of specs) {
  const spec = JSON.parse(await readFile(join(specRoot, specFile), 'utf8'));
  const repo = join(root, spec.name);
  await mkdir(repo, { recursive: true });
  await git(repo, ['init', '-b', spec.branch ?? 'main']);
  await git(repo, ['config', 'user.email', 'ossmeter@example.test']);
  await git(repo, ['config', 'user.name', 'ossmeter fixture']);

  for (const [file, content] of Object.entries(spec.files)) {
    await write(repo, file, content);
  }

  for (const commit of spec.commits) {
    await git(repo, ['add', ...commit.files]);
    await git(repo, ['commit', '-m', commit.message]);
  }

  if (spec.dirty?.modified) {
    for (const [file, content] of Object.entries(spec.dirty.modified)) await write(repo, file, content);
  }
  if (spec.dirty?.untracked) {
    for (const [file, content] of Object.entries(spec.dirty.untracked)) await write(repo, file, content);
  }
}

console.log(root);
