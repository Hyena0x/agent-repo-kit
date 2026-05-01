import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDirectory = process.cwd();
const cliPath = path.join(rootDirectory, "scripts/agent-repo-kit.mjs");

function writeRepoFile(root, relativePath, content) {
  const absolutePath = path.join(root, relativePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content);
}

function createRepo(contents) {
  const root = mkdtempSync(path.join(tmpdir(), "agent-repo-cli-"));

  for (const [relativePath, content] of Object.entries(contents)) {
    writeRepoFile(root, relativePath, content);
  }

  return root;
}

test("package exposes the agent-repo-kit binary", () => {
  const packageJson = JSON.parse(readFileSync(path.join(rootDirectory, "package.json"), "utf8"));

  assert.deepEqual(packageJson.bin, {
    "agent-repo-kit": "scripts/agent-repo-kit.mjs"
  });
});

test("CLI prints help", () => {
  const result = spawnSync(process.execPath, [cliPath, "--help"], {
    cwd: rootDirectory,
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Usage: agent-repo-kit <command>/);
  assert.match(result.stdout, /report/);
  assert.match(result.stdout, /fix/);
});

test("CLI runs report and fix subcommands", () => {
  const fixture = createRepo({
    "README.md": "# Fixture\n",
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
    )
  });

  const report = spawnSync(process.execPath, [cliPath, "report", "--root", fixture], {
    cwd: rootDirectory,
    encoding: "utf8"
  });

  assert.equal(report.status, 0, report.stderr || report.stdout);
  assert.match(report.stdout, /Agent Repo Report/);
  assert.ok(existsSync(path.join(fixture, "AGENT_REPO_REPORT.md")));

  const fix = spawnSync(process.execPath, [cliPath, "fix", "--root", fixture, "--dry-run"], {
    cwd: rootDirectory,
    encoding: "utf8"
  });

  assert.equal(fix.status, 0, fix.stderr || fix.stdout);
  assert.match(fix.stdout, /Agent Repo Fix DRY RUN/);
});
