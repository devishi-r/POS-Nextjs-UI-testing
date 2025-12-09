import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',                   // Folder where your tests live
  timeout: 30 * 1000,                   // 30s per test
  expect: {
    timeout: 5000                       // 5s for expect assertions
  },

  fullyParallel: true,                  // Run tests in parallel
  forbidOnly: !!process.env.CI,         // Prevent .only on CI
  retries: process.env.CI ? 2 : 0,      // Retry on CI
  workers: process.env.CI ? 2 : undefined,

  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',   // Your local dev server
    actionTimeout: 0,
    trace: 'on-first-retry',            // Trace only when needed
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: true                      // Set to false to watch visually
  },

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    // Uncomment if you want:
    // {
    //   name: 'Firefox',
    //   use: { ...devices['Desktop Firefox'] }
    // },
    // {
    //   name: 'WebKit',
    //   use: { ...devices['Desktop Safari'] }
    // },
  ],

  webServer: {
    command: 'npm run dev',             // Start Next.js dev server
    url: 'http://localhost:3000',
    reuseExistingServer: true,          // Faster runs
    timeout: 30 * 1000
  }
});
