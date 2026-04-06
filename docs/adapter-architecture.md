# Adapter Architecture

`repo-guard-starter` is still Claude Code-first, but the policy surface now has a clean split between shared intent and tool-specific rendering.

## Layers

1. `adapters/policy/repo-guard-policy.mjs`
   Defines the shared policy:
   - positioning
   - release-guard workflow
   - permission intent
   - risky command detectors
   - review checklist
2. `adapters/targets/*/render.mjs`
   Maps that policy onto concrete files a tool actually understands.

Today there are two render targets:

- `codex`
  - renders `AGENTS.md`
  - carries shared repo instructions without faking Claude-only hook or permission support
- `claude-code`
  - renders `.claude/settings.json`
  - renders `.claude/hooks/pre-tool-check.js`
  - renders `CLAUDE.md`, `REVIEW.md`, the release-guard skill, and the slash command
- `generic`
  - exports `adapters/generated/repo-guard-policy.json`
  - acts as an interchange manifest for future adapters

## Why this matters

Without this split, every new tool integration would copy the same rules into a different syntax, and those copies would drift.

With the split:

- policy answers "what are we trying to enforce?"
- adapters answer "how does this tool express that policy?"

## Current extension path

If we add another tool later, the adapter should consume the shared policy and translate at least these surfaces:

- safe-by-default commands
- ask-before-running commands
- denied secret paths
- release-guard workflow guidance
- code-review checklist
- risky shell interception, if the target tool supports it

## Caveat

This is intentionally not a fake 1:1 abstraction over every AI coding tool. Claude Code has native concepts like hooks, slash commands, and skills that other tools may not share. Future adapters should translate intent honestly and fall back to docs plus CI when a target tool cannot enforce a runtime rule directly.
