import { test, expect } from '@playwright/test';

test('User can sign up and see feed', async ({ page }) => {
  test.setTimeout(60_000);

  let signupAlertMessage: string | null = null;
  page.once('dialog', async (dialog) => {
    signupAlertMessage = dialog.message();
    await dialog.dismiss();
  });

  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30_000 });

  await expect(page).toHaveURL(/\/login/, { timeout: 30_000 });
  const firstNameInput = page.getByPlaceholder(/first name/i);

  await expect(
    page.getByRole('button', { name: 'Log In', exact: true }),
  ).toBeVisible({
    timeout: 30_000,
  });

  const signUpToggle = page.getByRole('button', { name: /^sign up$/i });
  await expect(signUpToggle).toBeVisible({ timeout: 30_000 });

  for (let attempt = 0; attempt < 6; attempt++) {
    await signUpToggle.click();

    try {
      await firstNameInput.waitFor({ state: 'visible', timeout: 2_000 });
      break;
    } catch {
      await page.waitForTimeout(750);
    }
  }

  await expect(firstNameInput).toBeVisible({ timeout: 30_000 });

  const unique = Date.now();
  const firstName = `User${unique}`;
  const username = `user_${unique}`;
  const email = `user_${unique}@example.com`;
  const password = '12345678';

  await firstNameInput.fill(firstName);
  await page.getByPlaceholder(/username/i).fill(username);
  await page.getByPlaceholder(/^email$/i).fill(email);
  await page.getByPlaceholder(/^password$/i).fill(password);

  const signUpSubmit = page.locator('button').filter({ hasText: /create account/i });
  await expect(signUpSubmit.first()).toBeVisible({ timeout: 30_000 });

  const signupResponse = page.waitForResponse(
    (resp) => resp.url().includes('/auth/signup'),
    { timeout: 30_000 },
  );

  const submit = signUpSubmit.first().click();

  try {
    const [, resp] = await Promise.all([submit, signupResponse]);
    if (resp.status() >= 400) {
      throw new Error(
        `Signup request failed: ${resp.status()} ${resp.statusText()}`,
      );
    }

    await page.waitForURL(/\/feed/, { timeout: 30_000 });
  } catch (e) {
    if (signupAlertMessage) {
      throw new Error(`Signup failed: ${signupAlertMessage}`);
    }
    throw e;
  }

  await expect(page.getByText('Innogram')).toBeVisible();
});