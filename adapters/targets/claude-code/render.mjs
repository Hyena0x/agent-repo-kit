function renderBulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderNumberedList(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function renderSettings(policy) {
  const settings = {
    $schema: "https://json.schemastore.org/claude-code-settings.json",
    defaultMode: policy.permissions.defaultMode,
    permissions: {
      allow: policy.permissions.bashAllow.map((command) => `Bash(${command})`),
      ask: policy.permissions.bashAsk.map((command) => `Bash(${command})`),
      deny: [
        ...policy.permissions.readDeny.map((pattern) => `Read(${pattern})`),
        ...policy.permissions.bashDeny.map((command) => `Bash(${command})`)
      ]
    },
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            {
              type: "command",
              command: "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/pre-tool-check.js\""
            }
          ]
        }
      ]
    }
  };

  return `${JSON.stringify(settings, null, 2)}\n`;
}

function renderClaudeMd(policy) {
  return `# Project Overview

> Managed by \`npm run adapters:render\`. Edit \`adapters/policy/repo-guard-policy.mjs\` instead of hand-editing this file.

${policy.workspace.overview}

The main goals are:

${renderBulletList(policy.workspace.goals)}

# Safety Red Lines

Do not read or print secrets from:

${renderBulletList(policy.permissions.readDeny.map((pattern) => `\`${pattern}\``))}

Do not run destructive Bash commands such as:

${renderBulletList(
    policy.permissions.preToolUseDetectors.map((detector) => `\`${detector.example}\``)
  )}

Do not publish packages without an explicit user confirmation.

# Working Workflow

When making changes in this repo:

${renderNumberedList(policy.workspace.changeWorkflow)}

# Release Expectations

Before suggesting a release or publish action:

${renderNumberedList([
    ...policy.releaseGuard.steps.slice(0, 3),
    `Wait for user confirmation before any publish-related command such as \`${policy.releaseGuard.publishCommand}\`.`
  ])}

# High-Risk Operations

For any risky action such as force pushes, file deletion, permission changes, or publishing:

${renderBulletList(policy.workspace.highRiskOperations)}
`;
}

function renderReviewMd(policy) {
  return `# Review Rules

> Managed by \`npm run adapters:render\`. Edit \`adapters/policy/repo-guard-policy.mjs\` instead of hand-editing this file.

${policy.review.intro}

${renderBulletList(policy.review.checks)}
`;
}

function renderReleaseGuardCommand(policy) {
  return `---
description: Run the release guard before any publish flow
allowed-tools: Bash(${policy.releaseGuard.command})
---

Use the repository ${policy.releaseGuard.id} workflow before any publish action.

## Context

- Latest release-guard output: !\`${policy.releaseGuard.command}\`

## Your task

${renderNumberedList(policy.releaseGuard.steps)}
`;
}

function renderReleaseGuardSkill(policy) {
  return `# ${policy.releaseGuard.id}

Use this skill before any package publish flow.

## Goal

${policy.releaseGuard.summary}

## Workflow

${renderNumberedList(policy.releaseGuard.steps)}
`;
}

function renderHook(policy) {
  const detectors = JSON.stringify(policy.permissions.preToolUseDetectors, null, 2);

  return `#!/usr/bin/env node

import { stdin, stdout } from "node:process";

const detectorDefinitions = ${detectors};
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
        permissionDecisionReason: \`Blocked risky Bash command: \${deniedBy.reason}\`
      }
    };

    stdout.write(\`\${JSON.stringify(response)}\\n\`);
  } catch {
    // Stay quiet on malformed input so the hook never blocks normal work by accident.
  }
});

stdin.resume();
`;
}

export function renderClaudeCodeArtifacts(policy) {
  return {
    "CLAUDE.md": renderClaudeMd(policy),
    "REVIEW.md": renderReviewMd(policy),
    ".claude/settings.json": renderSettings(policy),
    ".claude/hooks/pre-tool-check.js": renderHook(policy),
    ".claude/commands/release-guard.md": renderReleaseGuardCommand(policy),
    ".claude/skills/release-guard/SKILL.md": renderReleaseGuardSkill(policy)
  };
}
