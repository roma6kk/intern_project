import { test, expect } from '@playwright/test';

test('User can sign up and see feed', async ({ page }) => {
  test.setTimeout(60_000);

  let signupAlertMessage: string | null = null;
  let lastSignupRequestFailed:
    | { url: string; method: string; failureText: string | null }
    | null = null;

  page.on('requestfailed', (req) => {
    const url = req.url();
    if (!url.includes('/auth/signup')) return;
    lastSignupRequestFailed = {
      url,
      method: req.method(),
      failureText: req.failure()?.errorText ?? null,
    };
  });

  page.once('dialog', async (dialog) => {
    signupAlertMessage = dialog.message();
    await dialog.dismiss();
  });

  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30_000 });

  await expect(page).toHaveURL(/\/login/, { timeout: 30_000 });
  const firstNameInput = page.getByPlaceholder(/first name/i);

  await expect(
    page.locator('button[type="button"]').filter({ hasText: /^Log In$/ }),
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

  const signUpSubmit = page.getByRole('button', { name: 'Create account', exact: true });
  await expect(signUpSubmit).toBeVisible({ timeout: 30_000 });
  await expect(signUpSubmit).toBeEnabled({ timeout: 30_000 });

  // Cross-origin requests (client :3002 → API :3000) trigger an OPTIONS preflight first.
  // Matching only `/auth/signup` would resolve on OPTIONS (e.g. 204) before the POST completes.
  const signupResponse = page.waitForResponse(
    (resp) =>
      resp.url().includes('/auth/signup') &&
      resp.request().method() === 'POST',
    { timeout: 60_000 },
  );

  const submit = signUpSubmit.click({ timeout: 30_000, force: true });

  try {
    const [, resp] = await Promise.all([submit, signupResponse]);
    if (resp.status() >= 400) {
      throw new Error(
        `Signup request failed: ${resp.status()} ${resp.statusText()}`,
      );
    }

    await page.waitForURL(/\/feed/, { timeout: 60_000 });
  } catch (e) {
    if (signupAlertMessage) {
      const extra =
        lastSignupRequestFailed != null
          ? ` (request failed: ${lastSignupRequestFailed.method} ${lastSignupRequestFailed.url} -> ${lastSignupRequestFailed.failureText ?? 'unknown'})`
          : '';
      throw new Error(`Signup failed: ${signupAlertMessage}${extra}`);
    }
    throw e;
  }

  await expect(page.getByText('Innogram')).toBeVisible();
});