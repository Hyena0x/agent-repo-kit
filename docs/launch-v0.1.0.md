# Agent Repo Kit v0.1.0 Launch Copy

Primary link:

https://github.com/Hyena0x/agent-repo-kit

Install:

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

## One-Liner

Make any GitHub repo ready for Claude Code, Codex, Cursor, and other coding agents in two commands.

## Short Post

Agent Repo Kit v0.1.0 is live.

It checks whether your repo is ready for AI coding agents, then generates:

- a readiness score
- a markdown report
- machine-readable JSON
- a shareable card
- dry-run-first fixes

Try it:

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

https://github.com/Hyena0x/agent-repo-kit

## X / GitHub Pin

Most repos are not ready for AI coding agents.

Agent Repo Kit checks the signals agents need:
instructions, tests, CI, secret rules, and publish safety.

Then it gives you a score, report, JSON, share card, and dry-run fixes.

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

https://github.com/Hyena0x/agent-repo-kit

## Longer Post

AI coding agents are only as good as the repo context they receive.

Many repos have tests, CI, and docs, but still leave agents guessing:

- where repo-specific instructions live
- which command proves a change works
- whether CI exists
- which local files must stay secret
- what a safe first fix should look like

Agent Repo Kit turns those signals into a simple loop:

1. Run `agent-repo-kit report` to generate a readiness score, markdown report, JSON output, and share card.
2. Run `agent-repo-kit fix --dry-run` to preview the smallest hardening changes.
3. Apply fixes only after review.

v0.1.0 is published on npm:

```bash
npx agent-repo-kit report
npx agent-repo-kit fix --dry-run
```

Repo:

https://github.com/Hyena0x/agent-repo-kit
