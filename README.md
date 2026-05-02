# ossmeter

Local-first OSS sprint metrics for folders full of git repositories.

`ossmeter scan <workspace>` walks a workspace, finds local git repos, and reports the work that actually happened: commits, branches, files changed, repos touched, uncommitted work, and a small quality score that rewards project hygiene over vanity commit counts.

## Why this exists

OSS sprints can get noisy fast. A raw commit count is easy to game and hard to trust. ossmeter gives you a quick scoreboard that stays on your machine and combines velocity with quality signals.

## Install

```sh
npm install -g ossmeter
```

For local development:

```sh
git clone https://github.com/rogerchappel/ossmeter.git
cd ossmeter
npm install
npm run build
node dist/cli.js scan . --include-all-time
```

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
- `--max-depth <n>` limits workspace discovery depth; default is `3`.

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

## Safety

- No hidden telemetry.
- No writes to scanned repositories.
- No secrets required.
- No GitHub API in v1.
- Dirty worktree detection is read-only.

If you find a security issue, follow [SECURITY.md](SECURITY.md).

## Contributing

Small, verified changes are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
