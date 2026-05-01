import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = path.resolve(process.cwd(), "scripts/agent-repo-report.mjs");

function writeRepoFile(root, relativePath, content) {
  const absolutePath = path.join(root, relativePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content);
}

function createRepo(contents) {
  const root = mkdtempSync(path.join(tmpdir(), "agent-repo-report-"));

  for (const [relativePath, content] of Object.entries(contents)) {
    writeRepoFile(root, relativePath, content);
  }

  return root;
}

test("agent-repo-report writes markdown, JSON, and share card outputs", () => {
  const root = createRepo({
    "README.md": "# Fixture\n\n## Development\n\nRun `npm test` before changes.\n",
    "package.json": JSON.stringify(
      {
        name: "fixture",
        version: "1.0.0",
        scripts: {
          test: "node --test"
        }
      },
      null,
      2
    ),
    ".github/workflows/ci.yml": "name: ci\n"
  });

  const result = spawnSync(process.execPath, [scriptPath, "--root", root], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Agent Repo Report/);
  assert.ok(existsSync(path.join(root, "AGENT_REPO_REPORT.md")));
  assert.ok(existsSync(path.join(root, ".agent-repo-kit/report.json")));
  assert.ok(existsSync(path.join(root, "agent-repo-card.svg")));

  const report = readFileSync(path.join(root, "AGENT_REPO_REPORT.md"), "utf8");
  assert.match(report, /^# Agent Repo Report/m);
  assert.match(report, /Agent Repo Kit/);
  assert.match(report, /Share card/);

  const data = JSON.parse(readFileSync(path.join(root, ".agent-repo-kit/report.json"), "utf8"));
  assert.equal(data.product, "Agent Repo Kit");
  assert.equal(data.slug, "agent-repo-kit");
  assert.equal(typeof data.score, "number");
  assert.ok(data.score >= 0 && data.score <= 100);
  assert.ok(data.checks.some((check) => check.id === "agent-instructions"));

  const card = readFileSync(path.join(root, "agent-repo-card.svg"), "utf8");
  assert.match(card, /Agent Repo Kit/);
  assert.match(card, /Agent-ready score/);
});
