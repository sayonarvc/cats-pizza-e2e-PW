import { type Page, expect } from '@playwright/test';

export class AuthModal {
  constructor(private page: Page) {
    this.page = page;
  }

  async openAuthModal() {
    await this.page.getByTestId('signInButton').click();
  }

  async openRegisterModal() {
    await this.page.getByTestId('registerButton').click();
  }

  async signIn(email: string, password: string) {
    await this.openAuthModal();
    await this.page.getByLabel('Email:').fill(email);
    await this.page.getByLabel('Пароль:').fill(password);
    await this.page.getByTestId('signInOrSignUpButton').click();
  }

  async signUp(name: string, email: string, password: string) {
    await this.openAuthModal();
    await this.openRegisterModal();
    await this.page.getByLabel('Имя:').fill(name);
    await this.page.getByLabel('Email:').fill(email);
    await this.page.getByLabel('Пароль:', { exact: true }).fill(password);
    await this.page.getByLabel('Повторите пароль:').fill(password);
    await this.page.getByTestId('signInOrSignUpButton').click();
  }

  async assertSignedIn() {
    await expect(this.page.getByTestId('signOutButton')).toBeVisible();
    await expect(this.page.getByTestId('signOutButton')).toHaveText('Выйти');
  }
}
