# Release candidate readiness

Generated: 2026-05-05T21:25:56Z
Branch: `release-candidate/readiness`
Base: `origin/main`

## Verification

Status: BLOCKED - one or more local readiness checks failed

Checks run:
- `npm run release:check`
- `bash scripts/validate.sh`
- `node releasebox check .`

## Check output summary

    ## npm run release:check
    ```
    npm run release:check
    ```
    ```text
    
    > ossmeter@0.1.0 release:check
    > npm run check && npm test && npm run smoke && npm run package:smoke && releasebox check && npm pack --dry-run
    
    
    > ossmeter@0.1.0 check
    > tsc -p tsconfig.json --noEmit
    
    error TS2688: Cannot find type definition file for 'node'.
      The file is in the program because:
        Entry point of type library 'node' specified in compilerOptions
    ```
    RESULT: 2 (1s)
    
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
    
    error TS2688: Cannot find type definition file for 'node'.
      The file is in the program because:
        Entry point of type library 'node' specified in compilerOptions
    FAIL: package script: check
    
    > ossmeter@0.1.0 test
    > node --test --import tsx test/*.test.ts
    
    node:internal/modules/package_json_reader:301
      throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
            ^
    
    Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from /Users/roger/Developer/my-opensource/.rc-readiness-worktrees/ossmeter/
        at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
        at packageResolve (node:internal/modules/esm/resolve:764:81)
        at moduleResolve (node:internal/modules/esm/resolve:855:18)
        at defaultResolve (node:internal/modules/esm/resolve:988:11)
        at #cachedDefaultResolve (node:internal/modules/esm/loader:697:20)
        at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:714:38)
        at ModuleLoader.resolveSync (node:internal/modules/esm/loader:746:52)
        at #resolve (node:internal/modules/esm/loader:679:17)
        at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:599:35)
        at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:628:32) {
      code: 'ERR_MODULE_NOT_FOUND'
    }
    
    Node.js v25.8.0
    ✖ test/discover.test.ts (62.290084ms)
    node:internal/modules/package_json_reader:301
      throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
            ^
    
    Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from /Users/roger/Developer/my-opensource/.rc-readiness-worktrees/ossmeter/
        at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
        at packageResolve (node:internal/modules/esm/resolve:764:81)
        at moduleResolve (node:internal/modules/esm/resolve:855:18)
        at defaultResolve (node:internal/modules/esm/resolve:988:11)
        at #cachedDefaultResolve (node:internal/modules/esm/loader:697:20)
        at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:714:38)
        at ModuleLoader.resolveSync (node:internal/modules/esm/loader:746:52)
        at #resolve (node:internal/modules/esm/loader:679:17)
        at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:599:35)
        at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:628:32) {
      code: 'ERR_MODULE_NOT_FOUND'
    }
    
    Node.js v25.8.0
    ✖ test/format.test.ts (62.312917ms)
    node:internal/modules/package_json_reader:301
      throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
            ^
    
    Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from /Users/roger/Developer/my-opensource/.rc-readiness-worktrees/ossmeter/
        at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
        at packageResolve (node:internal/modules/esm/resolve:764:81)
        at moduleResolve (node:internal/modules/esm/resolve:855:18)
        at defaultResolve (node:internal/modules/esm/resolve:988:11)
        at #cachedDefaultResolve (node:internal/modules/esm/loader:697:20)
        at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:714:38)
        at ModuleLoader.resolveSync (node:internal/modules/esm/loader:746:52)
        at #resolve (node:internal/modules/esm/loader:679:17)
        at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:599:35)
        at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:628:32) {
      code: 'ERR_MODULE_NOT_FOUND'
    }
    
    Node.js v25.8.0
    ✖ test/quality.test.ts (61.4135ms)
    node:internal/modules/package_json_reader:301
      throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
            ^
    
    Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from /Users/roger/Developer/my-opensource/.rc-readiness-worktrees/ossmeter/
        at Object.getPackageJSONURL (node:internal/modules/package_json_reader:301:9)
        at packageResolve (node:internal/modules/esm/resolve:764:81)
        at moduleResolve (node:internal/modules/esm/resolve:855:18)
        at defaultResolve (node:internal/modules/esm/resolve:988:11)
        at #cachedDefaultResolve (node:internal/modules/esm/loader:697:20)
        at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:714:38)
        at ModuleLoader.resolveSync (node:internal/modules/esm/loader:746:52)
        at #resolve (node:internal/modules/esm/loader:679:17)
        at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:599:35)
        at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:628:32) {
      code: 'ERR_MODULE_NOT_FOUND'
    }
    
    Node.js v25.8.0
    ✖ test/scanner.test.ts (62.478375ms)
    ℹ tests 4
    ℹ suites 0
    ℹ pass 0
    ℹ fail 4
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 71.4915
    
    ✖ failing tests:
    
    test at test/discover.test.ts:1:1
    ✖ test/discover.test.ts (62.290084ms)
      'test failed'
    
    test at test/format.test.ts:1:1
    ✖ test/format.test.ts (62.312917ms)
      'test failed'
    
    test at test/quality.test.ts:1:1
    ✖ test/quality.test.ts (61.4135ms)
      'test failed'
    
    test at test/scanner.test.ts:1:1
    ✖ test/scanner.test.ts (62.478375ms)
      'test failed'
    FAIL: package script: test
    
    > ossmeter@0.1.0 build
    > tsc -p tsconfig.json
    
    error TS2688: Cannot find type definition file for 'node'.
      The file is in the program because:
        Entry point of type library 'node' specified in compilerOptions
    FAIL: package script: build
    NOTE: agent-qc not installed; skipping optional agent check
    
    Validation failed.
    ```
    RESULT: 1 (1s)
    
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
    
