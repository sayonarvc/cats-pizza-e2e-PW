// авторизация
// регистрация
// оформление заказа для неавторизованного пользователя
// оформление заказа для авторизованного пользователя
import { expect, test } from '@playwright/test';

test('Авторизация существующего пользователя', async ({ page }) => {
  page.goto('');

  await page.getByTestId('signInButton').click();
  await page.getByLabel('Email:').fill('test@test.ru');
  await page.getByLabel('Пароль:').fill('Qwerty');
  await page.getByTestId('signInOrSignUpButton').click();

  await expect(page.getByTestId('signOutButton')).toBeVisible();
  await expect(page.getByTestId('signOutButton')).toHaveText('Выйти');
});

test('Регистрация нового пользователя', async ({ page }) => {
  page.goto('');

  await page.getByTestId('signInButton').click();
  await page.getByTestId('registerButton').click();

  await page.getByLabel('Имя:').fill('Воробушек');
  await page.getByLabel('Email:').fill(`vorobey${Date.now()}@test.ru`);
  await page.getByLabel('Пароль:', { exact: true }).fill('Qwerty');
  await page.getByLabel('Повторите пароль:').fill('Qwerty');
  await page.getByTestId('signInOrSignUpButton').click();

  await expect(page.getByTestId('signOutButton')).toBeVisible();
  await expect(page.getByTestId('signOutButton')).toHaveText('Выйти');
});

test('Оформление заказа неавторизованным пользователем', async ({ page }) => {
  page.goto('');
});

test('Оформление заказа авторизованным пользователем', async ({ page }) => {
  page.goto('');
});
