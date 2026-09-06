import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function versionFromTag(tag) {
  const match = /^v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/.exec(tag);
  if (!match) throw new Error(`Release tag must be v<semver>; received: ${tag}`);
  return match[1];
}

export function verifyTagVersion(tag, packageVersion) {
  const tagVersion = versionFromTag(tag);
  if (tagVersion !== packageVersion) {
    throw new Error(`Tag ${tag} does not match package.json version ${packageVersion}`);
  }
  return tagVersion;
}

export function githubReleaseTarballUrl(repository, packageName, packageVersion) {
  const slug = repository.replace(/^git\+https:\/\/github\.com\//, '').replace(/\.git$/, '');
  const tag = `v${packageVersion}`;
  return `https://github.com/${slug}/releases/download/${tag}/${packageName}-${packageVersion}.tgz`;
}

export function publishedVersionMatches(expected, npmOutput) {
  const value = JSON.parse(npmOutput);
  return value === expected || (Array.isArray(value) && value.includes(expected));
}

export async function tarballIntegrity(path) {
  const bytes = await readFile(path);
  return `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
}

async function main([command, ...args]) {
  if (command === 'verify-tag') {
    const pkg = JSON.parse(await readFile('package.json', 'utf8'));
    verifyTagVersion(args[0], pkg.version);
    process.stdout.write(`${pkg.name}@${pkg.version}\n`);
    return;
  }
  if (command === 'published-matches') {
    if (!publishedVersionMatches(args[0], args[1])) process.exitCode = 1;
    return;
  }
  if (command === 'integrity') {
    process.stdout.write(`${await tarballIntegrity(args[0])}\n`);
    return;
  }
  throw new Error(`Unknown release helper command: ${command ?? ''}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
