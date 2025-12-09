import { test, expect } from '@playwright/test';

test.describe('Workflow E — Analytics UI Automation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
    await expect(page.locator('nav.grid')).toBeVisible();
  });

  // -- NAVIGATION --
  test('Sidebar navigation opens analytics pages', async ({ page }) => {

  const links = [
    { name: 'Total Products Sales', path: '/analytics/product/sales' },
    { name: 'Favorite Products', path: '/analytics/product/favorites' },
    { name: 'Income', path: '/analytics/income' },
  ];

  for (const l of links) {
    await page.goto('/home');
    await page.getByRole('button', { name: /show charts menu/i }).click();

    await page.getByRole('link', { name: l.name }).click();
    await expect(page).toHaveURL(l.path);
  }
});

  // -- SALES CHART --
  test('Sales analytics page renders correctly', async ({ page }) => {
    await page.goto('/analytics/product/sales');

    await expect(page.getByText(/Total Products Sales/i, { exact: false }))
      .toBeVisible();

    await expect(page.getByLabel(/Start/i)).toBeVisible();
    await expect(page.getByLabel(/End/i)).toBeVisible();

    await expect(page.locator('#chartOne .apexcharts-canvas')).toBeVisible();
  });

  // -- FAVORITES CHART --
  test('Favorite products page renders chart container', async ({ page }) => {
    await page.goto('/analytics/product/favorites');

    await expect(page.getByRole('heading', { name: /Top 5 Favorite Product/i }))
      .toBeVisible();

    await expect(page.locator('#chartThree .apexcharts-canvas')).toBeVisible();
  });

  // -- INCOME CHART --
  test('Income analytics page renders correctly', async ({ page }) => {
    await page.goto('/analytics/income');

    await expect(
      page.locator('p.font-semibold:has-text("Income")')
    ).toBeVisible();

    const dateInputs = page.locator('input[type="date"]');
    await expect(dateInputs.first()).toBeVisible();
    await expect(dateInputs.last()).toBeVisible();

    await expect(page.locator('#chartOne .apexcharts-canvas')).toBeVisible();
  });
});
