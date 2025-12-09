// tests/orders.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Orders UI Automation (Frontend Only)', () => {

  //load Orders Page
  test('Orders page loads with core UI elements', async ({ page }) => {
    await page.goto('/orders');

    // Page Title
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();

    await expect(page.getByTestId('view-toggle-btn')).toBeVisible();
    await expect(page.getByTestId('add-product-btn')).toBeVisible();
    await expect(page.getByTestId('delete-product-btn')).toBeVisible();
  });

  // Add Product Modal - imitating workend of UI shell with no backend functionality
  // hence, only verifying if spinner button temporarily displays - it is the purely only UI response that can be tested
  test('Add Product button shows spinner and does not open modal (no backend)', async ({ page }) => {
    await page.goto('/orders');

    const addBtn = page.getByTestId('add-product-btn');

    await addBtn.click();

    await expect(addBtn.locator('.animate-spin')).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(addBtn.locator('.animate-spin')).toHaveCount(0);

    await expect(page.getByText('Add product')).toHaveCount(0);
    });


  //Delete Transaction button UI state
  test('Delete Transaction button is disabled when no transaction exists', async ({ page }) => {
    await page.goto('/orders');

    const deleteBtn = page.getByTestId('delete-product-btn');

    // Without backend, transactionId = null → delete disabled
    await expect(deleteBtn).toBeDisabled();
  });

  //table and bill view toggle
  test('Table/Bill view toggles correctly', async ({ page }) => {
    await page.goto('/orders');

    const toggle = page.getByTestId('view-toggle-btn');

    await expect(page.getByRole('columnheader', { name: 'Product' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Amount/i })).toBeVisible();

    await toggle.click();

    const billContainer = page.locator('.print-card-content');

    await expect(billContainer.getByText(/^Subtotal$/i)).toBeVisible();
    await expect(billContainer.getByText(/^Tax$/i)).toBeVisible();
    await expect(billContainer.getByText(/^Total$/i)).toBeVisible();

    await toggle.click();
    await expect(page.getByRole('columnheader', { name: 'Product' })).toBeVisible();
  });

  //print Button UI state
  test('Print button remains disabled with no data', async ({ page }) => {
    await page.goto('/orders');

    const toggle = page.getByTestId('view-toggle-btn');
    await toggle.click();

    const printBtn = page.getByTestId('print-btn');
    await expect(printBtn).toBeVisible();

    await expect(printBtn).toBeDisabled();
  });

  //fullscreen Toggle
  test('Fullscreen button toggles fullscreen mode', async ({ page }) => {
    await page.goto('/orders');

    const fullscreenBtn = page.getByTestId('fullscreen-btn');

    await expect(fullscreenBtn).toBeVisible();

    await fullscreenBtn.click();
    await page.waitForTimeout(500); //allow browser to apply fullscreen

    await page.evaluate(() => {
      if (!document.fullscreenElement) {
        throw new Error('Did not enter fullscreen');
      }
    });

    await fullscreenBtn.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      if (document.fullscreenElement) {
        throw new Error('Did not exit fullscreen');
      }
    });
  });

});
