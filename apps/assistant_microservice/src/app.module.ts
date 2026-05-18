import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { AssistantModule } from "./assistant/assistant.module";
import { HealthModule } from "./health/health.module";
import path from "path";
import fs from "fs";

const rootEnvPath = path.resolve(process.cwd(), ".env");
const localEnvPath = path.resolve(
  process.cwd(),
  "apps/assistant_microservice/.env",
);

const envFilePaths = [
  fs.existsSync(rootEnvPath) ? rootEnvPath : undefined,
  fs.existsSync(localEnvPath) ? localEnvPath : undefined,
].filter(Boolean) as string[];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths.length > 0 ? envFilePaths : undefined,
    }),
    PrometheusModule.register({
      path: "/metrics",
      defaultMetrics: { enabled: true },
    }),
    HealthModule,
    AssistantModule,
  ],
})
export class AppModule {}
