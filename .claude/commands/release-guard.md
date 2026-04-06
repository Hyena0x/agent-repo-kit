---
description: Run the release guard before any publish flow
---

Use the repository release-guard workflow before any publish action.

1. Run `npm run audit:pack`.
2. Summarize any warnings or failures.
3. Suggest the narrowest fix.
4. Do not execute `npm publish` unless the user explicitly asks for it.
