# Project Overview

> Managed by `npm run adapters:render`. Edit `adapters/policy/agent-repo-kit-policy.mjs` instead of hand-editing this file.

Agent Repo Kit provides two public skills: report scores a repo for AI coding agents, and fix adds the minimum docs, rules, checks, and guardrails agents need.

The main goals are:

- make repo readiness visible with a shareable score
- give agents one clear onboarding and verification path
- keep risky changes, secret handling, and publish safety explicit
- support Claude Code first while keeping Codex and Cursor projections honest

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

1. Start with `npm run report` to establish the current score.
2. Use `npm run fix -- --dry-run` before applying repo changes.
3. Make the smallest safe edit that improves a failed check.
4. Run focused verification such as `npm test`, `npm run adapters:check`, and `npm run report`.
5. Summarize the score change, files touched, and remaining risk.

# Public Skills

## agent-repo-report

Analyze a repository, score agent readiness, and generate shareable report artifacts.

1. Run `npm run report`.
2. Read the score, failed checks, and top fixes before suggesting edits.
3. Use `AGENT_REPO_REPORT.md` for human review and `agent-repo-card.svg` for sharing.
4. Do not change repository files as part of report-only work.

## agent-repo-fix

Apply the smallest repo changes that make AI coding agents easier to onboard and verify.

1. Run `npm run fix -- --dry-run` first.
2. Explain every planned file change in plain language.
3. Apply changes only after explicit user confirmation.
4. Run `npm run report` again and compare the new score.

# Publish Safety

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
