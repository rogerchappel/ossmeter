# Release candidate readiness

Generated: 2026-05-05T21:28:35Z
Branch: `release-candidate/readiness`
Base: `main`

## Verification

Status: PASS

Checks run:
- `npm ci`
- `npm run release:check`
- `bash scripts/validate.sh`
- `node releasebox check .`

## Check output summary

    
    
    > ossmeter@0.1.0 check
    > tsc -p tsconfig.json --noEmit
    
    
    > ossmeter@0.1.0 test
    > node --test --import tsx test/*.test.ts
    
    ✔ discoverGitRepositories finds nested git worktrees and skips non-repos (13.727667ms)
    ✔ formatTable renders summary and dirty worktree state (0.638916ms)
    ✔ formatMarkdown renders automation-friendly metric table (0.131042ms)
    ✔ collectQualitySignals scores common project hygiene files (6.757917ms)
    ✔ scanWorkspace aggregates commits, branches, quality and dirty state (108.159333ms)
    ℹ tests 5
    ℹ suites 0
    ℹ pass 5
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 348.466792
    
    > ossmeter@0.1.0 smoke
    > npm run build && npm run fixtures -- .tmp/workspace-alpha && node dist/cli.js scan .tmp/workspace-alpha --json --include-all-time
    
    
    > ossmeter@0.1.0 build
    > tsc -p tsconfig.json
    
    
    > ossmeter@0.1.0 fixtures
    > node scripts/seed-fixtures.mjs .tmp/workspace-alpha
    
    /Users/roger/Developer/my-opensource/.rc-readiness-worktrees/ossmeter/.tmp/workspace-alpha
    {
      "summary": {
        "workspace": "/Users/roger/Developer/my-opensource/.rc-readiness-worktrees/ossmeter/.tmp/workspace-alpha",
        "generatedAt": "2026-05-05T21:28:30.337Z",
        "since": null,
        "includeAllTime": true,
        "repositoriesScanned": 2,
        "reposTouched": 2,
        "totalCommits": 3,
        "totalBranches": 2,
        "totalFilesChanged": 7,
        "totalAdditions": 18,
        "totalDeletions": 0,
        "reposWithUncommittedWork": 1,
        "averageQualityScore": 60
      },
      "repositories": [
        {
          "name": "repo-clean",
          "path": "/Users/roger/Developer/my-opensource/.rc-readiness-worktrees/ossmeter/.tmp/workspace-alpha/repo-clean",
          "branch": "main",
          "isGitRepository": true,
          "commits": 2,
          "branches": 1,
          "filesChanged": 5,
          "additions": 14,
          "deletions": 0,
          "hasUncommittedWork": false,
          "modifiedFiles": 0,
          "stagedFiles": 0,
          "untrackedFiles": 0,
          "quality": {
            "score": 100,
            "hasTests": true,
            "hasCi": true,
            "hasReadme": true,
            "hasLicense": true,
            "hasPackageMetadata": true
          },
          "warnings": []
        },
        {
          "name": "repo-dirty",
          "path": "/Users/roger/Developer/my-opensource/.rc-readiness-worktrees/ossmeter/.tmp/workspace-alpha/repo-dirty",
          "branch": "main",
          "isGitRepository": true,
          "commits": 1,
          "branches": 1,
          "filesChanged": 2,
          "additions": 4,
          "deletions": 0,
          "hasUncommittedWork": true,
          "modifiedFiles": 1,
          "stagedFiles": 0,
          "untrackedFiles": 1,
          "quality": {
            "score": 20,
            "hasTests": false,
            "hasCi": false,
            "hasReadme": true,
            "hasLicense": false,
            "hasPackageMetadata": false
          },
          "warnings": []
        }
      ]
    }
    
    > ossmeter@0.1.0 package:smoke
    > npm run build && node scripts/package-smoke.mjs .
    
    
    > ossmeter@0.1.0 build
    > tsc -p tsconfig.json
    
    
    added 1 package, and audited 2 packages in 361ms
    
    found 0 vulnerabilities
    ossmeter — local-first OSS sprint metrics
    
    Usage:
      ossmeter scan <workspace> [--json|--markdown|--table] [--since <date>] [--include-all-time] [--max-depth <n>]
      ossmeter --help
      ossmeter --version
    
    Examples:
      ossmeter scan ~/Developer/my-opensource
      ossmeter scan . --markdown --since "7 days ago"
      ossmeter scan fixtures/workspace-alpha --json --include-all-time
    
    Notes:
      - No network calls. ossmeter only shells out to local git.
      - By default commits are counted since midnight; use --include-all-time for fixtures/history.
    
    0.1.0
    package smoke passed for ossmeter-0.1.0.tgz
    ✅ releasebox config: node-cli
    ✅ ci workflow: .github/workflows/ci.yml
    ✅ release dry run workflow: .github/workflows/release-dry-run.yml
    ✅ task breakdown: docs/TASKS.md
    ✅ orchestration plan: docs/ORCHESTRATION.md
    ✅ dependabot config: .github/dependabot.yml
    ✅ npm test script: node --test --import tsx test/*.test.ts
    ✅ build script: tsc -p tsconfig.json
    ✅ smoke script: npm run build && npm run fixtures -- .tmp/workspace-alpha && node dist/cli.js scan .tmp/workspace-alpha --json --include-all-time
    ✅ bin entry: {"ossmeter":"./dist/cli.js"}
    npm notice
    npm notice package: ossmeter@0.1.0
    npm notice Tarball Contents
    npm notice 813B CHANGELOG.md
    npm notice 1.1kB LICENSE
    npm notice 3.4kB README.md
    npm notice 1.2kB SECURITY.md
    npm notice 81B dist/cli.d.ts
    npm notice 3.8kB dist/cli.js
    npm notice 3.6kB dist/cli.js.map
    npm notice 105B dist/discover.d.ts
    npm notice 1.3kB dist/discover.js
    npm notice 1.5kB dist/discover.js.map
    npm notice 244B dist/format.d.ts
    npm notice 2.7kB dist/format.js
    npm notice 3.0kB dist/format.js.map
    npm notice 221B dist/git.d.ts
    npm notice 866B dist/git.js
    npm notice 1.1kB dist/git.js.map
    npm notice 303B dist/index.d.ts
    npm notice 223B dist/index.js
    npm notice 255B dist/index.js.map
    npm notice 1.5kB dist/models.d.ts
    npm notice 45B dist/models.js
    npm notice 104B dist/models.js.map
    npm notice 137B dist/quality.d.ts
    npm notice 1.5kB dist/quality.js
    npm notice 1.9kB dist/quality.js.map
    npm notice 301B dist/scanner.d.ts
    npm notice 5.4kB dist/scanner.js
    npm notice 6.3kB dist/scanner.js.map
    npm notice 1.7kB package.json
    npm notice Tarball Details
    npm notice name: ossmeter
    npm notice version: 0.1.0
    npm notice filename: ossmeter-0.1.0.tgz
    npm notice package size: 12.7 kB
    npm notice unpacked size: 44.6 kB
    npm notice shasum: 85b7ae806d66324db6467586f23dfabef850b228
    npm notice integrity: sha512-gp+gyB6+bLOhV[...]Q3pW4MiXn4CYA==
    npm notice total files: 29
    npm notice
    ossmeter-0.1.0.tgz
    ```
    RESULT: 0 (6s)
    
    ## bash scripts/validate.sh
    ```
    bash scripts/validate.sh
    ```
    ```text
    Checking ossmeter required files...
    PASS: required file exists: README.md
    PASS: required file exists: AGENTS.md
    PASS: required file exists: CONTRIBUTING.md
    PASS: required file exists: SECURITY.md
    PASS: required file exists: .github/pull_request_template.md
    PASS: required file exists: scripts/validate.sh
    
    Checking ossmeter required directories...
    PASS: required directory exists: .github
    PASS: required directory exists: docs
    PASS: required directory exists: scripts
    
    Running local project checks where present...
    NOTE: using package manager: npm
    
    > ossmeter@0.1.0 check
    > tsc -p tsconfig.json --noEmit
    
    PASS: package script: check
    
    > ossmeter@0.1.0 test
    > node --test --import tsx test/*.test.ts
    
    ✔ discoverGitRepositories finds nested git worktrees and skips non-repos (14.119916ms)
    ✔ formatTable renders summary and dirty worktree state (0.594625ms)
    ✔ formatMarkdown renders automation-friendly metric table (0.091709ms)
    ✔ collectQualitySignals scores common project hygiene files (5.952708ms)
    ✔ scanWorkspace aggregates commits, branches, quality and dirty state (95.744084ms)
    ℹ tests 5
    ℹ suites 0
    ℹ pass 5
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 238.297584
    PASS: package script: test
    
    > ossmeter@0.1.0 build
    > tsc -p tsconfig.json
    
    PASS: package script: build
    NOTE: agent-qc not installed; skipping optional agent check
    
    Validation passed.
    ```
    RESULT: 0 (2s)
    
    ## ReleaseBox check
    ```
    node '/Users/roger/Developer/my-opensource/releasebox/bin/releasebox.js' check .
    ```
    ```text
    ✅ releasebox config: node-cli
    ✅ ci workflow: .github/workflows/ci.yml
    ✅ release dry run workflow: .github/workflows/release-dry-run.yml
    ✅ task breakdown: docs/TASKS.md
    ✅ orchestration plan: docs/ORCHESTRATION.md
    ✅ dependabot config: .github/dependabot.yml
    ✅ npm test script: node --test --import tsx test/*.test.ts
    ✅ build script: tsc -p tsconfig.json
    ✅ smoke script: npm run build && npm run fixtures -- .tmp/workspace-alpha && node dist/cli.js scan .tmp/workspace-alpha --json --include-all-time
    ✅ bin entry: {"ossmeter":"./dist/cli.js"}
    ```
    RESULT: 0 (0s)
    
