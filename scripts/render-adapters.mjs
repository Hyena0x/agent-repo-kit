#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { agentRepoKitPolicy } from "../adapters/policy/agent-repo-kit-policy.mjs";
import { renderClaudeCodeArtifacts } from "../adapters/targets/claude-code/render.mjs";
import { renderCodexArtifacts } from "../adapters/targets/codex/render.mjs";
import { renderCursorArtifacts } from "../adapters/targets/cursor/render.mjs";
import { renderGenericPolicyManifest } from "../adapters/targets/generic/render.mjs";

const rootDirectory = process.cwd();
const mode = process.argv.includes("--check") ? "check" : "write";

function buildArtifacts() {
  return {
    ...renderCodexArtifacts(agentRepoKitPolicy),
    ...renderCursorArtifacts(agentRepoKitPolicy),
    ...renderClaudeCodeArtifacts(agentRepoKitPolicy),
    "adapters/generated/agent-repo-kit-policy.json": renderGenericPolicyManifest(agentRepoKitPolicy)
  };
}

function ensureParentDirectory(relativePath) {
  const parentDirectory = path.dirname(path.join(rootDirectory, relativePath));
  mkdirSync(parentDirectory, { recursive: true });
}

function readFileIfExists(relativePath) {
  try {
    return readFileSync(path.join(rootDirectory, relativePath), "utf8");
  } catch {
    return null;
  }
}

const artifacts = buildArtifacts();
const mismatches = [];

for (const [relativePath, content] of Object.entries(artifacts)) {
  if (mode === "check") {
    const current = readFileIfExists(relativePath);

    if (current !== content) {
      mismatches.push(relativePath);
    }

    continue;
  }

  ensureParentDirectory(relativePath);
  writeFileSync(path.join(rootDirectory, relativePath), content);
}

if (mode === "check") {
  if (mismatches.length > 0) {
    console.error("Adapter outputs are out of date:");

    for (const mismatch of mismatches) {
      console.error(`- ${mismatch}`);
    }

    console.error("");
    console.error("Run `npm run adapters:render` to update generated files.");
    process.exit(1);
  }

  console.log("Adapter outputs are up to date.");
  process.exit(0);
}

console.log(`Rendered ${Object.keys(artifacts).length} adapter artifacts.`);
