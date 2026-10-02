import { test } from '../../fixtures/app.fixture';
import { testUsers } from '../data/testData';
import { CleanupApi } from '../api/CleanupApi';

test.describe('Авторизация и регистрация пользователя', () => {
  let createdUserEmail: string | null = null;

  test.afterAll(async ({ request }) => {
    if (!createdUserEmail) return;

    const cleanupApi = new CleanupApi(request);
    await cleanupApi.deleteUserByEmail(createdUserEmail);

    createdUserEmail = null;
  });

  test('Авторизация существующего пользователя', async ({ homePage, authPage }) => {
    await homePage.openPage();

    await authPage.signIn(testUsers.existing.email, testUsers.existing.password);
    await authPage.assertSignedIn();
  });

  test('Регистрация нового пользователя', async ({ homePage, authPage }) => {
    createdUserEmail = `vorobey${Date.now()}@test.ru`;
    await homePage.openPage();

    await authPage.signUp('Тест', createdUserEmail, testUsers.existing.password);
    await authPage.assertSignedIn();
  });
});
