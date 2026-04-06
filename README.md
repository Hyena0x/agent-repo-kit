# repo-guard-starter

Safe defaults and release guard for AI coding repos.

Built for Claude Code first, designed to extend to other AI coding tools. In v1, the Claude-specific pieces are the shared repo config, hook, skill, and slash command. The release guard itself is plain Node.js plus GitHub Actions, so the package-audit workflow can travel to other toolchains later.

Compatible with Claude Code. Not affiliated with Anthropic.

## Why this exists

AI coding tools can move fast enough to make small mistakes expensive. A repo that feels safe in day-to-day editing can still leak sourcemaps, tests, draft docs, or sensitive files at publish time.

`repo-guard-starter` keeps the first version intentionally small:

- Claude Code-first guardrails for day-to-day repo work
- A publish-time audit that inspects the exact `npm pack` tarball
- CI wiring that blocks a merge when risky files would ship

## What ships in v1

- `CLAUDE.md` for project guidance and security red lines
- `REVIEW.md` for review-specific checks
- `.claude/settings.json` with minimal permission rules and a registered `PreToolUse` hook
- `.claude/hooks/pre-tool-check.js` to deny obviously destructive Bash commands
- `.claude/skills/release-guard/SKILL.md` for publish-time guidance
- `.claude/commands/release-guard.md` so teams also get a real `/release-guard` slash command
- `scripts/audit-pack.mjs` to inspect packed artifacts for risky files
- `.github/workflows/release-guard.yml` to run the guard in PRs

## Quickstart

You can get the starter working in about three minutes.

```bash
npm install
npm test
npm run audit:pack
```

Then copy the example MCP file only if you need it:

```bash
cp .mcp.json.example .mcp.json
```

If you use Claude Code in the repo, the shared project settings are already in place:

- read the guardrails in `CLAUDE.md`
- inspect the review rules in `REVIEW.md`
- use `/release-guard` before any publish flow

## Example blocked release

If your package accidentally includes a sourcemap, the audit stops the release:

```text
$ npm run audit:pack

repo-guard-starter release guard
Packed artifact: repo-guard-starter-0.1.0.tgz
Files inspected: 10

WARN
- package/dist/index.js.map [source-map] Sourcemaps should not ship in the published tarball.

Release guard blocked this package. Tighten package.json "files" or your ignore rules before publishing.
```

Warnings and failures both exit non-zero on purpose, so CI can fail early.

## Design notes

This repo is intentionally Claude Code-first instead of pretending every AI coding tool works the same way today. The repo-level permissions, hook registration, and slash-command ergonomics are tailored for Claude Code first. The release audit is tool-agnostic by design, which is the part we can reuse later in Codex, Cursor, Amp, or other AI-assisted workflows.

## Repo layout

```text
repo-guard-starter/
├── .claude/
│   ├── commands/
│   │   └── release-guard.md
│   ├── hooks/
│   │   └── pre-tool-check.js
│   ├── settings.json
│   └── skills/
│       └── release-guard/
│           └── SKILL.md
├── .github/
│   └── workflows/
│       └── release-guard.yml
├── .env.example
├── .gitignore
├── .mcp.json.example
├── CLAUDE.md
├── REVIEW.md
├── README.md
├── package.json
├── scripts/
│   └── audit-pack.mjs
└── tests/
    └── audit-pack.test.mjs
```

## MCP example

`.mcp.json.example` is only a safe placeholder. Claude Code reads project MCP servers from `.mcp.json`, so copy the example to `.mcp.json` and wire in real servers yourself when needed.

## Future

Future: policy packs / plugin version / team templates
