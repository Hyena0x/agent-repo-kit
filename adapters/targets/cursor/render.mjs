function renderBulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderNumberedList(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

export function renderCursorArtifacts(policy) {
  const repoGuardRule = `---
description: Shared repo guardrails for safe editing, review, and package-release prep.
alwaysApply: true
---

# Repo Guard

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

  const releaseGuardRule = `---
description: Use when preparing a package release or npm publish flow.
alwaysApply: false
---

# Release Guard

${policy.releaseGuard.summary}

Before suggesting a release or publish action:

${renderNumberedList([
    ...policy.releaseGuard.steps.slice(0, 3),
    `Wait for user confirmation before any publish-related command such as \`${policy.releaseGuard.publishCommand}\`.`
  ])}
`;

  return {
    ".cursor/rules/repo-guard.mdc": repoGuardRule,
    ".cursor/rules/release-guard.mdc": releaseGuardRule
  };
}
