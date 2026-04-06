# AGENTS.md

> Managed by `npm run adapters:render`. Edit `adapters/policy/repo-guard-policy.mjs` instead of hand-editing this file.

This file is the Codex-oriented projection of the shared repo-guard policy. It is intentionally instruction-first: it carries workflow, review, and release expectations, but it does not pretend Codex has Claude Code's hook or permission model.

## Project Overview

This repository provides Claude Code-first guardrails for AI coding repos plus a publish-time release guard for Node packages.

Primary positioning:

- Built for Claude Code first, designed to extend to other AI coding tools.
- Primary tool today: Claude Code
- Extension targets: Codex, Cursor, Amp

## Core Goals

- keep destructive commands out of normal repo work
- prevent accidental package leaks before `npm publish`
- make high-risk operations explicit and reviewable

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

1. Understand the requested change and the likely impact.
2. Make the smallest safe edit that solves the problem.
3. Run focused verification such as `npm test` and `npm run audit:pack`.
4. Summarize what changed, what was verified, and any remaining risk.

## Release Guard

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
- flag newly added API routes that do not appear to have tests
- ignore formatting-only changes and lockfile noise unless they hide a real issue
