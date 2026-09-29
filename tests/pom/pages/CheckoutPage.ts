import { type Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {
    this.page = page;
  }

  async signInInCheckout(email: string, password: string) {
    await this.page.getByLabel('Email:').fill(email);
    await this.page.getByLabel('Пароль:', { exact: true }).fill(password);
    await this.page.getByTestId('signInOrSignUpButton').click();
  }

  async fillAdress(adress: {
    city: string;
    street: string;
    house: string;
    appartment: string;
    comment: string;
  }) {
    await this.page.getByLabel('Город*:').fill(adress.city);
    await this.page.getByLabel('Улица*:').fill(adress.street);
    await this.page.getByLabel('Дом*:').fill(adress.house);
    await this.page.getByLabel('Квартира:').fill(adress.appartment);
    await this.page.getByLabel('Комментарий курьеру:').fill(adress.comment);
  }

  async submit() {
    await this.page.getByTestId('confirmOrderButton').click();
    await expect(this.page.getByTestId('modalTitle')).toHaveText('Заказ оформлен');
    await this.page.getByTestId('closeSubmittedModalButton').click();
  }
}
