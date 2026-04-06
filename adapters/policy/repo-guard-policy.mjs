export const repoGuardPolicy = {
  schemaVersion: 1,
  id: "repo-guard-starter",
  positioning: {
    tagline: "Safe defaults and release guard for AI coding repos.",
    summary: "Built for Claude Code first, designed to extend to other AI coding tools.",
    primaryTool: "Claude Code",
    extensionTargets: ["Codex", "Cursor", "Amp"],
    extensionStrategy:
      "Keep policy semantics shared, then let each tool adapter map that policy to its own config, command, and review surfaces."
  },
  releaseGuard: {
    id: "release-guard",
    command: "npm run audit:pack",
    publishCommand: "npm publish",
    summary: "Check whether the package contents are safe to publish.",
    steps: [
      "Run `npm run audit:pack`.",
      "Summarize every warning or failure in plain language.",
      "Suggest the smallest fix, usually tightening `package.json` `files` or ignore rules.",
      "Do not publish the package on the user's behalf."
    ]
  },
  workspace: {
    overview:
      "This repository provides Claude Code-first guardrails for AI coding repos plus a publish-time release guard for Node packages.",
    goals: [
      "keep destructive commands out of normal repo work",
      "prevent accidental package leaks before `npm publish`",
      "make high-risk operations explicit and reviewable"
    ],
    changeWorkflow: [
      "Understand the requested change and the likely impact.",
      "Make the smallest safe edit that solves the problem.",
      "Run focused verification such as `npm test` and `npm run audit:pack`.",
      "Summarize what changed, what was verified, and any remaining risk."
    ],
    highRiskOperations: [
      "explain why the action is needed",
      "explain the likely impact",
      "ask for confirmation before proceeding"
    ]
  },
  permissions: {
    defaultMode: "default",
    readDeny: [
      "./.env",
      "./.env.*",
      "./secrets/**",
      "./certs/**",
      "./*.pem",
      "./**/*.pem"
    ],
    bashAllow: [
      "git status",
      "git diff *",
      "npm test",
      "npm run test *",
      "npm run audit:pack",
      "npm pack --json"
    ],
    bashAsk: [
      "git commit *",
      "git push *",
      "npm publish *"
    ],
    bashDeny: [
      "curl *",
      "wget *",
      "rm -rf *",
      "chmod 777 *",
      "mkfs*",
      "git push --force*"
    ],
    preToolUseDetectors: [
      {
        id: "recursive-delete",
        reason: "recursive deletion with rm -rf",
        example: "rm -rf",
        pattern: "(^|\\s)rm\\s+-rf(\\s|$)"
      },
      {
        id: "force-push",
        reason: "force push",
        example: "git push --force",
        pattern: "(^|\\s)git\\s+push\\s+--force(?:-with-lease)?(\\s|$)"
      },
      {
        id: "chmod-777",
        reason: "world-writable chmod 777",
        example: "chmod 777",
        pattern: "(^|\\s)chmod\\s+777(\\s|$)"
      },
      {
        id: "mkfs",
        reason: "filesystem formatting via mkfs",
        example: "mkfs",
        pattern: "(^|\\s)mkfs(?:\\.[^\\s]+)?(\\s|$)"
      },
      {
        id: "dd-to-dev",
        reason: "disk write to /dev via dd",
        example: "dd if=... of=/dev/...",
        pattern: "(^|\\s)dd\\s+.*if=.*\\s+.*of=/dev/"
      },
      {
        id: "curl-pipe-shell",
        reason: "pipe-to-shell download via curl",
        example: "curl ... | bash",
        pattern: "(^|\\s)curl\\b[^|]*\\|\\s*(bash|sh)(\\s|$)"
      },
      {
        id: "wget-pipe-shell",
        reason: "pipe-to-shell download via wget",
        example: "wget ... | sh",
        pattern: "(^|\\s)wget\\b[^|]*\\|\\s*(bash|sh)(\\s|$)"
      }
    ]
  },
  review: {
    intro: "When reviewing code in this repository:",
    checks: [
      "flag hard-coded keys, tokens, passwords, or credentials",
      "flag logs that may expose secrets or sensitive identifiers",
      "flag likely SQL injection, XSS, SSRF, or command-injection paths",
      "flag newly added API routes that do not appear to have tests",
      "ignore formatting-only changes and lockfile noise unless they hide a real issue"
    ]
  }
};
