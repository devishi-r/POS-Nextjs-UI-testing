import { test, expect } from "@playwright/test";

test.describe("Coupon Section – E2E", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/cart");
  });

  test("apply valid percent coupon updates final total", async ({ page }) => {
    await page.getByTestId("coupon-input").fill("SAVE10");
    await page.getByTestId("apply-coupon-btn").click();

    await expect(page.getByTestId("coupon-success")).toContainText("SAVE10");

    // Laptop 1000 + Mouse 20 = 1020
    // SAVE10 → discount 102
    await expect(page.getByTestId("final-total")).toContainText("918");
  });

  test("apply flat coupon updates final total", async ({ page }) => {
    await page.getByTestId("coupon-input").fill("FLAT50");
    await page.getByTestId("apply-coupon-btn").click();

    await expect(page.getByTestId("final-total")).toContainText("970");
  });

  test("prevents adding a second coupon", async ({ page }) => {
    await page.getByTestId("coupon-input").fill("SAVE10");
    await page.getByTestId("apply-coupon-btn").click();

    await page.getByTestId("coupon-input").fill("FLAT50");
    await page.getByTestId("apply-coupon-btn").click();

    await expect(page.getByTestId("coupon-error")).toContainText("already");
  });

  test("remove coupon resets total", async ({ page }) => {
    await page.getByTestId("coupon-input").fill("SAVE10");
    await page.getByTestId("apply-coupon-btn").click();

    await page.getByTestId("clear-coupon-btn").click();

    await expect(page.getByTestId("final-total")).toContainText("1020");
  });
});
