import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

import { repoGuardPolicy } from "../adapters/policy/repo-guard-policy.mjs";
import { renderClaudeCodeArtifacts } from "../adapters/targets/claude-code/render.mjs";
import { renderGenericPolicyManifest } from "../adapters/targets/generic/render.mjs";

test("Claude adapter renders the expected generated files", () => {
  const artifacts = renderClaudeCodeArtifacts(repoGuardPolicy);

  assert.deepEqual(Object.keys(artifacts).sort(), [
    ".claude/commands/release-guard.md",
    ".claude/hooks/pre-tool-check.js",
    ".claude/settings.json",
    ".claude/skills/release-guard/SKILL.md",
    "CLAUDE.md",
    "REVIEW.md"
  ]);

  const settings = JSON.parse(artifacts[".claude/settings.json"]);
  assert.equal(settings.defaultMode, repoGuardPolicy.permissions.defaultMode);
  assert.ok(settings.permissions.allow.includes("Bash(npm run audit:pack)"));
  assert.equal(settings.hooks.PreToolUse[0].matcher, "Bash");
});

test("generic adapter emits a tool-agnostic manifest", () => {
  const manifest = JSON.parse(renderGenericPolicyManifest(repoGuardPolicy));

  assert.equal(manifest.id, "repo-guard-starter");
  assert.equal(manifest.releaseGuard.command, "npm run audit:pack");
  assert.equal(manifest.permissions.defaultMode, "default");
  assert.ok(Array.isArray(manifest.permissions.bashAllow));
  assert.equal(manifest.permissions.bashAllow[0], "git status");
  assert.ok(!manifest.permissions.bashAllow[0].startsWith("Bash("));
});

test("Claude slash command is wired to the shared release-guard command", () => {
  const artifacts = renderClaudeCodeArtifacts(repoGuardPolicy);
  const command = artifacts[".claude/commands/release-guard.md"];

  assert.match(command, /allowed-tools: Bash\(npm run audit:pack\)/);
  assert.match(command, /Latest release-guard output: !`npm run audit:pack`/);
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
