# agent-repo-report

Use this skill when a user wants to analyze, score, or share how ready a repo is for AI coding agents.

## Goal

Analyze a repository, score agent readiness, and generate shareable report artifacts.

## Outputs

- `AGENT_REPO_REPORT.md`
- `.agent-repo-kit/report.json`
- `agent-repo-card.svg`

## Workflow

1. Run `npm run report`.
2. Read the score, failed checks, and top fixes before suggesting edits.
3. Use `AGENT_REPO_REPORT.md` for human review and `agent-repo-card.svg` for sharing.
4. Do not change repository files as part of report-only work.
