import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const expectedVerificationCommands = [
  'npm ci',
  'npm test',
  'npm run check',
  'npm run build',
  'npm run smoke',
  'bash scripts/validate.sh',
];

function fencedCommandsAfterHeading(markdown: string, heading: string): string[] {
  const section = markdown.match(new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=^## |\\Z)`, 'm'))?.[1];
  assert.ok(section, `missing ${heading} section`);

  const codeBlock = section.match(/```sh\n([\s\S]*?)```/)?.[1];
  assert.ok(codeBlock, `missing shell command block in ${heading} section`);

  return codeBlock.trim().split('\n');
}

test('README clean-checkout verification installs locked dependencies first', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  assert.deepEqual(fencedCommandsAfterHeading(readme, 'Verify'), expectedVerificationCommands);
});

test('contributor development workflow matches the README verification contract', async () => {
  const contributing = await readFile(new URL('../CONTRIBUTING.md', import.meta.url), 'utf8');
  assert.deepEqual(fencedCommandsAfterHeading(contributing, 'Development'), expectedVerificationCommands);
});
