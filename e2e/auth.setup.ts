import { test as setup, expect } from '@playwright/test';

const TEST_EMAIL = process.env.E2E_EMAIL || 'taka.k.yama@gmail.com';
const TEST_PASSWORD = process.env.E2E_PASSWORD || 'JGlow2026!';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /メール/i }).fill(TEST_EMAIL);
  await page.locator('input[type="password"]').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /ログイン/i }).click();

  // Wait for redirect (login success)
  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 15_000,
  });

  await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
