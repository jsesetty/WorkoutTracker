import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const nodeExe = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, 'Programs', 'nodejs', 'node.exe')
  : 'node';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `"${nodeExe}" server.js`,
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
