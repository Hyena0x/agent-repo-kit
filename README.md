# repo-guard-starter

Safe defaults and release guard for AI coding repos.

Built for Claude Code first, designed to extend to other AI coding tools. In v1, the Claude-specific pieces are the shared repo config, hook, skill, and slash command. The release guard itself is plain Node.js plus GitHub Actions, so the package-audit workflow can travel to other toolchains later.

Compatible with Claude Code. Not affiliated with Anthropic.

## Why this exists

AI coding tools can move fast enough to make small mistakes expensive. A repo that feels safe in day-to-day editing can still leak sourcemaps, tests, draft docs, or sensitive files at publish time.

`repo-guard-starter` keeps the first version intentionally small:

- Claude Code-first guardrails for day-to-day repo work
- A shared policy layer that can be rendered into tool-specific adapters
- A publish-time audit that inspects the exact `npm pack` tarball
- CI wiring that blocks a merge when risky files would ship

## What ships in v1

- `CLAUDE.md` for project guidance and security red lines
- `AGENTS.md` as a Codex-style repo instruction file generated from the shared policy
- `.cursor/rules/*.mdc` as official Cursor project rules generated from the shared policy
- `REVIEW.md` for review-specific checks
- `adapters/policy/repo-guard-policy.mjs` as the shared policy source of truth
- `adapters/targets/*` renderers so Claude Code files are generated from shared policy
- `.claude/settings.json` with minimal permission rules and a registered `PreToolUse` hook
- `.claude/hooks/pre-tool-check.js` to deny obviously destructive Bash commands
- `.claude/skills/release-guard/SKILL.md` for publish-time guidance
- `.claude/commands/release-guard.md` so teams also get a real `/release-guard` slash command
- `adapters/generated/repo-guard-policy.json` as a neutral manifest for future tool adapters
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

## Tool adapters

The shared policy now lives outside the Claude-specific files.

- edit `adapters/policy/repo-guard-policy.mjs`
- run `npm run adapters:render`
- verify with `npm run adapters:check`

Today the repo ships real target adapters for Claude Code, Codex, and Cursor, plus one generic JSON manifest exporter. That is enough to keep Claude Code first-class while giving future Amp or custom internal adapters a stable input format. More detail lives in `adapters/README.md` and `docs/adapter-architecture.md`.

## Design notes

This repo is intentionally Claude Code-first instead of pretending every AI coding tool works the same way today. The repo-level permissions, hook registration, and slash-command ergonomics are tailored for Claude Code first. The difference now is that those Claude files are rendered from a shared policy model, so the release audit, review rules, and risky-command semantics are no longer trapped inside one tool's syntax.

## Repo layout

```text
repo-guard-starter/
├── AGENTS.md
├── .cursor/
│   └── rules/
│       ├── release-guard.mdc
│       └── repo-guard.mdc
├── adapters/
│   ├── generated/
│   │   └── repo-guard-policy.json
│   ├── policy/
│   │   └── repo-guard-policy.mjs
│   ├── targets/
│   │   ├── codex/
│   │   │   └── render.mjs
│   │   ├── cursor/
│   │   │   └── render.mjs
│   │   ├── claude-code/
│   │   │   └── render.mjs
│   │   └── generic/
│   │       └── render.mjs
│   └── README.md
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
├── docs/
│   └── adapter-architecture.md
├── package.json
├── scripts/
│   ├── audit-pack.mjs
│   └── render-adapters.mjs
└── tests/
    ├── adapter-renderer.test.mjs
    └── audit-pack.test.mjs
```

## MCP example

`.mcp.json.example` is only a safe placeholder. Claude Code reads project MCP servers from `.mcp.json`, so copy the example to `.mcp.json` and wire in real servers yourself when needed.

## Future

Future: policy packs / plugin version / team templates
