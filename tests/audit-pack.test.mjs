import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = path.resolve(process.cwd(), "scripts/audit-pack.mjs");

function writePackageFile(root, relativePath, content) {
  const absolutePath = path.join(root, relativePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content);
}

function createPackage(options) {
  const root = mkdtempSync(path.join(tmpdir(), "repo-guard-starter-"));
  const packageJson = {
    name: options.name ?? "fixture-package",
    version: "1.0.0",
    type: "module",
    files: options.filesField ?? ["dist", "README.md"]
  };

  writePackageFile(root, "package.json", JSON.stringify(packageJson, null, 2));
  writePackageFile(root, "README.md", "# Fixture\n");

  for (const [relativePath, content] of Object.entries(options.contents)) {
    writePackageFile(root, relativePath, content);
  }

  return root;
}

function runAudit(root) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd: root,
    encoding: "utf8"
  });
}

test("audit-pack passes clean tarballs", () => {
  const root = createPackage({
    contents: {
      "dist/index.js": "export const value = 1;\n"
    }
  });
  const result = runAudit(root);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /\bPASS\b/);
});

test("audit-pack warns on sourcemaps and exits non-zero", () => {
  const root = createPackage({
    contents: {
      "dist/index.js": "export const value = 1;\n",
      "dist/index.js.map": "{}\n"
    },
    filesField: ["dist", "README.md"]
  });
  const result = runAudit(root);

  assert.equal(result.status, 1, result.stderr || result.stdout);
  assert.match(result.stdout, /\bWARN\b/);
  assert.match(result.stdout, /\[source-map\]/);
});

test("audit-pack fails on environment files", () => {
  const root = createPackage({
    contents: {
      "dist/index.js": "export const value = 1;\n",
      ".env.production": "SHOULD_NOT_SHIP=true\n"
    },
    filesField: ["dist", ".env.production", "README.md"]
  });
  const result = runAudit(root);

  assert.equal(result.status, 1, result.stderr || result.stdout);
  assert.match(result.stdout, /\bFAIL\b/);
  assert.match(result.stdout, /\[environment-file\]/);
});
