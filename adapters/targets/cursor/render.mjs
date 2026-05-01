function renderBulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderNumberedList(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

export function renderCursorArtifacts(policy) {
  const agentRepoKitRule = `---
description: Shared Agent Repo Kit rules for report, fix, review, and package-release prep.
alwaysApply: true
---

# Agent Repo Kit

${policy.workspace.overview}

## Core goals

${renderBulletList(policy.workspace.goals)}

## Safety red lines

Do not read or print secrets from:

${renderBulletList(policy.permissions.readDeny.map((pattern) => `\`${pattern}\``))}

Avoid destructive shell actions such as:

${renderBulletList(policy.permissions.preToolUseDetectors.map((detector) => `\`${detector.example}\``))}

Do not publish packages without explicit user confirmation.

## Working workflow

${renderNumberedList(policy.workspace.changeWorkflow)}

## Review focus

${policy.review.intro}

${renderBulletList(policy.review.checks)}
`;

  const reportRule = `---
description: Use when generating an Agent Repo Report and share card.
alwaysApply: false
---

# Agent Repo Report

${policy.report.summary}

${renderNumberedList(policy.report.steps)}
`;

  const fixRule = `---
description: Use when previewing or applying Agent Repo Kit fixes.
alwaysApply: false
---

# Agent Repo Fix

${policy.fix.summary}

${renderNumberedList(policy.fix.steps)}
`;

  return {
    ".cursor/rules/agent-repo-kit.mdc": agentRepoKitRule,
    ".cursor/rules/agent-repo-report.mdc": reportRule,
    ".cursor/rules/agent-repo-fix.mdc": fixRule
  };
}
