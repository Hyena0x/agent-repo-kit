---
description: Run the release guard before any publish flow
allowed-tools: Bash(npm run audit:pack)
---

Use the repository release-guard workflow before any publish action.

## Context

- Latest release-guard output: !`npm run audit:pack`

## Your task

1. Run `npm run audit:pack`.
2. Summarize every warning or failure in plain language.
3. Suggest the smallest fix, usually tightening `package.json` `files` or ignore rules.
4. Do not publish the package on the user's behalf.
