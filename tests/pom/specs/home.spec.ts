import { guestTest as test } from '../../fixtures/app.fixture';

test('Проверка каталога и отображение товаров', async ({ homePage }) => {
  await homePage.openPage();

  await homePage.assertLoaded();
  await homePage.assertCardsVisible();
});

test('Добавление первого товара в корзину и отображение числа в корзине', async ({ homePage }) => {
  await homePage.openPage();

  await homePage.addFirstCatToCart();
  await homePage.assertCardBadgeCount(1);
});

test('Проверка открытия и перехода на страницу Корзина', async ({ homePage }) => {
  await homePage.openPage();

  await homePage.addFirstCatToCart();
  await homePage.openCart();
  await homePage.goToCardPage();
  await homePage.assertCartPageOpenned();
});
