# Fixtures

The committed fixture specs live under `fixtures/workspace-alpha/specs`.

Generate real local git repositories with:

```sh
npm run fixtures -- .tmp/workspace-alpha
```

Then scan them:

```sh
node dist/cli.js scan .tmp/workspace-alpha --json --include-all-time
```

The generated workspace contains:

- `repo-clean`: clean worktree, README, LICENSE, package metadata, tests, and CI.
- `repo-dirty`: one commit plus modified and untracked local files.
- `not-a-repo`: a control directory ignored by discovery.
