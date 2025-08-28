import { test, expect } from '@playwright/test';

test.describe('Owner Access Control', () => {
  test.use({
    storageState: 'e2e/fixtures/owner.json',
  });

  test('should allow owner to access all admin pages', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await expect(page).toHaveURL('http://localhost:3000/admin');

    await page.goto('http://localhost:3000/admin/users');
    await expect(page).toHaveURL('http://localhost:3000/admin/users');

    await page.goto('http://localhost:3000/admin/products');
    await expect(page).toHaveURL('http://localhost:3000/admin/products');
  });
});
