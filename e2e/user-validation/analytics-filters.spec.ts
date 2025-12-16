import { test, expect } from "@playwright/test";

const ROUTES = [
  "/analytics/income",
  "/analytics/product/sales",
];

test.describe.configure({ mode: "serial" });

for (const route of ROUTES) {
  test.describe(`Analytics – Date Filter E2E — ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
    });

    test("invalid date range is handled safely", async ({ page }) => {
      await page.getByTestId("start-date").fill("2025-01-10");
      await page.getByTestId("end-date").fill("2025-01-01");
      await page.getByTestId("apply-date-filter-btn").click();

      // app remains on same page
      await expect(page).toHaveURL(route);

      // page intact
      await expect(page.locator("body")).toBeVisible();
    });

    test("future date selection is rejected safely", async ({ page }) => {
      const future = "2099-12-30";

      await page.getByTestId("start-date").fill(future);
      await page.getByTestId("end-date").fill(future);
      await page.getByTestId("apply-date-filter-btn").click();

      // no navigation
      await expect(page).toHaveURL(route);

      // page intact
      await expect(page.locator("body")).toBeVisible();
    });

    test("valid date range applies without breaking UI", async ({ page }) => {
      await page.getByTestId("start-date").fill("2024-05-01");
      await page.getByTestId("end-date").fill("2024-05-10");
      await page.getByTestId("apply-date-filter-btn").click();

      // checking chart existence
      await expect(page.getByTestId("analytics-chart")).toBeVisible();
    });
  });
}
