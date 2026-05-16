import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: { boundaries },
    files: ["src/**/*.{ts,tsx}"],
    settings: {
      "boundaries/elements": [
        { type: "shared", pattern: "src/shared/**/*", mode: "file" },
        { type: "entities", pattern: "src/entities/**/*", mode: "file" },
        { type: "features", pattern: "src/features/**/*", mode: "file" },
        { type: "widgets", pattern: "src/widgets/**/*", mode: "file" },
        { type: "views", pattern: "src/views/**/*", mode: "file" },
        { type: "application", pattern: "src/application/**/*", mode: "file" },
        { type: "app", pattern: "src/app/**/*", mode: "file" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        2,
        {
          default: "disallow",
          rules: [
            { from: "shared", allow: ["shared"] },
            { from: "entities", allow: ["shared", "entities"] },
            { from: "features", allow: ["shared", "entities", "features"] },
            {
              from: "widgets",
              allow: ["shared", "entities", "features", "widgets", "application"],
            },
            {
              from: "views",
              allow: ["shared", "entities", "features", "widgets", "views", "application"],
            },
            {
              from: "application",
              allow: ["shared", "entities", "features", "widgets", "views", "application"],
            },
            {
              from: "app",
              allow: [
                "shared",
                "entities",
                "features",
                "widgets",
                "views",
                "application",
                "app",
              ],
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
