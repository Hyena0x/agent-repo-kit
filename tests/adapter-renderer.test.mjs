import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

import { agentRepoKitPolicy } from "../adapters/policy/agent-repo-kit-policy.mjs";
import { renderClaudeCodeArtifacts } from "../adapters/targets/claude-code/render.mjs";
import { renderCodexArtifacts } from "../adapters/targets/codex/render.mjs";
import { renderCursorArtifacts } from "../adapters/targets/cursor/render.mjs";
import { renderGenericPolicyManifest } from "../adapters/targets/generic/render.mjs";

test("Claude adapter renders the expected generated files", () => {
  const artifacts = renderClaudeCodeArtifacts(agentRepoKitPolicy);

  assert.deepEqual(Object.keys(artifacts).sort(), [
    ".claude/commands/agent-repo-fix.md",
    ".claude/commands/agent-repo-report.md",
    ".claude/hooks/pre-tool-check.js",
    ".claude/settings.json",
    ".claude/skills/agent-repo-fix/SKILL.md",
    ".claude/skills/agent-repo-report/SKILL.md",
    "CLAUDE.md",
    "REVIEW.md"
  ]);

  const settings = JSON.parse(artifacts[".claude/settings.json"]);
  assert.equal(settings.defaultMode, agentRepoKitPolicy.permissions.defaultMode);
  assert.ok(settings.permissions.allow.includes("Bash(npm run report)"));
  assert.ok(settings.permissions.ask.includes("Bash(npm run fix *)"));
  assert.equal(settings.hooks.PreToolUse[0].matcher, "Bash");
});

test("generic adapter emits a tool-agnostic manifest", () => {
  const manifest = JSON.parse(renderGenericPolicyManifest(agentRepoKitPolicy));

  assert.equal(manifest.id, "agent-repo-kit");
  assert.equal(manifest.report.command, "npm run report");
  assert.equal(manifest.fix.command, "npm run fix");
  assert.equal(manifest.permissions.defaultMode, "default");
  assert.ok(Array.isArray(manifest.permissions.bashAllow));
  assert.equal(manifest.permissions.bashAllow[0], "git status");
  assert.ok(!manifest.permissions.bashAllow[0].startsWith("Bash("));
});

test("Claude slash commands are wired to the report and fix commands", () => {
  const artifacts = renderClaudeCodeArtifacts(agentRepoKitPolicy);
  const reportCommand = artifacts[".claude/commands/agent-repo-report.md"];
  const fixCommand = artifacts[".claude/commands/agent-repo-fix.md"];

  assert.match(reportCommand, /allowed-tools: Bash\(npm run report\)/);
  assert.match(reportCommand, /Latest Agent Repo Report output: !`npm run report`/);
  assert.match(fixCommand, /allowed-tools: Bash\(npm run fix -- --dry-run\)/);
  assert.match(fixCommand, /Do not apply changes without explicit user confirmation/);
});

test("Codex adapter emits a repo instruction file without fake Claude-only surfaces", () => {
  const artifacts = renderCodexArtifacts(agentRepoKitPolicy);
  const agents = artifacts["AGENTS.md"];

  assert.ok(agents.includes("Codex-oriented projection"));
  assert.ok(agents.includes("it does not pretend Codex has Claude Code's hook or permission model"));
  assert.ok(agents.includes("npm run report"));
  assert.ok(agents.includes("npm run fix -- --dry-run"));
  assert.ok(!agents.includes("PreToolUse"));
});

test("Cursor adapter emits project rules in official MDC form", () => {
  const artifacts = renderCursorArtifacts(agentRepoKitPolicy);
  const agentRepoKit = artifacts[".cursor/rules/agent-repo-kit.mdc"];
  const report = artifacts[".cursor/rules/agent-repo-report.mdc"];
  const fix = artifacts[".cursor/rules/agent-repo-fix.mdc"];

  assert.ok(agentRepoKit.includes("alwaysApply: true"));
  assert.ok(agentRepoKit.includes("Agent Repo Kit"));
  assert.ok(agentRepoKit.includes("rm -rf"));
  assert.ok(report.includes("alwaysApply: false"));
  assert.ok(report.includes("npm run report"));
  assert.ok(fix.includes("alwaysApply: false"));
  assert.ok(fix.includes("npm run fix -- --dry-run"));
});

test("adapter outputs in the repo stay in sync with the shared policy", () => {
  const renderScriptPath = path.resolve(process.cwd(), "scripts/render-adapters.mjs");
  const result = spawnSync(process.execPath, [renderScriptPath, "--check"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /up to date/i);
});
