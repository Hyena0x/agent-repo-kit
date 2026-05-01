# Tool Adapters

This directory keeps the Agent Repo Kit policy source of truth separate from any one AI coding tool.

## Design

- `policy/` owns the shared semantics: report, fix, publish safety, review checks, secret paths, and risky shell detectors.
- `targets/codex/` maps the shared policy to a Codex-style `AGENTS.md` instruction file.
- `targets/cursor/` maps the shared policy to official Cursor project rules in `.cursor/rules/*.mdc`.
- `targets/claude-code/` maps that policy to Claude Code files such as `.claude/settings.json`, `CLAUDE.md`, the hook, skills, and slash commands.
- `targets/generic/` exports a tool-agnostic JSON manifest that future adapters can consume without reverse-engineering Claude-specific files.

## Why This Split Exists

Claude Code is still the richest target in this repo because it supports skills, commands, settings, and hooks. The adapter layer is here so product meaning does not get trapped in one tool's syntax.

That boundary keeps us honest:

- policy files answer "what do we want to express?"
- adapters answer "how does this specific tool express it?"

## Current Contract

If a new tool adapter is added later, it should consume the shared policy and map at least these surfaces:

- report command and outputs
- dry-run-first fix workflow
- command permissions
- sensitive-path handling
- publish-safety workflow
- review guidance
- high-risk command interception, if the tool supports it

## Commands

- `npm run adapters:render` rewrites generated tool artifacts and the generic manifest.
- `npm run adapters:check` verifies the committed generated files still match the shared policy.

Edit `policy/agent-repo-kit-policy.mjs`, then render adapters. Do not treat the generated files as the long-term source of truth.
