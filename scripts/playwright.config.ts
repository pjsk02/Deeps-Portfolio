import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const replitChromium = "/repl/tools/bin/chromium";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 2,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 8_000 },
  outputDir: "../generated-artifacts/playwright-results",
  reporter: [
    ["list"],
    ["json", { outputFile: "../generated-artifacts/playwright-results.json" }],
    ["html", { outputFolder: "../generated-artifacts/playwright-report", open: "never" }],
  ],
  use: {
    baseURL: "http://localhost:80",
    browserName: "chromium",
    viewport: { width: 1440, height: 1000 },
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      ...(existsSync(replitChromium) ? { executablePath: replitChromium } : {}),
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
  },
});
