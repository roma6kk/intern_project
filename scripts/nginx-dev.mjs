import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const nginxPrefix = path.join(repoRoot, "nginx");
const configPath = path.join(nginxPrefix, "conf.d", "lan-external.conf");

const command = process.argv[2] ?? "start";

function runNginx(args) {
  const result = spawnSync("nginx", args, {
    stdio: "inherit",
    cwd: repoRoot,
    shell: process.platform === "win32",
  });
  if (result.error?.code === "ENOENT") {
    console.error(
      "[nginx] nginx not found in PATH. Install nginx and add it to PATH.",
    );
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!fs.existsSync(configPath)) {
  console.error(`[nginx] Missing config: ${configPath}`);
  process.exit(1);
}

const baseArgs = ["-p", nginxPrefix, "-c", configPath];

switch (command) {
  case "start":
    runNginx(["-t", ...baseArgs]);
    runNginx(baseArgs);
    console.log("[nginx] Listening on 0.0.0.0:80 HTTP (lan-external)");
    break;
  case "stop":
    runNginx(["-s", "stop", ...baseArgs]);
    break;
  case "reload":
    runNginx(["-t", ...baseArgs]);
    runNginx(["-s", "reload", ...baseArgs]);
    break;
  case "test":
    runNginx(["-t", ...baseArgs]);
    break;
  default:
    console.error("Usage: node scripts/nginx-dev.mjs <start|stop|reload|test>");
    process.exit(1);
}
