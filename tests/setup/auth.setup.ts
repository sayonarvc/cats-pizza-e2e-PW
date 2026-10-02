import { test as setup } from '@playwright/test';
import { authFile } from '../fixtures/app.fixture';
import { HomePage } from '../pom/pages/HomePage';
import { AuthModal } from '../pom/pages/AuthModal';
import { testUsers } from './../pom/data/testData';

setup('Authenticate exsisting user', async ({ page }) => {
  const homePage = new HomePage(page);
  const authModal = new AuthModal(page);

  await homePage.openPage();
  await authModal.signIn(testUsers.existing.email, testUsers.existing.password);
  await authModal.assertSignedIn();

  await page.context().storageState({ path: authFile });
});
