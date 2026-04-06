# release-guard

Use this skill before any package publish flow.

## Goal

Check whether the package contents are safe to publish.

## Workflow

1. Run `npm run audit:pack`.
2. Summarize every warning or failure in plain language.
3. Suggest the smallest fix, usually tightening `package.json` `files` or ignore rules.
4. Do not publish the package on the user's behalf.
