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

  await page.getByTestId('signInButton').click();
  await page.getByLabel('Email:').fill('test@test.ru');
  await page.getByLabel('Пароль:').fill('Qwerty');
  await page.getByTestId('signInOrSignUpButton').click();

  await expect(page.getByTestId('signOutButton')).toBeVisible();
  await expect(page.getByTestId('signOutButton')).toHaveText('Выйти');

  await page.getByTestId('catCard_0').getByTestId('addToCartButton').click();
  await page.getByTestId('catModalAddButton').click();

  await page.getByTestId('openCartButton').click();

  await page.getByTestId('goToCartPageButton').click();
  await page.getByTestId('makeOrderButton').click();

  await page.getByLabel('Город*:').fill('Екатеринбург');
  await page.getByLabel('Улица*:').fill('8 марта');
  await page.getByLabel('Дом*:').fill('146');
  await page.getByLabel('Квартира:').fill('7');
  await page.getByLabel('Комментарий курьеру:').fill(`Домофон работает только для воробьев`);
  await page.getByTestId('confirmOrderButton').click();

  await expect(page.getByTestId('modalTitle')).toHaveText('Заказ оформлен');
  await page.getByTestId('closeSubmittedModalButton').click();

  await page.getByTestId('openOrdersButton').click();
  await expect(page.getByTestId('ordersList').getByRole('listitem').first()).toBeVisible();
});

test('Оформление заказа авторизованным пользователем', async ({ page }) => {
  page.goto('');

  await page.getByTestId('catCard_0').getByTestId('addToCartButton').click();
  await page.getByTestId('catModalAddButton').click();

  await page.getByTestId('openCartButton').click();

  await page.getByTestId('goToCartPageButton').click();
  await page.getByTestId('makeOrderButton').click();

  await page.getByLabel('Email:').fill('test@test.ru');
  await page.getByLabel('Пароль:', { exact: true }).fill('Qwerty');
  await page.getByTestId('signInOrSignUpButton').click();

  await page.getByLabel('Город*:').fill('Екатеринбург');
  await page.getByLabel('Улица*:').fill('8 марта');
  await page.getByLabel('Дом*:').fill('146');
  await page.getByLabel('Квартира:').fill('7');
  await page.getByLabel('Комментарий курьеру:').fill(`Домофон работает только для воробьев`);
  await page.getByTestId('confirmOrderButton').click();

  await expect(page.getByTestId('modalTitle')).toHaveText('Заказ оформлен');
  await page.getByTestId('closeSubmittedModalButton').click();

  await page.getByTestId('openOrdersButton').click();
  await expect(page.getByTestId('ordersList').getByRole('listitem').first()).toBeVisible();
});
