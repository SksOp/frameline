import { expect, test } from '@playwright/test';

test.describe('Dark mode theme support', () => {
  test('marketing page remains in light brand theme by default', async ({
    page,
  }) => {
    await page.goto('/');
    const isDark = await page
      .locator('html')
      .evaluate((el) => el.classList.contains('dark'));
    expect(isDark).toBe(false);

    // Verify marketing background
    const bg = await page
      .locator('.marketing')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgb(17, 17, 20)');
  });

  test('teleprompter app defaults to system preference and persists theme in localStorage', async ({
    page,
  }) => {
    // Emulate dark color scheme
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/teleprompter');

    // Root should resolve to dark because system is dark
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Toggle theme via header button to light
    const themeBtn = page.getByRole('button', {
      name: /Switch to light mode/i,
    });
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    // Now it should be light and saved in localStorage
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('frameline-theme'),
    );
    expect(storedTheme).toBe('light');

    // Reloading preserves light mode
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Toggle back to dark
    const toDarkBtn = page.getByRole('button', {
      name: /Switch to dark mode/i,
    });
    await toDarkBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const storedDark = await page.evaluate(() =>
      localStorage.getItem('frameline-theme'),
    );
    expect(storedDark).toBe('dark');
  });

  test('theme can be adjusted from Tune settings dialog', async ({ page }) => {
    await page.goto('/teleprompter');
    await page.getByRole('button', { name: /Tune|Settings/i }).first().click();

    const appearanceSelect = page.getByLabel('Appearance');
    await expect(appearanceSelect).toBeVisible();

    await appearanceSelect.selectOption('dark');
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(
      await page.evaluate(() => localStorage.getItem('frameline-theme')),
    ).toBe('dark');

    await appearanceSelect.selectOption('light');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    expect(
      await page.evaluate(() => localStorage.getItem('frameline-theme')),
    ).toBe('light');

    await appearanceSelect.selectOption('system');
    expect(
      await page.evaluate(() => localStorage.getItem('frameline-theme')),
    ).toBe('system');
  });

  test('navigating from dark teleprompter to marketing resets dark class', async ({
    page,
  }) => {
    await page.goto('/teleprompter');
    await page.evaluate(() => localStorage.setItem('frameline-theme', 'dark'));
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Click Frameline logo to go to marketing landing
    await page.getByRole('link', { name: 'Frameline' }).first().click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
});
