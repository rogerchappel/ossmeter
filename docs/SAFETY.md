# Safety and privacy model

ossmeter is local-first by design.

## What scan reads

- Directory names under the workspace.
- Local git metadata through `git` commands.
- Presence of common project files such as README, LICENSE, CI config, package metadata, and tests.

## What scan does not do

- It does not make network requests.
- It does not write to scanned repositories.
- It does not fetch, pull, push, or contact remotes.
- It does not require tokens or secrets.
- It does not upload telemetry.

## Shell execution

The CLI invokes the local `git` binary with fixed argument lists. User input is passed as arguments, not interpolated into a shell command.

## Sensitive workspaces

JSON output includes local filesystem paths. Do not publish reports from private workspaces without reviewing the paths and repository names first.
