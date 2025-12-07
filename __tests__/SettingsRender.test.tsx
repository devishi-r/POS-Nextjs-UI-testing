import { render, screen, within } from "@testing-library/react";
import SettingsPage from "@/app/(root)/settings/page";

jest.mock("axios");
jest.spyOn(global.navigator, "onLine", "get").mockReturnValue(true);

describe("Settings Page", () => {
  test("renders Store Name and Tax Rate inputs", () => {
    render(<SettingsPage />);

    //
    // STORE NAME CARD
    //
    const storeHeading = screen.getByRole("heading", { name: /store name/i });

    // Cast to HTMLElement for TypeScript
    const storeCard = storeHeading.closest(".rounded-xl") as HTMLElement | null;
    expect(storeCard).not.toBeNull();

    const storeInput =
      within(storeCard!).queryByRole("textbox") ||
      within(storeCard!).queryByRole("spinbutton");

    expect(storeInput).not.toBeNull();


    //
    // TAX RATE CARD
    //
    const taxHeading = screen.getByRole("heading", { name: /tax rate/i });

    const taxCard = taxHeading.closest(".rounded-xl") as HTMLElement | null;
    expect(taxCard).not.toBeNull();

    const taxInput =
      within(taxCard!).queryByRole("spinbutton") ||
      within(taxCard!).queryByRole("textbox");

    expect(taxInput).not.toBeNull();
  });
});
