# agent-repo-fix

Use this skill when a user wants to improve a repo after reviewing an Agent Repo Report.

## Goal

Apply the smallest repo changes that make AI coding agents easier to onboard and verify.

## Workflow

1. Run `npm run fix -- --dry-run` first.
2. Explain every planned file change in plain language.
3. Apply changes only after explicit user confirmation.
4. Run `npm run report` again and compare the new score.

## Safety

- Prefer dry-run output before edits.
- Preserve existing user content unless a generated replacement is clearly requested.
- Keep publish safety as one fix module, not a separate public skill.
