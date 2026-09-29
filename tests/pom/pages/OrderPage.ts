import { type Page, expect } from '@playwright/test';

export class OrderPage {
  constructor(private page: Page) {
    this.page = page;
  }

  async openOrderPage() {
    await this.page.getByTestId('openOrdersButton').click();
  }

  async assertHasOrder() {
    await expect(this.page.getByTestId('ordersList').getByRole('listitem').first()).toBeVisible();
  }
}
