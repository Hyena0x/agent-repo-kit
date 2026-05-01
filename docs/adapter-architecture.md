# Adapter Architecture

Agent Repo Kit is product-first and adapter-backed. The public surface is two skills, while the adapter layer keeps Claude Code, Codex, Cursor, and future tools aligned.

## Layers

1. `adapters/policy/agent-repo-kit-policy.mjs`
   Defines the shared policy:
   - positioning
   - report workflow
   - fix workflow
   - publish-safety workflow
   - permission intent
   - risky command detectors
   - review checklist
2. `adapters/targets/*/render.mjs`
   Maps that policy onto concrete files a tool actually understands.

Today there are four render targets:

- `codex`
  - renders `AGENTS.md`
  - carries shared repo instructions without faking Claude-only hook or permission support
- `cursor`
  - renders `.cursor/rules/*.mdc`
  - uses official Cursor project rules instead of inventing a fake hook or permission layer
- `claude-code`
  - renders `.claude/settings.json`
  - renders `.claude/hooks/pre-tool-check.js`
  - renders `CLAUDE.md`, `REVIEW.md`, both public skills, and both slash commands
- `generic`
  - exports `adapters/generated/agent-repo-kit-policy.json`
  - acts as an interchange manifest for future adapters

## Why This Matters

Without this split, every new tool integration would copy the same report, fix, and safety rules into a different syntax, and those copies would drift.

With the split:

- policy answers "what are we trying to do?"
- adapters answer "how does this tool express that workflow?"

## Current Extension Path

If we add another tool later, the adapter should consume the shared policy and translate at least these surfaces:

- report command and outputs
- dry-run-first fix workflow
- safe-by-default commands
- ask-before-running commands
- denied secret paths
- publish-safety guidance
- code-review checklist
- risky shell interception, if the target tool supports it

## Caveat

This is intentionally not a fake 1:1 abstraction over every AI coding tool. Claude Code has native concepts like hooks, slash commands, and skills that other tools may not share. Future adapters should translate intent honestly and fall back to docs plus CI when a target tool cannot enforce a runtime rule directly.
