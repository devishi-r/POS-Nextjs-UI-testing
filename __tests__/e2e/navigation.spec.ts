// tests/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Global Navigation', () => {

  test('Landing page CTA navigates to Home Dashboard', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('typewriter-text')).toBeVisible();

    await page.getByRole('link', { name: /home/i }).click();

    await expect(
      page.getByText(/Don't Forget To Rest Your Soul/i)
    ).toBeVisible();

    await expect(page).toHaveURL(/home/);
  });


  test.describe('Sidebar Navigation', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/home');
      await expect(page.locator('nav.grid.items-start')).toBeVisible();
    });

    test('All sidebar links navigate correctly', async ({ page }) => {
      const links = page.locator('nav a');
      const count = await links.count();

      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');

        await link.click();

        await expect(page).toHaveURL(href!, { timeout: 5000 });

        //ensure something meaningful rendered
        const contentLoaded = await page.locator('main, h1, h2, h3, div').count();
        expect(contentLoaded).toBeGreaterThan(0);

        await page.goto('/home');
      }
    });
  });

});
