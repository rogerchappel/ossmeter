# Releasing ossmeter

The `Release` workflow publishes the package to npm and attaches the same
generated tarball to a GitHub release whenever a `vX.Y.Z` tag is pushed.
Publishing uses npm trusted publishing (GitHub Actions OIDC), so it does not
use a long-lived npm token.

## One-time npm setup

Before pushing the first publishing tag:

1. Create or claim the public `ossmeter` package on npm under the maintainer
   account.
2. In the package's npm **Trusted Publisher** settings, add a GitHub Actions
   publisher with organization/user `rogerchappel`, repository `ossmeter`,
   workflow filename `release.yml`, and no environment.
3. Confirm the GitHub repository permits Actions to create releases. No
   `NPM_TOKEN` repository secret is required.

The trusted publisher values are exact and case-sensitive. Restricting the
publisher to `release.yml` ensures other workflows cannot request npm publish
credentials.

## Release

1. Update `package.json` and `package-lock.json` to the intended version.
2. Update `CHANGELOG.md`.
3. Run:

   ```sh
   npm ci
   npm run release:readiness
   npm run release:check
   ```

4. Create and push a matching tag, for example `v0.2.0` for package version
   `0.2.0`. Review the `Release` workflow; do not publish the package manually
   while it is running.

## Verify and recover

After the workflow succeeds, verify both distribution paths:

```sh
npm view ossmeter version
npx --yes ossmeter@0.2.0 --help
gh release view v0.2.0 --repo rogerchappel/ossmeter
```

Replace `0.2.0` with the released version. The `npx` command must exit
successfully and display the packaged CLI help.

If npm publishing fails, first verify the trusted-publisher values above and
that the tag version exactly matches `package.json`. Re-run a failed job, or
recover an older tag that has no publish run with:

```sh
gh workflow run release.yml --repo rogerchappel/ossmeter -f tag=v0.1.0
```

The recovery path checks out the existing tag without moving or recreating it,
requires its version to exactly match `package.json`, and builds one tarball.
It publishes that artifact with provenance only when the exact npm version is
absent, verifies the registry integrity and packaged `ossmeter --help`, then
creates or repairs the matching GitHub release with the same artifact. Re-runs
are therefore safe. npm versions are immutable; if the published tarball is wrong,
deprecate that version, prepare a corrected patch version, and create a new
matching tag rather than attempting to overwrite it.
