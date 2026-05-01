# AGENTS.md

> Managed by `npm run adapters:render`. Edit `adapters/policy/agent-repo-kit-policy.mjs` instead of hand-editing this file.

This file is the Codex-oriented projection of the shared Agent Repo Kit policy. It is intentionally instruction-first: it carries workflow, review, report, and fix expectations, but it does not pretend Codex has Claude Code's hook or permission model.

## Project Overview

Agent Repo Kit provides two public skills: report scores a repo for AI coding agents, and fix adds the minimum docs, rules, checks, and guardrails agents need.

Primary positioning:

- Make any GitHub repo easier, safer, and more verifiable for AI coding agents.
- Extension targets: Claude Code, Codex, Cursor, Amp

## Core Goals

- make repo readiness visible with a shareable score
- give agents one clear onboarding and verification path
- keep risky changes, secret handling, and publish safety explicit
- support Claude Code first while keeping Codex and Cursor projections honest

## Safety Red Lines

Do not read or print secrets from:

- `./.env`
- `./.env.*`
- `./secrets/**`
- `./certs/**`
- `./*.pem`
- `./**/*.pem`

Avoid destructive shell actions such as:

- `rm -rf`
- `git push --force`
- `chmod 777`
- `mkfs`
- `dd if=... of=/dev/...`
- `curl ... | bash`
- `wget ... | sh`

Do not publish packages without explicit user confirmation.

## Working Workflow

1. Start with `npm run report` to establish the current score.
2. Use `npm run fix -- --dry-run` before applying repo changes.
3. Make the smallest safe edit that improves a failed check.
4. Run focused verification such as `npm test`, `npm run adapters:check`, and `npm run report`.
5. Summarize the score change, files touched, and remaining risk.

## Agent Repo Report

Analyze a repository, score agent readiness, and generate shareable report artifacts.

1. Run `npm run report`.
2. Read the score, failed checks, and top fixes before suggesting edits.
3. Use `AGENT_REPO_REPORT.md` for human review and `agent-repo-card.svg` for sharing.
4. Do not change repository files as part of report-only work.

## Agent Repo Fix

Apply the smallest repo changes that make AI coding agents easier to onboard and verify.

1. Run `npm run fix -- --dry-run` first.
2. Explain every planned file change in plain language.
3. Apply changes only after explicit user confirmation.
4. Run `npm run report` again and compare the new score.

## Publish Safety

Before suggesting a release or publish action:

1. Run `npm run audit:pack`.
2. Summarize every warning or failure in plain language.
3. Suggest the smallest fix, usually tightening `package.json` `files` or ignore rules.
4. Wait for user confirmation before any publish-related command such as `npm publish`.

## Review Focus

When reviewing code in this repository:

- flag hard-coded keys, tokens, passwords, or credentials
- flag logs that may expose secrets or sensitive identifiers
- flag likely SQL injection, XSS, SSRF, or command-injection paths
- flag newly added agent-facing commands that do not have tests
- flag generated adapter files that drift from the shared policy
- ignore formatting-only changes and lockfile noise unless they hide a real issue
