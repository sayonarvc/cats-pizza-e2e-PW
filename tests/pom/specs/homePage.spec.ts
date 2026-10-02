import { test, expect } from '@playwright/test';

test('Check header', async ({ page }) => {
  await page.goto('');
  const header = page.getByTestId('homePageHeader');

  await expect(header).toBeVisible();
});

test('Check card list', async ({ page }) => {
  await page.goto('');
  const firstCard = page.getByTestId('catCard_0');
  const cardListItems = page.getByTestId(/catCard/);

  await expect(firstCard).toBeVisible();
  await expect(await cardListItems.count()).toBeGreaterThan(0);
  await expect(await cardListItems.count()).toBe(9);
});
