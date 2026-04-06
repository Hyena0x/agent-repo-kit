#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const tarCommand = process.platform === "win32" ? "tar.exe" : "tar";
const npmCacheDirectory = mkdtempSync(path.join(tmpdir(), "repo-guard-starter-npm-cache-"));

const rules = [
  {
    id: "source-map",
    severity: "WARN",
    message: "Sourcemaps should not ship in the published tarball.",
    match: (file) => file.endsWith(".map")
  },
  {
    id: "source-directory",
    severity: "WARN",
    message: "Source directories should stay out of the published tarball.",
    match: (file) => /(^|\/)src\//.test(file)
  },
  {
    id: "test-directory",
    severity: "WARN",
    message: "Test files should not ship in the published tarball.",
    match: (file) => /(^|\/)tests?\//.test(file)
  },
  {
    id: "environment-file",
    severity: "FAIL",
    message: "Environment files are sensitive and must never ship.",
    match: (file) => /(^|\/)\.env(\..+)?$/.test(file)
  },
  {
    id: "private-key",
    severity: "FAIL",
    message: "PEM files are sensitive and must never ship.",
    match: (file) => file.endsWith(".pem")
  },
  {
    id: "secrets-directory",
    severity: "FAIL",
    message: "Secrets directories must never ship.",
    match: (file) => /(^|\/)secrets\//.test(file)
  },
  {
    id: "draft-directory",
    severity: "WARN",
    message: "Draft content should not ship in the published tarball.",
    match: (file) => /(^|\/)draft\//.test(file)
  },
  {
    id: "internal-directory",
    severity: "WARN",
    message: "Internal-only directories should not ship.",
    match: (file) => /(^|\/)internal\//.test(file)
  },
  {
    id: "private-directory",
    severity: "WARN",
    message: "Private directories should not ship.",
    match: (file) => /(^|\/)private\//.test(file)
  }
];

function failHard(message, detail) {
  console.error("repo-guard-starter release guard");
  console.error(`FAIL: ${message}`);

  if (detail) {
    console.error(detail);
  }

  process.exit(1);
}

function run(command, args) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env:
        command === npmCommand
          ? {
              ...process.env,
              npm_config_cache: npmCacheDirectory
            }
          : process.env
    });
  } catch (error) {
    const detail = error.stderr || error.message;
    failHard(`Unable to run ${command} ${args.join(" ")}`, detail.trim());
  }
}

function parsePackResult(stdout) {
  try {
    const parsed = JSON.parse(stdout);

    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0]?.filename) {
      throw new Error("npm pack --json did not return a filename.");
    }

    return parsed[0].filename;
  } catch (error) {
    failHard("Unable to parse npm pack output.", error.message);
  }
}

function normalizeTarEntry(entry) {
  return entry.replace(/^package\//, "").replace(/\/$/, "");
}

function summarizeMatches(files) {
  const hits = [];

  for (const file of files) {
    for (const rule of rules) {
      if (rule.match(file)) {
        hits.push({
          file,
          id: rule.id,
          severity: rule.severity,
          message: rule.message
        });
      }
    }
  }

  return hits;
}

function overallStatus(hits) {
  if (hits.some((hit) => hit.severity === "FAIL")) {
    return "FAIL";
  }

  if (hits.length > 0) {
    return "WARN";
  }

  return "PASS";
}

let tarballPath;

try {
  const packOutput = run(npmCommand, ["pack", "--json"]);
  const tarballName = parsePackResult(packOutput);
  tarballPath = path.resolve(process.cwd(), tarballName);

  if (!existsSync(tarballPath)) {
    failHard("npm pack reported a tarball that was not created.", tarballName);
  }

  const tarOutput = run(tarCommand, ["-tf", tarballPath]);
  const files = tarOutput
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(normalizeTarEntry)
    .filter(Boolean);
  const hits = summarizeMatches(files);
  const status = overallStatus(hits);

  console.log("repo-guard-starter release guard");
  console.log(`Packed artifact: ${path.basename(tarballPath)}`);
  console.log(`Files inspected: ${files.length}`);
  console.log("");
  console.log(status);

  if (hits.length > 0) {
    for (const hit of hits) {
      console.log(`- package/${hit.file} [${hit.id}] ${hit.message}`);
    }

    console.log("");
    console.log(
      'Release guard blocked this package. Tighten package.json "files" or your ignore rules before publishing.'
    );
    process.exit(1);
  }
} finally {
  if (tarballPath && existsSync(tarballPath)) {
    rmSync(tarballPath, { force: true });
  }

  if (existsSync(npmCacheDirectory)) {
    rmSync(npmCacheDirectory, { recursive: true, force: true });
  }
}
