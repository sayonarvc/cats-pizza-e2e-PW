import { type Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {
    this.page = page;
  }

  async openPage() {
    await this.page.goto('/');
  }

  async addFirstCatToCart() {
    await this.page.getByTestId('catCard_0').getByTestId('addToCartButton').click();
    await this.page.getByTestId('catModalAddButton').click();
  }

  async goToCheckoutFromCart() {
    await this.page.getByTestId('openCartButton').click();
    await this.page.getByTestId('goToCartPageButton').click();
    await this.page.getByTestId('makeOrderButton').click();
  }
}
