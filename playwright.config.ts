import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4321'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
      // The Firefox project owns ticket 16's unsupported-browser check, which asserts the
      // absence of a view transition and would fail in a browser that supports the at-rule.
      testIgnore: /view-transitions-firefox\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
      testMatch: /view-transitions-firefox\.spec\.ts/,
    },
  ],
  // `--ignore-lock` keeps astro preview in the foreground. Without it, astro 7.3.6
  // auto-backgrounds under agent/CI environments and Playwright reports the process
  // as exited early. `test:e2e` assumes `pnpm build` already produced ./dist.
  webServer: {
    command: 'pnpm preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
