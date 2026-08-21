# ossmeter

Local-first OSS sprint metrics for folders full of git repositories.

`ossmeter scan <workspace>` walks a workspace, finds local git repos, and reports the work that actually happened: commits, branches, files changed, repos touched, uncommitted work, and a small quality score that rewards project hygiene over vanity commit counts.

## Why this exists

OSS sprints can get noisy fast. A raw commit count is easy to game and hard to trust. ossmeter gives you a quick scoreboard that stays on your machine and combines velocity with quality signals.

## Install

ossmeter is not yet published to the npm registry. Install the package from a
fresh source checkout and its locally built tarball:

```sh
git clone https://github.com/rogerchappel/ossmeter.git
cd ossmeter
npm ci
npm run build
npm pack
npm install --global ./ossmeter-0.1.0.tgz
ossmeter --help
```

The tarball name follows the version in `package.json`. Remove it after
installation if you do not need to retain the release candidate.

## Quickstart

```sh
ossmeter scan ~/Developer/my-opensource
ossmeter scan ~/Developer/my-opensource --markdown --since "7 days ago"
ossmeter scan ~/Developer/my-opensource --json --include-all-time
```

Default output is a compact terminal table:

```text
ossmeter scan: 2 repos, 2 touched, 3 commits, 6 files changed
repo        branch  commits  branches  files  +/-    quality  worktree
----------  ------  -------  --------  -----  -----  -------  -------------------------
repo-clean  main    2        1         5      20/-0  100      clean
repo-dirty  main    1        1         2      4/-1   40       1 modified, 1 untracked
```

## Command

```sh
ossmeter scan <workspace> [--json|--markdown|--table] [--since <date>] [--include-all-time] [--max-depth <n>]
```

Options:

- `--json` emits stable JSON for agents and automation.
- `--markdown` emits a Markdown summary/table for reports.
- `--table` forces the default terminal table.
- `--since <date>` passes a local git date expression to `git log --since`.
- `--include-all-time` counts all commits in each local repo.
- `--max-depth <n>` limits workspace discovery depth; default is `3`. Discovery includes both ordinary repositories and linked Git worktrees.

## Metrics

- **Commits**: local commits matching the requested time window.
- **Branches**: local branches in the repository.
- **Files changed**: unique files appearing in commit numstat output for the window.
- **Repos touched**: repos with matching commits or uncommitted work.
- **Uncommitted work**: staged, modified, and untracked files from `git status --porcelain`.
- **Quality score**: percentage of five hygiene signals present: tests, CI, README, license, package metadata.

See [docs/METRICS.md](docs/METRICS.md) for definitions and caveats.

## Local-first guarantee

ossmeter does not call GitHub, package registries, telemetry services, or any network API during a scan. It only reads the filesystem and shells out to local `git` commands. Network access is only used by your package manager when you choose to install dependencies.

## Verify

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

Generate deterministic local fixture repos:

```sh
npm run fixtures -- .tmp/workspace-alpha
node dist/cli.js scan .tmp/workspace-alpha --json --include-all-time
```
## CLI Help Smoke

Confirm the packaged command starts and prints its help text before relying on a release tarball or downstream automation:

```bash
npm run build
node ./dist/cli.js --help
```

The command should exit successfully, print the available options, and avoid reading project files or contacting external services.

## Safety

- No hidden telemetry.
- No writes to scanned repositories.
- No secrets required.
- No GitHub API in v1.
- Dirty worktree detection is read-only.

If you find a security issue, follow [SECURITY.md](SECURITY.md).

## Release readiness

Run the same checks that CI uses before opening a release PR:

```sh
npm run release:readiness
npm run release:check
```

`release:readiness` validates repository metadata, the package files allowlist, package smoke coverage, and CI placeholder cleanup. `release:check` runs the project build, test, smoke, and package dry-run checks where configured.

Maintainers should follow [docs/RELEASING.md](docs/RELEASING.md) for npm trusted-publisher setup, tag creation, verification, and recovery.

## Contributing

Small, verified changes are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
