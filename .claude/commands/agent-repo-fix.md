---
description: Preview Agent Repo Kit fixes before applying them
allowed-tools: Bash(npm run fix -- --dry-run)
---

Use agent-repo-fix only after an Agent Repo Report exists or the user explicitly asks to improve repo readiness.

## Context

- Planned changes: !`npm run fix -- --dry-run`

## Your task

1. Run `npm run fix -- --dry-run` first.
2. Explain every planned file change in plain language.
3. Apply changes only after explicit user confirmation.
4. Run `npm run report` again and compare the new score.

Do not apply changes without explicit user confirmation.
