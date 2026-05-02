# Output formats

ossmeter supports three output modes.

## Table

The default table is meant for terminals and quick human reads.

```sh
ossmeter scan .
```

## Markdown

Markdown is useful for sprint notes, changelogs, and pull request summaries.

```sh
ossmeter scan . --markdown --since "7 days ago"
```

## JSON

JSON is stable enough for local automation and agents. The top-level object contains `summary` and `repositories`.

```sh
ossmeter scan . --json --include-all-time
```
