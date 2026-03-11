import { test, expect } from '@playwright/test';

test('User can sign up and see feed', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('button', { name: 'Sign up', exact: true }).click();

  const unique = Date.now();
  const firstName = `User${unique}`;
  const username = `user_${unique}`;
  const email = `user_${unique}@example.com`;
  const password = '12345678';

  await page.getByPlaceholder('First Name').fill(firstName);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);

  await page.getByRole('button', { name: 'Create Account', exact: true }).click();

  await expect(page).toHaveURL(/\/feed/);

  await expect(page.getByText('Innogram')).toBeVisible();
});