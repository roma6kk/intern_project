import { spawn } from "node:child_process";

const explicitHostArgIndex = process.argv.indexOf("--host");
const explicitHost =
  explicitHostArgIndex >= 0 ? process.argv[explicitHostArgIndex + 1] : null;
const host = explicitHost || process.env.NEXT_DEV_HOST || "127.0.0.1";

const child = spawn("npx", ["next", "dev", "-p", "3002", "-H", host], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
