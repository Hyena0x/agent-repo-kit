import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = path.resolve(process.cwd(), "scripts/agent-repo-fix.mjs");

function writeRepoFile(root, relativePath, content) {
  const absolutePath = path.join(root, relativePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content);
}

function createRepo(contents) {
  const root = mkdtempSync(path.join(tmpdir(), "agent-repo-fix-"));

  for (const [relativePath, content] of Object.entries(contents)) {
    writeRepoFile(root, relativePath, content);
  }

  return root;
}

test("agent-repo-fix dry-run reports planned files without writing them", () => {
  const root = createRepo({
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

  const result = spawnSync(process.execPath, [scriptPath, "--root", root, "--dry-run"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /DRY RUN/);
  assert.match(result.stdout, /AGENTS\.md/);
  assert.match(result.stdout, /\.gitignore/);
  assert.equal(existsSync(path.join(root, "AGENTS.md")), false);
  assert.equal(existsSync(path.join(root, ".gitignore")), false);
});

test("agent-repo-fix writes agent instructions and secret ignore rules", () => {
  const root = createRepo({
    "README.md": "# Fixture\n",
    "package.json": JSON.stringify(
      {
        name: "fixture",
        version: "1.0.0",
        scripts: {
          test: "node --test",
          build: "node build.mjs"
        }
      },
      null,
      2
    ),
    ".gitignore": "node_modules/\n"
  });

  const result = spawnSync(process.execPath, [scriptPath, "--root", root], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Applied/);

  const agents = readFileSync(path.join(root, "AGENTS.md"), "utf8");
  assert.match(agents, /Agent Repo Kit/);
  assert.match(agents, /npm test/);
  assert.match(agents, /npm run build/);

  const gitignore = readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /^node_modules\/$/m);
  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^\.env\.\*$/m);
});
