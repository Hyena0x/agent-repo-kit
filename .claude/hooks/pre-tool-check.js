#!/usr/bin/env node

import { stdin, stdout } from "node:process";

const detectorDefinitions = [
  {
    "id": "recursive-delete",
    "reason": "recursive deletion with rm -rf",
    "example": "rm -rf",
    "pattern": "(^|\\s)rm\\s+-rf(\\s|$)"
  },
  {
    "id": "force-push",
    "reason": "force push",
    "example": "git push --force",
    "pattern": "(^|\\s)git\\s+push\\s+--force(?:-with-lease)?(\\s|$)"
  },
  {
    "id": "chmod-777",
    "reason": "world-writable chmod 777",
    "example": "chmod 777",
    "pattern": "(^|\\s)chmod\\s+777(\\s|$)"
  },
  {
    "id": "mkfs",
    "reason": "filesystem formatting via mkfs",
    "example": "mkfs",
    "pattern": "(^|\\s)mkfs(?:\\.[^\\s]+)?(\\s|$)"
  },
  {
    "id": "dd-to-dev",
    "reason": "disk write to /dev via dd",
    "example": "dd if=... of=/dev/...",
    "pattern": "(^|\\s)dd\\s+.*if=.*\\s+.*of=/dev/"
  },
  {
    "id": "curl-pipe-shell",
    "reason": "pipe-to-shell download via curl",
    "example": "curl ... | bash",
    "pattern": "(^|\\s)curl\\b[^|]*\\|\\s*(bash|sh)(\\s|$)"
  },
  {
    "id": "wget-pipe-shell",
    "reason": "pipe-to-shell download via wget",
    "example": "wget ... | sh",
    "pattern": "(^|\\s)wget\\b[^|]*\\|\\s*(bash|sh)(\\s|$)"
  }
];
const detectors = detectorDefinitions.map((detector) => ({
  ...detector,
  pattern: new RegExp(detector.pattern)
}));
const chunks = [];

stdin.on("data", (chunk) => {
  chunks.push(chunk);
});

stdin.on("end", () => {
  try {
    const payload = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");

    if (payload.tool_name !== "Bash") {
      return;
    }

    const command = String(payload.tool_input?.command || "").trim();

    if (!command) {
      return;
    }

    const deniedBy = detectors.find((detector) => detector.pattern.test(command));

    if (!deniedBy) {
      return;
    }

    const response = {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Blocked risky Bash command: ${deniedBy.reason}`
      }
    };

    stdout.write(`${JSON.stringify(response)}\n`);
  } catch {
    // Stay quiet on malformed input so the hook never blocks normal work by accident.
  }
});

stdin.resume();
