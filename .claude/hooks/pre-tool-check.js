#!/usr/bin/env node

import { stdin, stdout } from "node:process";

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

    const deniedBy = matchDangerousCommand(command);

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
  } catch (error) {
    // Stay quiet on malformed input so the hook never blocks normal work by accident.
    return;
  }
});

stdin.resume();

function matchDangerousCommand(command) {
  const checks = [
    {
      reason: "recursive deletion with rm -rf",
      pattern: /(^|\s)rm\s+-rf(\s|$)/
    },
    {
      reason: "force push",
      pattern: /(^|\s)git\s+push\s+--force(?:-with-lease)?(\s|$)/
    },
    {
      reason: "world-writable chmod 777",
      pattern: /(^|\s)chmod\s+777(\s|$)/
    },
    {
      reason: "filesystem formatting via mkfs",
      pattern: /(^|\s)mkfs(?:\.[^\s]+)?(\s|$)/
    },
    {
      reason: "disk write to /dev via dd",
      pattern: /(^|\s)dd\s+.*if=.*\s+.*of=\/dev\//
    },
    {
      reason: "pipe-to-shell download via curl",
      pattern: /(^|\s)curl\b[^|]*\|\s*(bash|sh)(\s|$)/
    },
    {
      reason: "pipe-to-shell download via wget",
      pattern: /(^|\s)wget\b[^|]*\|\s*(bash|sh)(\s|$)/
    }
  ];

  return checks.find((check) => check.pattern.test(command)) ?? null;
}
