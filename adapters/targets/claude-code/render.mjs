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

> Managed by \`npm run adapters:render\`. Edit \`adapters/policy/agent-repo-kit-policy.mjs\` instead of hand-editing this file.

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

# Public Skills

## ${policy.report.id}

${policy.report.summary}

${renderNumberedList(policy.report.steps)}

## ${policy.fix.id}

${policy.fix.summary}

${renderNumberedList(policy.fix.steps)}

# Publish Safety

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

> Managed by \`npm run adapters:render\`. Edit \`adapters/policy/agent-repo-kit-policy.mjs\` instead of hand-editing this file.

${policy.review.intro}

${renderBulletList(policy.review.checks)}
`;
}

function renderReportCommand(policy) {
  return `---
description: Generate an Agent Repo Report and share card
allowed-tools: Bash(${policy.report.command})
---

Use ${policy.report.id} to score the current repo for AI coding agents.

## Context

- Latest Agent Repo Report output: !\`${policy.report.command}\`

## Your task

${renderNumberedList(policy.report.steps)}
`;
}

function renderFixCommand(policy) {
  return `---
description: Preview Agent Repo Kit fixes before applying them
allowed-tools: Bash(${policy.fix.dryRunCommand})
---

Use ${policy.fix.id} only after an Agent Repo Report exists or the user explicitly asks to improve repo readiness.

## Context

- Planned changes: !\`${policy.fix.dryRunCommand}\`

## Your task

${renderNumberedList(policy.fix.steps)}

Do not apply changes without explicit user confirmation.
`;
}

function renderReportSkill(policy) {
  return `# ${policy.report.id}

Use this skill when a user wants to analyze, score, or share how ready a repo is for AI coding agents.

## Goal

${policy.report.summary}

## Outputs

${renderBulletList(policy.report.outputs.map((output) => `\`${output}\``))}

## Workflow

${renderNumberedList(policy.report.steps)}
`;
}

function renderFixSkill(policy) {
  return `# ${policy.fix.id}

Use this skill when a user wants to improve a repo after reviewing an Agent Repo Report.

## Goal

${policy.fix.summary}

## Workflow

${renderNumberedList(policy.fix.steps)}

## Safety

- Prefer dry-run output before edits.
- Preserve existing user content unless a generated replacement is clearly requested.
- Keep publish safety as one fix module, not a separate public skill.
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
    ".claude/commands/agent-repo-report.md": renderReportCommand(policy),
    ".claude/commands/agent-repo-fix.md": renderFixCommand(policy),
    ".claude/skills/agent-repo-report/SKILL.md": renderReportSkill(policy),
    ".claude/skills/agent-repo-fix/SKILL.md": renderFixSkill(policy)
  };
}
