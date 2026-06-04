import process from "node:process";

if (process.env.SKIP_NODE_VERSION_CHECK === "1") {
  process.exit(0);
}

const major = Number(process.versions.node.split(".")[0]);

if (Number.isFinite(major) && major >= 24) {
  console.error(
    [
      "Unsupported Node.js version for this repo:",
      `  Detected: ${process.version}`,
      "",
      "This project requires Node 20 (as in CI) for Prisma engines to work.",
      "Install/switch to Node 20 and re-run: npm ci",
    ].join("\n"),
  );
  process.exit(1);
}

