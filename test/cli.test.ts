import assert from 'node:assert/strict';
import test from 'node:test';
import { parseArgs } from '../src/cli.js';

test('parseArgs accepts complete non-negative max-depth values', () => {
  assert.equal(parseArgs(['scan', '.', '--max-depth', '0']).maxDepth, 0);
  assert.equal(parseArgs(['scan', '.', '--max-depth', '12']).maxDepth, 12);
});

test('parseArgs rejects partial and invalid max-depth values', () => {
  for (const value of ['2oops', '1.5', '-1', '+1', '1e2', '']) {
    assert.throws(
      () => parseArgs(['scan', '.', '--max-depth', value]),
      /--max-depth requires a non-negative integer/,
      value || '<empty>',
    );
  }
});

test('parseArgs does not consume options as option values', () => {
  for (const option of ['--json', '--markdown', '--table']) {
    assert.throws(() => parseArgs(['scan', '.', '--since', option]), /--since requires a value/);
    assert.throws(() => parseArgs(['scan', '.', '--max-depth', option]), /--max-depth requires a non-negative integer/);
  }
});

test('parseArgs preserves supported git date expressions', () => {
  assert.equal(parseArgs(['scan', '.', '--since', '7 days ago']).since, '7 days ago');
  assert.equal(parseArgs(['scan', '.', '--since', '2026-08-01']).since, '2026-08-01');
});
