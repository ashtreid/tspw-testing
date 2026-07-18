import { type Locator, type Page, expect } from "@playwright/test";

export class PtaLoginPage {
  readonly page: Page;

  readonly loginButton: Locator;
  readonly passwordField: Locator;
  readonly usernameField: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginButton = page.getByRole("button", { name: "Submit" });

    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.usernameField = page.getByRole("textbox", { name: "Username" });
  }

  errorMessage(messageType: "username" | "password"): Locator {
    return this.page
      .locator("#error")
      .getByText(`Your ${messageType} is invalid!`);
  }

  async loginToPta(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async validateErrorMessageVisibility(
    isErrorMessageVisible: boolean,
    whichError?: "username" | "password"
  ): Promise<void> {
    if (isErrorMessageVisible === false) {
      await Promise.all([
        expect(this.errorMessage("username")).toBeHidden(),
        expect(this.errorMessage("password")).toBeHidden(),
      ]);
    }

    if (whichError === "username") {
      await Promise.all([
        expect(this.errorMessage("username")).toBeVisible(),
        expect(this.errorMessage("password")).toBeHidden(),
      ]);
    } else if (whichError === "password") {
      await Promise.all([
        expect(this.errorMessage("username")).toBeHidden(),
        expect(this.errorMessage("password")).toBeVisible(),
      ]);
    }
  }


}
