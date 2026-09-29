import { expect, test } from '@playwright/test';

const TEST_USER_EMAIL = 'test@test.ru';
const TEST_USER_PASSWORD = 'Qwerty';
const API_URL = 'http://localhost:3001/api';

test.describe('Авторизация и регистрация пользователя', () => {
  let createdUserEmail: string | null = null;

  test.afterAll(async ({ request }) => {
    if (!createdUserEmail) return;

    await request.delete(`${API_URL}/users/by-email`, {
      data: {
        email: createdUserEmail,
      },
    });

    createdUserEmail = null;
  });

  test('Авторизация существующего пользователя', async ({ page }) => {
    page.goto('');

    await page.getByTestId('signInButton').click();
    await page.getByLabel('Email:').fill(TEST_USER_EMAIL);
    await page.getByLabel('Пароль:').fill(TEST_USER_PASSWORD);
    await page.getByTestId('signInOrSignUpButton').click();

    await expect(page.getByTestId('signOutButton')).toBeVisible();
    await expect(page.getByTestId('signOutButton')).toHaveText('Выйти');
  });

  test('Регистрация нового пользователя', async ({ page }) => {
    createdUserEmail = `vorobey${Date.now()}@test.ru`;

    page.goto('');

    await page.getByTestId('signInButton').click();
    await page.getByTestId('registerButton').click();

    await page.getByLabel('Имя:').fill('Воробушек');
    await page.getByLabel('Email:').fill(createdUserEmail);
    await page.getByLabel('Пароль:', { exact: true }).fill(TEST_USER_PASSWORD);
    await page.getByLabel('Повторите пароль:').fill(TEST_USER_PASSWORD);
    await page.getByTestId('signInOrSignUpButton').click();

    await expect(page.getByTestId('signOutButton')).toBeVisible();
    await expect(page.getByTestId('signOutButton')).toHaveText('Выйти');
  });
});

test.describe('Оформление заказа авторизованным и неавторизованным юзером', () => {
  test.describe.configure({ mode: 'serial' });
  test.afterEach(async ({ request }) => {
    await request.delete(`${API_URL}/orders/by-email`, {
      data: {
        email: TEST_USER_EMAIL,
      },
    });
  });

  test('Оформление заказа неавторизованным пользователем', async ({ page }) => {
    page.goto('');

    await page.getByTestId('signInButton').click();
    await page.getByLabel('Email:').fill(TEST_USER_EMAIL);
    await page.getByLabel('Пароль:').fill(TEST_USER_PASSWORD);
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

    await page.getByLabel('Email:').fill(TEST_USER_EMAIL);
    await page.getByLabel('Пароль:', { exact: true }).fill(TEST_USER_PASSWORD);
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
});
