# PRD: ossmeter

Status: in-progress

## Scorecard

Total: 76/100
Band: promising
Last scored: 2026-04-29
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 16/20 | Sprint visibility matters, but it is less blocking than repo creation, commits, and verification. |
| Demand signal | 15/20 | Clear internal demand from Roger's commit velocity scoreboard; external validation still needed. |
| V1 buildability | 18/20 | Local workspace scanning and reports are feasible. |
| Differentiation | 10/15 | Many git metric tools exist; quality-weighted OSS sprint framing helps. |
| Agentic workflow leverage | 11/15 | Helps manage agents indirectly through measurement. |
| Distribution potential | 6/10 | Scoreboard content could market the OSS sprint well. |

## Pitch

Measure OSS sprint velocity and quality across repos.

## Why It Matters

Roger needs a scoreboard that does not reward vanity commits.

## V1 Scope

- CLI: `ossmeter scan <workspace>`
- Scans local git repos
- Reports commits, branches, files changed, repos touched
- Tracks quality indicators and uncommitted work
- Outputs terminal table, Markdown, JSON

## Out of Scope

- No GitHub API in V1
- No external ranking
- No productivity moralizing

## Verification

- Fixture workspace with multiple git repos
- Snapshot report tests

## Agent Prompt

Build `ossmeter`, a local-first CLI that scans a workspace of git repos and reports daily OSS sprint velocity plus quality signals. Include Markdown/JSON output, fixture workspace tests, README, examples, and clear metric definitions.
