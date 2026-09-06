import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  githubReleaseTarballUrl,
  publishedVersionMatches,
  verifyTagVersion,
  versionFromTag,
} from '../scripts/release-helpers.mjs';

test('release tag must be a version tag', () => {
  assert.equal(versionFromTag('v0.1.0'), '0.1.0');
  assert.equal(versionFromTag('v2.0.0-rc.1'), '2.0.0-rc.1');
  assert.throws(() => versionFromTag('main'), /must be v<semver>/);
});

test('release tag must exactly match package version', () => {
  assert.equal(verifyTagVersion('v0.1.0', '0.1.0'), '0.1.0');
  assert.throws(() => verifyTagVersion('v0.1.1', '0.1.0'), /does not match/);
});

test('exact-version registry output is verified', () => {
  assert.equal(publishedVersionMatches('0.1.0', '"0.1.0"'), true);
  assert.equal(publishedVersionMatches('0.1.0', '["0.1.0"]'), true);
  assert.equal(publishedVersionMatches('0.1.0', '"0.1.1"'), false);
});

test('GitHub release tarball URL follows package metadata', () => {
  assert.equal(
    githubReleaseTarballUrl('git+https://github.com/rogerchappel/ossmeter.git', 'ossmeter', '0.1.0'),
    'https://github.com/rogerchappel/ossmeter/releases/download/v0.1.0/ossmeter-0.1.0.tgz',
  );
});
