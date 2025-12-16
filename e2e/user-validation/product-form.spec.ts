import { test, expect } from "@playwright/test";

test.describe("Product Form – E2E", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/product");
  });

  // empty form validation
  test("shows validation errors for empty form", async ({ page }) => {
    await page.getByTestId("submit-btn").click();

    await expect(page.getByTestId("name-error")).toBeVisible();
    await expect(page.getByTestId("category-error")).toBeVisible();
    await expect(page.getByTestId("price-error")).toBeVisible();

    //No stock-error since empty stock is allowed 
    await expect(page.getByTestId("stock-error")).not.toBeVisible();

    // qty-error also does not show because qty default is empty, becomes "Quantity must be at least 1"
    await expect(page.getByTestId("qty-error")).toBeVisible();
  });

  test("shows numeric validation errors", async ({ page }) => {
    await page.getByTestId("name-input").fill("Laptop");
    await page.getByTestId("category-input").fill("Electronics");
    await page.getByTestId("price-input").fill("-10");
    await page.getByTestId("stock-input").fill("-2");
    await page.getByTestId("qty-input").fill("5");

    await page.getByTestId("submit-btn").click();

    await expect(page.getByTestId("price-error")).toContainText("greater than 0");
    await expect(page.getByTestId("stock-error")).toContainText("cannot be negative");
  });

  test("successful product submission displays JSON output", async ({ page }) => {
    await page.getByTestId("name-input").fill("Laptop");
    await page.getByTestId("category-input").fill("Electronics");
    await page.getByTestId("price-input").fill("1000");
    await page.getByTestId("stock-input").fill("5");
    await page.getByTestId("qty-input").fill("1");

    await page.getByTestId("submit-btn").click();

    const jsonBox = page.getByTestId("product-json-output");

    await expect(jsonBox).toBeVisible();
    await expect(jsonBox).toContainText(`"name": "Laptop"`);
    await expect(jsonBox).toContainText(`"category": "Electronics"`);
    await expect(jsonBox).toContainText(`"price": 1000`);
    await expect(jsonBox).toContainText(`"stock": 5`);
    await expect(jsonBox).toContainText(`"qty": 1`);
  });
});
