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
  await writeFile(join(repo, 'test', 'quality.test.ts'), 'test("quality", () => {});\n');
  await mkdir(join(repo, '.github', 'workflows'), { recursive: true });
  await writeFile(join(repo, '.github', 'workflows', 'verify.yml'), 'name: verify\n');

  const signals = await collectQualitySignals(repo);
  assert.equal(signals.score, 100);
  assert.equal(signals.hasTests, true);
  assert.equal(signals.hasCi, true);
});

test('collectQualitySignals rejects empty and file-type impostors', async () => {
  const repo = await mkdtemp(join(tmpdir(), 'ossmeter-empty-quality-'));
  await mkdir(join(repo, 'test'));
  await mkdir(join(repo, '.github', 'workflows'), { recursive: true });
  await mkdir(join(repo, 'README.md'));
  await writeFile(join(repo, 'LICENSE'), '');
  await mkdir(join(repo, 'package.json'));

  assert.deepEqual(await collectQualitySignals(repo), {
    score: 0,
    hasTests: false,
    hasCi: false,
    hasReadme: false,
    hasLicense: false,
    hasPackageMetadata: false
  });
});

test('collectQualitySignals recognizes nested tests and supported alternate files', async () => {
  const repo = await mkdtemp(join(tmpdir(), 'ossmeter-alternate-quality-'));
  await mkdir(join(repo, 'spec', 'nested'), { recursive: true });
  await writeFile(join(repo, 'spec', 'nested', 'unit.spec.mjs'), 'export {};\n');
  await writeFile(join(repo, '.gitlab-ci.yml'), 'test: {}\n');
  await writeFile(join(repo, 'readme.md'), '# repo\n');
  await writeFile(join(repo, 'LICENSE.md'), 'MIT\n');
  await writeFile(join(repo, 'pyproject.toml'), '[project]\nname = "fixture"\n');

  assert.equal((await collectQualitySignals(repo)).score, 100);
});
