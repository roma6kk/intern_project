import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";

const mode = process.argv[2];
const isDryRun = process.argv.includes("--dry-run");

if (mode !== "local" && mode !== "lan") {
  console.error("Usage: node scripts/dev-mode.mjs <local|lan>");
  process.exit(1);
}

function detectHostIp() {
  const entries = Object.values(networkInterfaces()).flat();

  for (const entry of entries) {
    if (!entry) continue;
    if (entry.family !== "IPv4" || entry.internal) continue;
    return entry.address;
  }

  return null;
}

const hostIp = process.env.DEV_HOST_IP || detectHostIp();
const isLan = mode === "lan";
const apiHost = isLan && hostIp ? hostIp : "127.0.0.1";

if (isLan && !hostIp) {
  console.error(
    "Cannot detect host IPv4 for LAN mode. Set DEV_HOST_IP manually and retry.",
  );
  process.exit(1);
}

const apiUrl = `http://${apiHost}:3000`;
const wsUrl = `http://${apiHost}:3000`;
const filesPublicEndpoint = `http://${apiHost}:9000`;
const nextDevHost = isLan ? "0.0.0.0" : "127.0.0.1";
const appUrl = `http://${isLan ? hostIp : "127.0.0.1"}:3002`;

console.log(`[dev-mode] Mode: ${mode}`);
console.log(`[dev-mode] NEXT_DEV_HOST=${nextDevHost}`);
console.log(`[dev-mode] NEXT_PUBLIC_API_URL=${apiUrl}`);
console.log(`[dev-mode] NEXT_PUBLIC_WS_URL=${wsUrl}`);
console.log(`[dev-mode] AWS_PUBLIC_ENDPOINT=${filesPublicEndpoint}`);
console.log(`[dev-mode] AWS_USE_SIGNED_URLS=false`);
console.log(`[dev-mode] Client URL: ${appUrl}`);

if (isDryRun) {
  console.log("[dev-mode] Dry run enabled, turbo dev is not started.");
  process.exit(0);
}

const child = spawn("npx", ["turbo", "dev", "--parallel"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NEXT_DEV_HOST: nextDevHost,
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_WS_URL: wsUrl,
    AWS_PUBLIC_ENDPOINT: filesPublicEndpoint,
    AWS_USE_SIGNED_URLS: "false",
    DEV_HOST_IP: hostIp || "",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
