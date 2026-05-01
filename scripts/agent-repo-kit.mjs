#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));

function printHelp() {
  console.log(`Agent Repo Kit

Usage: agent-repo-kit <command> [options]

Commands:
  report    Analyze a repo and write AGENT_REPO_REPORT.md, report.json, and a share card
  fix       Preview or apply the smallest agent-readiness fixes
  help      Show this help

Examples:
  agent-repo-kit report
  agent-repo-kit report --root ../my-repo
  agent-repo-kit fix --dry-run
  agent-repo-kit fix --root ../my-repo --dry-run
`);
}

function runScript(scriptName, args) {
  const result = spawnSync(process.execPath, [resolve(scriptsDirectory, scriptName), ...args], {
    stdio: "inherit"
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

const [command, ...args] = process.argv.slice(2);

if (!command || command === "--help" || command === "-h" || command === "help") {
  printHelp();
  process.exit(0);
}

if (command === "report") {
  runScript("agent-repo-report.mjs", args);
}

if (command === "fix") {
  runScript("agent-repo-fix.mjs", args);
}

console.error(`Unknown command: ${command}`);
console.error("Run `agent-repo-kit --help` for usage.");
process.exit(1);
