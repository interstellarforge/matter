import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  forbidOnly: Boolean(process.env["CI"]),
  retries: process.env["CI"] ? 1 : 0,
  reporter: "list",
  use: { browserName: "chromium" },
  // Built demos in production mode (`pnpm build` first).
  webServer: [
    {
      command: "pnpm --filter matter-example-nextjs start",
      url: "http://127.0.0.1:3101",
      reuseExistingServer: !process.env["CI"],
    },
    {
      command: "pnpm --filter matter-example-sveltekit start",
      url: "http://127.0.0.1:3102",
      reuseExistingServer: !process.env["CI"],
    },
  ],
});
