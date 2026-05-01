# Review Rules

> Managed by `npm run adapters:render`. Edit `adapters/policy/agent-repo-kit-policy.mjs` instead of hand-editing this file.

When reviewing code in this repository:

- flag hard-coded keys, tokens, passwords, or credentials
- flag logs that may expose secrets or sensitive identifiers
- flag likely SQL injection, XSS, SSRF, or command-injection paths
- flag newly added agent-facing commands that do not have tests
- flag generated adapter files that drift from the shared policy
- ignore formatting-only changes and lockfile noise unless they hide a real issue
