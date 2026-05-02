import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { collectQualitySignals } from '../src/quality.ts';

test('collectQualitySignals scores common project hygiene files', async () => {
  const repo = await mkdtemp(join(tmpdir(), 'ossmeter-quality-'));
  await writeFile(join(repo, 'README.md'), '# repo\n');
  await writeFile(join(repo, 'LICENSE'), 'MIT\n');
  await writeFile(join(repo, 'package.json'), '{}\n');
  await mkdir(join(repo, 'test'));
  await mkdir(join(repo, '.github', 'workflows'), { recursive: true });

  const signals = await collectQualitySignals(repo);
  assert.equal(signals.score, 100);
  assert.equal(signals.hasTests, true);
  assert.equal(signals.hasCi, true);
});
