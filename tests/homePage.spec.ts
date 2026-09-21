import { test, expect } from '@playwright/test';

test('Проверка открытия главной страницы', async ({ page }) => {
  await page.goto('');

  await expect(page.getByRole('heading', { name: 'Заказ котиков' })).toBeVisible();
});
