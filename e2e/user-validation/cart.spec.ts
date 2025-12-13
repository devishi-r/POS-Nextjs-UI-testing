import { test, expect } from "@playwright/test";

test.describe("Cart – Quantity & Totals E2E", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/cart");
  });

  test("incrementing quantity updates subtotal and total", async ({ page }) => {
    const plus = page.getByTestId("qty-plus-0");
    const subtotal = page.getByTestId("subtotal-0");
    const finalTotal = page.getByTestId("final-total");

    await plus.click(); // qty: 2
    await expect(subtotal).toContainText("2000");
    await expect(finalTotal).toContainText("2020"); // laptop + mouse

    await plus.click(); // qty: 3
    await expect(subtotal).toContainText("3000");
  });

  test("cannot increment beyond stock", async ({ page }) => {
    const plus = page.getByTestId("qty-plus-0");
    const error = page.getByTestId("qty-error-0");

    for (let i = 0; i < 6; i++) {
      await plus.click();
    }

    await expect(error).toContainText("stock");
  });

  test("manual input updates subtotal", async ({ page }) => {
    const input = page.getByTestId("qty-input-0");
    await input.fill("3");

    await expect(page.getByTestId("subtotal-0")).toContainText("3000");
  });

  test("entering invalid quantity shows validation", async ({ page }) => {
    const input = page.getByTestId("qty-input-0");

    await input.fill("abc");

    await expect(page.getByTestId("qty-error-0")).toContainText("valid number");
  });
});
