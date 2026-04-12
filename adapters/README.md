# Tool Adapters

This directory keeps the policy source of truth separate from any one AI coding tool.

## Design

- `policy/` owns the shared semantics: release flow, review checks, secret paths, and risky shell detectors.
- `targets/codex/` maps the shared policy to a Codex-style `AGENTS.md` instruction file.
- `targets/cursor/` maps the shared policy to official Cursor project rules in `.cursor/rules/*.mdc`.
- `targets/claude-code/` maps that policy to Claude Code files such as `.claude/settings.json`, `CLAUDE.md`, the hook, the skill, and the slash command.
- `targets/generic/` exports a tool-agnostic JSON manifest that future adapters can consume without reverse-engineering Claude-specific files.

## Why this split exists

Claude Code is still the first-class target in this repo. The adapter layer is here so we do not hard-code policy meaning into one tool's syntax forever.

That boundary keeps us honest:

- policy files answer "what do we want to enforce?"
- adapters answer "how does this specific tool express it?"

## Current contract

If a new tool adapter is added later, it should consume the shared policy and map at least these surfaces:

- command permissions
- sensitive-path handling
- publish-time release workflow
- review guidance
- high-risk command interception, if the tool supports it

## Commands

- `npm run adapters:render` rewrites generated Claude-facing artifacts and the generic manifest.
- `npm run adapters:check` verifies the committed generated files still match the shared policy.

Edit `policy/repo-guard-policy.mjs`, then render adapters. Do not treat the Claude-generated files as the long-term source of truth.
