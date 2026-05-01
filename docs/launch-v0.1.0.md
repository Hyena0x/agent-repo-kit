# Agent Repo Kit v0.1.0 Launch Copy

Primary link:

https://github.com/Hyena0x/agent-repo-kit

Install:

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

## Positioning

Agent Repo Kit scores and fixes GitHub repos for AI coding agents.

It gives maintainers two public skills:

- `agent-repo-report`: generate an agent-readiness report, JSON output, and share card
- `agent-repo-fix`: preview and apply the smallest repo hardening changes agents need

## Short Post

Agent Repo Kit v0.1.0 is live.

It scores and fixes GitHub repos for AI coding agents:

- report: readiness score, markdown report, JSON, share card
- fix: dry-run-first hardening for agent instructions and local secret rules
- works across Claude Code, Codex, Cursor, and generic agent workflows

Try it:

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

https://github.com/Hyena0x/agent-repo-kit

## Longer Post

AI coding agents are only as good as the repo context they receive.

Many repos have tests, CI, and docs, but still leave agents guessing:

- which command proves a change works
- where repo-specific instructions live
- which files should never ship
- what a safe first fix should look like

Agent Repo Kit turns that into a simple loop:

1. Run `agent-repo-kit report` to generate a readiness score, markdown report, JSON output, and share card.
2. Run `agent-repo-kit fix --dry-run` to preview the smallest hardening changes.
3. Apply fixes only after review.

v0.1.0 is now published on npm:

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

Repo:

https://github.com/Hyena0x/agent-repo-kit

## GitHub Release Follow-Up

Agent Repo Kit v0.1.0 is the first public release: an npm-published CLI for scoring and fixing GitHub repos for AI coding agents.

Use `agent-repo-report` for read-only readiness analysis and `agent-repo-fix` for dry-run-first hardening.

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```
