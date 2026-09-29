import { APIRequestContext } from '@playwright/test';

export class CleanupApi {
  constructor(
    private request: APIRequestContext,
    private apiUrl: string = 'http://localhost:3001/api',
  ) {
    this.request = request;
  }

  async deleteOrdersByEmail(email: string) {
    await this.request.delete(`${this.apiUrl}/orders/by-email`, {
      data: {
        email: email,
      },
    });
  }

  async deleteUserByEmail(email: string) {
    await this.request.delete(`${this.apiUrl}/users/by-email`, {
      data: {
        email: email,
      },
    });
  }
}
