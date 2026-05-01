function renderBulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderNumberedList(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

export function renderCodexArtifacts(policy) {
  const agentsMd = `# AGENTS.md

> Managed by \`npm run adapters:render\`. Edit \`adapters/policy/agent-repo-kit-policy.mjs\` instead of hand-editing this file.

This file is the Codex-oriented projection of the shared Agent Repo Kit policy. It is intentionally instruction-first: it carries workflow, review, report, and fix expectations, but it does not pretend Codex has Claude Code's hook or permission model.

## Project Overview

${policy.workspace.overview}

Primary positioning:

- ${policy.positioning.summary}
- Extension targets: ${policy.positioning.extensionTargets.join(", ")}

## Core Goals

${renderBulletList(policy.workspace.goals)}

## Safety Red Lines

Do not read or print secrets from:

${renderBulletList(policy.permissions.readDeny.map((pattern) => `\`${pattern}\``))}

Avoid destructive shell actions such as:

${renderBulletList(policy.permissions.preToolUseDetectors.map((detector) => `\`${detector.example}\``))}

Do not publish packages without explicit user confirmation.

## Working Workflow

${renderNumberedList(policy.workspace.changeWorkflow)}

## Agent Repo Report

${policy.report.summary}

${renderNumberedList(policy.report.steps)}

## Agent Repo Fix

${policy.fix.summary}

${renderNumberedList(policy.fix.steps)}

## Publish Safety

Before suggesting a release or publish action:

${renderNumberedList([
    ...policy.releaseGuard.steps.slice(0, 3),
    `Wait for user confirmation before any publish-related command such as \`${policy.releaseGuard.publishCommand}\`.`
  ])}

## Review Focus

${policy.review.intro}

${renderBulletList(policy.review.checks)}
`;

  return {
    "AGENTS.md": agentsMd
  };
}
