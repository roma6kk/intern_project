import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const certsDir = path.join(repoRoot, "nginx", "certs");
const opensslCnf = path.join(repoRoot, "nginx", "openssl-san.cnf");

function detectLanIp() {
  const entries = Object.values(os.networkInterfaces()).flat();
  for (const entry of entries) {
    if (!entry) continue;
    if (entry.family !== "IPv4" || entry.internal) continue;
    return entry.address;
  }
  return null;
}

const publicHost = process.env.DEV_PUBLIC_HOST?.trim();
const lanIp = process.env.DEV_HOST_IP?.trim() || detectLanIp();
const altNames = new Set(["DNS.1 = localhost", "DNS.2 = host.docker.internal"]);

let ipIndex = 1;
if (lanIp) {
  altNames.add(`IP.${ipIndex} = ${lanIp}`);
  ipIndex += 1;
}
if (publicHost && /^\d{1,3}(\.\d{1,3}){3}$/.test(publicHost)) {
  altNames.add(`IP.${ipIndex} = ${publicHost}`);
  ipIndex += 1;
} else if (publicHost) {
  altNames.add(`DNS.${altNames.size} = ${publicHost}`);
}

const sanBlock = [...altNames].join("\n");
const cn = publicHost || lanIp || "localhost";

const cnf = `[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = RU
ST = Local
L = Local
O = Innogram
OU = Dev
CN = ${cn}

[v3_req]
subjectAltName = @alt_names
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
${sanBlock}
`;

fs.mkdirSync(certsDir, { recursive: true });
fs.writeFileSync(opensslCnf, cnf, "utf8");

const keyPath = path.join(certsDir, "privkey.pem");
const certPath = path.join(certsDir, "fullchain.pem");

const result = spawnSync(
  "openssl",
  [
    "req",
    "-x509",
    "-nodes",
    "-days",
    "825",
    "-newkey",
    "rsa:2048",
    "-keyout",
    keyPath,
    "-out",
    certPath,
    "-config",
    opensslCnf,
    "-extensions",
    "v3_req",
  ],
  { stdio: "inherit", cwd: repoRoot },
);

if (result.status !== 0) {
  console.error("[certs] openssl failed. Install OpenSSL and retry.");
  process.exit(result.status ?? 1);
}

console.log("[certs] Wrote", certPath);
console.log("[certs] SAN:", sanBlock.replace(/\n/g, ", "));
