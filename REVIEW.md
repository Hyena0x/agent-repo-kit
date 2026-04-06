# Review Rules

When reviewing code in this repository:

- flag hard-coded keys, tokens, passwords, or credentials
- flag logs that may expose secrets or sensitive identifiers
- flag likely SQL injection, XSS, SSRF, or command-injection paths
- flag newly added API routes that do not appear to have tests
- ignore formatting-only changes and lockfile noise unless they hide a real issue
