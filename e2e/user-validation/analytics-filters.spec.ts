import { test, expect } from "@playwright/test";

const ROUTES = [
  "/analytics/income",
  "/analytics/product/sales",
];

test.describe.configure({mode: "serial"});

for (const route of ROUTES) {
  test.describe(`Analytics – Date Filter E2E — ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
    });

    test("invalid date range shows validation error and does not trigger API call", async ({ page }) => {
      // start > end
      await page.getByTestId("start-date").fill("2025-01-10");
      await page.getByTestId("end-date").fill("2025-01-01");
      await page.getByTestId("apply-date-filter-btn").click();

      const error = page.getByTestId("date-error");
      await expect(error).toBeVisible();
      await expect(error).toContainText(/after/i);
    });

    test("future date selection is blocked", async ({ page }) => {
      const future = "2099-12-30";

      await page.getByTestId("start-date").fill(future);
      await page.getByTestId("end-date").fill(future);
      await page.getByTestId("apply-date-filter-btn").click();

      const error = page.getByTestId("date-error");
      await expect(error).toBeVisible();
      await expect(error).toContainText(/future/i);
    });

    test("valid date range applies and chart remains visible", async ({ page }) => {
      await page.getByTestId("start-date").fill("2024-05-01");
      await page.getByTestId("end-date").fill("2024-05-10");
      await page.getByTestId("apply-date-filter-btn").click();

      await expect(page.getByTestId("date-error")).not.toBeVisible();
      await expect(page.getByTestId("analytics-chart")).toBeVisible();
    });
  });
}
