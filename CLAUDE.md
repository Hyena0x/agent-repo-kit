# Project Overview

> Managed by `npm run adapters:render`. Edit `adapters/policy/repo-guard-policy.mjs` instead of hand-editing this file.

This repository provides Claude Code-first guardrails for AI coding repos plus a publish-time release guard for Node packages.

The main goals are:

- keep destructive commands out of normal repo work
- prevent accidental package leaks before `npm publish`
- make high-risk operations explicit and reviewable

# Safety Red Lines

Do not read or print secrets from:

- `./.env`
- `./.env.*`
- `./secrets/**`
- `./certs/**`
- `./*.pem`
- `./**/*.pem`

Do not run destructive Bash commands such as:

- `rm -rf`
- `git push --force`
- `chmod 777`
- `mkfs`
- `dd if=... of=/dev/...`
- `curl ... | bash`
- `wget ... | sh`

Do not publish packages without an explicit user confirmation.

# Working Workflow

When making changes in this repo:

1. Understand the requested change and the likely impact.
2. Make the smallest safe edit that solves the problem.
3. Run focused verification such as `npm test` and `npm run audit:pack`.
4. Summarize what changed, what was verified, and any remaining risk.

# Release Expectations

Before suggesting a release or publish action:

1. Run `npm run audit:pack`.
2. Summarize every warning or failure in plain language.
3. Suggest the smallest fix, usually tightening `package.json` `files` or ignore rules.
4. Wait for user confirmation before any publish-related command such as `npm publish`.

# High-Risk Operations

For any risky action such as force pushes, file deletion, permission changes, or publishing:

- explain why the action is needed
- explain the likely impact
- ask for confirmation before proceeding
