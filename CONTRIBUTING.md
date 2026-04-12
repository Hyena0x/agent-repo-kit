# Contributing

Thanks for helping improve `repo-guard-starter`.

## Before you open a PR

Please keep changes small and intentional. This project is trying to stay useful for real repos, not become a giant collection of speculative integrations.

Before opening a pull request:

1. Explain the user problem or workflow gap the change addresses.
2. Prefer updating the shared policy and renderer pipeline instead of hand-editing generated adapter files.
3. Regenerate adapter outputs when policy or renderer behavior changes.
4. Run the local checks listed below.

## Local development

Install dependencies and run the main checks:

```bash
npm install
npm run adapters:check
npm test
npm run audit:pack
```

If you change the shared policy or any renderer, refresh generated files first:

```bash
npm run adapters:render
```

## Repository conventions

- Treat `adapters/policy/repo-guard-policy.mjs` as the source of truth for shared semantics.
- Treat generated files such as `AGENTS.md`, `.claude/...`, and `.cursor/rules/*.mdc` as outputs of the render pipeline.
- Keep adapter mappings honest. If a target tool does not support Claude-style hooks or permission rules, do not fake a one-to-one translation.
- Do not expand scope with enterprise integrations unless there is a concrete repo-level use case.

## Pull request expectations

Good PRs in this repository usually include:

- a short explanation of what changed
- why the change matters to repo safety or release guard behavior
- the checks you ran
- any limitations or future follow-up if the adapter surface is partial by design
