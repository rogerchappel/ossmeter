# Metric definitions

ossmeter is intentionally boring: it reads local git repositories and explains exactly how each number is produced.

## Workspace discovery

A workspace is a folder that may contain one or more git repositories. Discovery walks subdirectories up to `--max-depth` and treats any directory containing `.git` as a repo. Common generated folders such as `node_modules`, `dist`, and `coverage` are skipped.

## Commit window

By default, scan uses `--since midnight`. Use `--since "7 days ago"` or `--include-all-time` when you want a different horizon. The value is passed to local git; no remote history is fetched.

## Repository metrics

- `commits`: number of local commits returned by `git log --format=%H` for the window.
- `branches`: number of local branches returned by `git branch --format=%(refname:short)`.
- `filesChanged`: unique filenames from `git log --numstat` for the window.
- `additions` / `deletions`: numeric numstat totals; binary file `-` values count as zero.
- `hasUncommittedWork`: true when `git status --porcelain=v1` returns any line.
- `stagedFiles`, `modifiedFiles`, `untrackedFiles`: simple counts from porcelain status columns.

## Quality score

Each repo gets one point for each signal:

1. tests (`test`, `tests`, `__tests__`, `spec`, or root `*.test.*` / `*.spec.*`)
2. CI (`.github/workflows` or `.gitlab-ci.yml`)
3. README (`README.md` or `readme.md`)
4. license (`LICENSE` or `LICENSE.md`)
5. package metadata (`package.json`, `pyproject.toml`, or `Cargo.toml`)

The score is `present signals / 5 * 100`, rounded to the nearest integer.

## Caveats

ossmeter measures local work visibility, not human worth. It does not judge code quality, issue impact, review quality, or design difficulty. Treat it as a sprint dashboard, not a performance system.
