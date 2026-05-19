import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";

const mode = process.argv[2];
const isDryRun = process.argv.includes("--dry-run");

if (mode !== "local" && mode !== "lan" && mode !== "external") {
  console.error("Usage: node scripts/dev-mode.mjs <local|lan|external>");
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
const isExternal = mode === "external";
const publicHost = process.env.DEV_PUBLIC_HOST?.trim();

if (isLan && !hostIp) {
  console.error(
    "Cannot detect host IPv4 for LAN mode. Set DEV_HOST_IP manually and retry.",
  );
  process.exit(1);
}

if (isExternal && !publicHost) {
  console.error(
    [
      "External mode requires DEV_PUBLIC_HOST (WAN IP or domain reachable from outside).",
      "Example:",
      "  PowerShell: $env:DEV_PUBLIC_HOST=\"203.0.113.10\"; npm run dev:external",
      "Also start nginx: npm run nginx:external",
    ].join("\n"),
  );
  process.exit(1);
}

let apiUrl;
let wsUrl;
let filesPublicEndpoint;
let filesInternalEndpoint;
let nextDevHost;
let appUrl;

if (isExternal) {
  const scheme = process.env.DEV_PUBLIC_SCHEME?.trim() || "http";
  const base = `${scheme}://${publicHost}`;
  apiUrl = `${base}/api`;
  wsUrl = base;
  filesPublicEndpoint = base;
  filesInternalEndpoint = "http://127.0.0.1:9000";
  nextDevHost = "127.0.0.1";
  appUrl = base;
} else {
  const apiHost = isLan && hostIp ? hostIp : "127.0.0.1";
  apiUrl = `http://${apiHost}:3000`;
  wsUrl = `http://${apiHost}:3000`;
  filesPublicEndpoint = `http://${apiHost}:9000`;
  filesInternalEndpoint = filesPublicEndpoint;
  nextDevHost = isLan ? "0.0.0.0" : "127.0.0.1";
  appUrl = `http://${isLan ? hostIp : "127.0.0.1"}:3002`;
}

console.log(`[dev-mode] Mode: ${mode}`);
console.log(`[dev-mode] NEXT_DEV_HOST=${nextDevHost}`);
console.log(`[dev-mode] NEXT_PUBLIC_API_URL=${apiUrl}`);
console.log(`[dev-mode] NEXT_PUBLIC_WS_URL=${wsUrl}`);
console.log(`[dev-mode] AWS_ENDPOINT=${filesInternalEndpoint}`);
console.log(`[dev-mode] AWS_PUBLIC_ENDPOINT=${filesPublicEndpoint}`);
console.log(`[dev-mode] AWS_USE_SIGNED_URLS=false`);
console.log(`[dev-mode] FRONTEND_PUBLIC_URL=${appUrl}`);
console.log(`[dev-mode] Client URL: ${appUrl}`);
if (isExternal) {
  console.log(`[dev-mode] Files via nginx: ${filesPublicEndpoint}/innogram-bucket/`);
  console.log(`[dev-mode] Start proxy: npm run nginx:external`);
} else {
  console.log(`[dev-mode] MinIO URL: ${filesPublicEndpoint}`);
}

if (isDryRun) {
  console.log("[dev-mode] Dry run enabled, turbo dev is not started.");
  process.exit(0);
}

const child = spawn("npx", ["turbo", "dev", "--parallel"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    DEV_MODE: mode,
    DEV_PUBLIC_HOST: publicHost || "",
    NEXT_DEV_HOST: nextDevHost,
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_WS_URL: wsUrl,
    FRONTEND_PUBLIC_URL: appUrl,
    AWS_ENDPOINT: filesInternalEndpoint,
    AWS_PUBLIC_ENDPOINT: filesPublicEndpoint,
    AWS_USE_SIGNED_URLS: "false",
    DEV_HOST_IP: hostIp || "",
    GOOGLE_CALLBACK_URL:
      isExternal && publicHost
        ? `${appUrl.replace(/\/$/, "")}/internal/auth/google/callback`
        : process.env.GOOGLE_CALLBACK_URL,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
