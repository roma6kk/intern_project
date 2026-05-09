import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const rootEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const requiredEnvKeys = [
    "ASSISTANT_PORT",
    "ASSISTANT_SERVICE_SECRET",
    "LLM_API_KEY",
    "LLM_BASE_URL",
    "LLM_MODEL",
    "LLM_TIMEOUT_MS",
    "LLM_JSON_MODE",
  ] as const;
  const selectedEnvEntries = requiredEnvKeys
    .map((key) => `${key}=${process.env[key] ?? "<not-set>"}`)
    .join("\n");
  const port = Number(process.env.ASSISTANT_PORT);
  Logger.log(
    `Starting assistant microservice with selected environment variables:\n${selectedEnvEntries}`,
    "Bootstrap",
  );
  await app.listen(port);
  Logger.log(`Assistant microservice listening on ${port}`, "Bootstrap");
}

bootstrap().catch((err) => {
  Logger.error(err);
  process.exit(1);
});
