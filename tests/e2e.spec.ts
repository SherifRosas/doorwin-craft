import { test, expect } from '@playwright/test';

test('home -> dashboard (without token shows prompt)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=DoorWin Craft')).toBeVisible();
  await page.goto('/dashboard');
  await expect(page.locator('text=Please log in')).toBeVisible();
});

test('protected API trial access (default org)', async ({ request }) => {
  const res = await request.get('/api/protected-example', {
    headers: { 'x-org-id': 'default-org' },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.ok).toBeTruthy();
});







