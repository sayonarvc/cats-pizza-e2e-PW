import { test } from '../../fixtures/app.fixture';
import { testUsers, testAdress } from '../data/testData';
import { CleanupApi } from './../api/CleanupApi';

test.describe('Оформление заказа авторизованным и неавторизованным юзером', () => {
  test.describe.configure({ mode: 'serial' });
  test.afterEach(async ({ request }) => {
    const cleanupApi = new CleanupApi(request);
    await cleanupApi.deleteOrdersByEmail(testUsers.existing.email);
  });

  test('Оформление заказа неавторизованным пользователем', async ({
    homePage,
    orderPage,
    checkoutPage,
  }) => {
    await homePage.openPage();

    await homePage.addFirstCatToCart();
    await homePage.goToCheckoutFromCart();

    await checkoutPage.signInInCheckout(testUsers.existing.email, testUsers.existing.password);

    await checkoutPage.fillAdress(testAdress);
    await checkoutPage.submit();

    await orderPage.openOrderPage();
    await orderPage.assertHasOrder();
  });

  test('Оформление заказа авторизованным пользователем', async ({
    homePage,
    orderPage,
    checkoutPage,
    authPage,
  }) => {
    await homePage.openPage();

    await authPage.signIn(testUsers.existing.email, testUsers.existing.password);

    await homePage.addFirstCatToCart();
    await homePage.goToCheckoutFromCart();

    await checkoutPage.fillAdress(testAdress);
    await checkoutPage.submit();

    await orderPage.openOrderPage();
    await orderPage.assertHasOrder();
  });
});
