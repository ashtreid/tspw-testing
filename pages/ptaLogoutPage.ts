import { type Locator, type Page, expect } from "@playwright/test";
import { PtaLoginPage } from "./ptaLoginPage";

export class PtaLogoutPage {
  readonly page: Page;

  readonly logoutButton: Locator;
  readonly loggedInHeading: Locator;
  readonly loggedInMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoutButton = page.getByRole("link", { name: "Log out" });
    this.loggedInHeading = page.getByRole("heading", {
      name: "Logged In Successfully",
    });
    this.loggedInMessage = page.getByText(
      "Congratulations student. You successfully logged in!"
    );
  }

  async validateLoggedIn(
    url: string,
    expectedResult: "success" | "failure",
    errorMessageType?: "username" | "password"
  ): Promise<void> {
    const ptaLoginPage = new PtaLoginPage(this.page);

    if (expectedResult === "failure") {
      await Promise.all([
        ptaLoginPage.validateErrorMessageVisibility(true, errorMessageType),
        expect(this.page).not.toHaveURL(url),
        expect(this.loggedInHeading).toBeHidden(),
        expect(this.loggedInMessage).toBeHidden(),
        expect(this.logoutButton).toBeHidden(),
      ]);
    }

    if (expectedResult === "success") {
      await Promise.all([
        expect(this.page).toHaveURL(url),
        ptaLoginPage.validateErrorMessageVisibility(false),
        expect(this.loggedInHeading).toBeVisible(),
        expect(this.loggedInMessage).toBeVisible(),
        expect(this.logoutButton).toBeVisible(),
      ]);
    }
  }
}
