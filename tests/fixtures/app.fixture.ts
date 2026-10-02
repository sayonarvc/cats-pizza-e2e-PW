/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import { OrderPage } from './../pom/pages/OrderPage';
import { AuthModal } from './../pom/pages/AuthModal';
import { CheckoutPage } from './../pom/pages/CheckoutPage';
import { HomePage } from './../pom/pages/HomePage';
import path from 'path';
import process from 'process';

export const authFile = path.join(process.cwd(), 'playwright/.auth/exsisting-user.json');

// Declare the types of your fixtures.
type MyFixtures = {
  homePage: HomePage;
  authPage: AuthModal;
  checkoutPage: CheckoutPage;
  orderPage: OrderPage;
};

type AppOptions = {
  storageState: string | undefined;
};
// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
const appTest = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  authPage: async ({ page }, use) => {
    const authPage = new AuthModal(page);
    await use(authPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  orderPage: async ({ page }, use) => {
    const orderPage = new OrderPage(page);
    await use(orderPage);
  },
});

export const guestTest = appTest;
export const authorizedTest = appTest.extend<AppOptions>({
  storageState: authFile,
});
export { expect } from '@playwright/test';
