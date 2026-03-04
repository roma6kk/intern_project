import { test, expect } from '@playwright/test';

test('User can login and see feed', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('Username, phone number or email address').fill('userA@gmail.com');
  await page.getByPlaceholder('Password').fill('12345678');

  await page.getByRole('button', { name: 'Log In', exact: true }).click();

  await expect(page).toHaveURL(/\/feed/);

  await expect(page.getByText('Innogram')).toBeVisible();
});