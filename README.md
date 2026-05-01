# Agent Repo Kit

Make any GitHub repo ready for Claude Code, Codex, and Cursor in two commands.

[![agent-repo-kit](https://github.com/Hyena0x/agent-repo-kit/actions/workflows/agent-repo-kit.yml/badge.svg)](https://github.com/Hyena0x/agent-repo-kit/actions/workflows/agent-repo-kit.yml)
[![npm version](https://img.shields.io/npm/v/agent-repo-kit.svg)](https://www.npmjs.com/package/agent-repo-kit)
[![release](https://img.shields.io/github/v/release/Hyena0x/agent-repo-kit?label=release)](https://github.com/Hyena0x/agent-repo-kit/releases/latest)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/Hyena0x/agent-repo-kit/blob/main/LICENSE)

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

Agent Repo Kit checks whether your repo has the signals AI coding agents need: instructions, verification commands, CI, secret rules, and publish safety. It generates a readiness score, a markdown report, machine-readable JSON, and a shareable card, then previews the smallest fixes.

- **No setup required**: run it with `npx`
- **Dry-run first**: inspect fixes before files change
- **Shareable output**: publish the score, report, JSON, or card

## Why It Exists

Most repos are not agent-ready. They may have tests and docs, but agents still need clear answers:

- where repo instructions live
- which command proves a change works
- whether CI exists
- which local files must stay secret
- whether package publish safety is in place

Agent Repo Kit turns those signals into a simple report-and-fix loop.

## Quickstart

Run the read-only report:

```bash
npx agent-repo-kit report
```

It writes:

- `AGENT_REPO_REPORT.md`
- `.agent-repo-kit/report.json`
- `agent-repo-card.svg`

Preview fixes:

```bash
npx agent-repo-kit fix --dry-run
```

Apply only after reviewing the dry-run:

```bash
npx agent-repo-kit fix
npx agent-repo-kit report
```

## Commands

| Goal | Command |
| --- | --- |
| Score a repo | `npx agent-repo-kit report` |
| Preview fixes | `npx agent-repo-kit fix --dry-run` |
| Apply fixes | `npx agent-repo-kit fix` |

In v1, `fix` creates a missing `AGENTS.md` and tightens common local-secret ignore rules.

## What Gets Checked

- agent instruction entrypoints such as `AGENTS.md`, `CLAUDE.md`, and Cursor rules
- verification commands such as tests and builds
- README quickstart and development guidance
- GitHub Actions CI
- `.gitignore` coverage for local secrets
- package publish safety such as `files` and `npm run audit:pack`

## Agent Surfaces

Agent Repo Kit keeps one shared policy and renders native surfaces for different tools:

- Claude Code: `.claude/skills/*`, slash commands, settings, hook
- Codex: `AGENTS.md`
- Cursor: `.cursor/rules/*.mdc`
- Generic: `adapters/generated/agent-repo-kit-policy.json`

## Development

```bash
npm install
npm run adapters:check
npm test
npm run audit:pack
```

If policy or renderer behavior changes:

```bash
npm run adapters:render
```

Not affiliated with Anthropic, OpenAI, or Cursor.

## License

MIT
