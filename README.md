# Agent Repo Kit

Score and fix your GitHub repo for AI coding agents.

[![agent-repo-kit](https://github.com/Hyena0x/agent-repo-kit/actions/workflows/agent-repo-kit.yml/badge.svg)](https://github.com/Hyena0x/agent-repo-kit/actions/workflows/agent-repo-kit.yml)
[![npm version](https://img.shields.io/npm/v/agent-repo-kit.svg)](https://www.npmjs.com/package/agent-repo-kit)
[![release](https://img.shields.io/github/v/release/Hyena0x/agent-repo-kit?label=release)](https://github.com/Hyena0x/agent-repo-kit/releases/latest)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/Hyena0x/agent-repo-kit/blob/main/LICENSE)

Agent Repo Kit turns repo readiness into a visible loop:

1. **Report**: analyze the repo, generate a score, and create a shareable card.
2. **Fix**: preview and apply the smallest docs, rules, checks, and guardrails agents need.

Compatible with Claude Code, Codex, and Cursor. Not affiliated with Anthropic, OpenAI, or Cursor.

## Why This Exists

AI coding agents can move quickly, but many repos do not tell them how to work safely. A repo may have tests, CI, and docs, yet still leave agents guessing which command proves a change works, where secrets are off-limits, or what files should never ship.

Agent Repo Kit gives maintainers two public skills:

- `agent-repo-report` for read-only analysis, scoring, and share artifacts
- `agent-repo-fix` for dry-run-first repo hardening

## Quickstart

Published package usage:

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

From a source checkout:

```bash
npm install
npm run report
npm run fix -- --dry-run
```

The report writes:

- `AGENT_REPO_REPORT.md`
- `.agent-repo-kit/report.json`
- `agent-repo-card.svg`

Apply fixes only after reviewing the dry-run output:

```bash
npx agent-repo-kit fix
npx agent-repo-kit report
```

## What Gets Checked

The first report pass scores:

- agent instruction entrypoints such as `AGENTS.md`, `CLAUDE.md`, or Cursor rules
- visible verification commands such as `npm test`, build scripts, or Rust tests
- README quickstart and development guidance
- GitHub Actions CI presence
- `.gitignore` rules for local secrets
- package publish safety such as `files` or `npm run audit:pack`

## Skills

### `agent-repo-report`

Use this when you want a repo score and shareable artifacts without changing files.

```bash
npx agent-repo-kit report
```

### `agent-repo-fix`

Use this after reading a report. Always preview before writing.

```bash
npx agent-repo-kit fix --dry-run
npx agent-repo-kit fix
```

In v1 the fix script creates a missing `AGENTS.md` and tightens common local-secret ignore rules. The existing publish-safety audit remains available as a fix module:

```bash
npm run audit:pack
```

## Adapter Model

Agent Repo Kit keeps one shared policy and renders tool-specific surfaces from it.

- edit `adapters/policy/agent-repo-kit-policy.mjs`
- run `npm run adapters:render`
- verify with `npm run adapters:check`

Current targets:

- Claude Code: `.claude/skills/*`, slash commands, settings, hook
- Codex: `AGENTS.md`
- Cursor: `.cursor/rules/*.mdc`
- Generic: `adapters/generated/agent-repo-kit-policy.json`

## Development

```bash
npm install
node ./scripts/agent-repo-kit.mjs --help
npm run adapters:check
npm test
npm run audit:pack
```

If policy or renderer behavior changes:

```bash
npm run adapters:render
```

## Repo Layout

```text
agent-repo-kit/
├── AGENTS.md
├── CLAUDE.md
├── REVIEW.md
├── .claude/
│   ├── commands/
│   │   ├── agent-repo-fix.md
│   │   └── agent-repo-report.md
│   ├── hooks/
│   │   └── pre-tool-check.js
│   └── skills/
│       ├── agent-repo-fix/
│       └── agent-repo-report/
├── .cursor/
│   └── rules/
├── adapters/
├── scripts/
│   ├── agent-repo-kit.mjs
│   ├── agent-repo-fix.mjs
│   ├── agent-repo-report.mjs
│   ├── audit-pack.mjs
│   └── render-adapters.mjs
└── tests/
```

## License

MIT
