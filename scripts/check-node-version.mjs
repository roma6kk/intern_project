import process from "node:process";

const major = Number(process.versions.node.split(".")[0]);

// Prisma (engines) в этом проекте стабильно работает только на Node 20+,
// а на Node 24 возникает ошибка вида: "Cannot find module '@prisma/engines'".
// Чтобы не тратить время на отладку локально, блокируем неподдерживаемые версии.
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

