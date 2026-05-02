# Contributing

Thanks for helping improve `ossmeter`.

This project values small, reviewable contributions with clear verification. Keep the CLI local-first unless a future feature is explicitly documented as opt-in network behavior.

## Development

```sh
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Pull Requests

Pull requests should:

- Focus on one reviewable intent.
- Use Conventional Commits.
- Include tests or verification appropriate to the change.
- Update docs when behavior or usage changes.
- Avoid unrelated formatting or dependency churn.
- Avoid secrets, private contact details, and project-specific sensitive information.

## Review Pack

Use this format for meaningful changes:

```md
## Review Pack
Repo:
Branch:
Task:
Status: done / blocked / needs review
Summary:
Commits:
Files changed:
Verification:
Risk level:
Rollback plan:
Human decision needed:
Next recommended task:
```

## Metric changes

Metric definitions are user-facing behavior. If a PR changes a metric, update `docs/METRICS.md`, tests, and examples in the same change.
