import { test, expect } from '@playwright/test';
// Session isolation is handled by playwright.config.ts via storageState: { cookies: [], origins: [] }
// Every test starts with a completely clean browser — no Supabase session can leak in.

test('login page has correct heading', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
});

test('onboarding link works', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('link', { name: /Sign up/i }).click();
  await expect(page).toHaveURL(/.*signup/);
  await expect(page.getByRole('heading', { name: /Create an account/i })).toBeVisible();
});
