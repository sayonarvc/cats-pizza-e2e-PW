import { test, expect } from '@playwright/test';

test('Проверка открытия главной страницы', async ({ page }) => {
  await page.goto('');

  const header = page.getByTestId('homePageHeader');

  await expect(header).toBeVisible();
});
